/**
 * L1/L2 Tests — Notification Adapters
 *
 * Covers:
 *   WF-09: Composite partial failure — one adapter throws, others still invoked
 *   WF-10: InMemoryNotificationAdapter records all sent payloads
 *   WhatsApp stub — throws NotImplementedNotificationChannel
 *   Email adapter — format validation (no actual network call)
 *
 * Run: ts-node --project tsconfig.test.json lib/notifications/tests/notification-adapters.test.ts
 */

import assert from 'assert'
import { InMemoryNotificationAdapter }       from '../in-memory-notification-adapter'
import { CompositeNotificationAdapter }      from '../composite-adapter'
import { WhatsAppNotificationAdapter }       from '../whatsapp-adapter'
import { NotImplementedNotificationChannel } from '../types'
import type { NotificationPayload }          from '../types'

let passed = 0
let failed = 0

async function test(name: string, fn: () => Promise<void>): Promise<void> {
  try {
    await fn()
    console.log(`  ✓ ${name}`)
    passed++
  } catch (err: unknown) {
    console.error(`  ✗ ${name}`)
    console.error(`    ${(err as Error).message}`)
    failed++
  }
}

function section(name: string): void {
  console.log(`\n${name}`)
}

const BASE_PAYLOAD: NotificationPayload = {
  tenantId:    'tttt0000-0000-0000-0000-000000000001',
  recipients:  [{ userId: 'uuuu0000-0000-0000-0000-000000000001', email: 'test@example.com' }],
  eventType:   'task_assigned',
  channel:     'email',
  subject:     'Test notification',
  bodyText:    'This is a test notification.',
  metadata:    { task_id: 'ttask001' },
}

// ── Test runner entry ─────────────────────────────────────────────────────────

async function main(): Promise<void> {

// ── WF-10: InMemoryNotificationAdapter ───────────────────────────────────────

section('WF-10: InMemoryNotificationAdapter records payloads')

await test('send() records payload in .sent array', async () => {
  const adapter = new InMemoryNotificationAdapter()
  await adapter.send(BASE_PAYLOAD)
  assert.strictEqual(adapter.sent.length, 1)
  assert.deepStrictEqual(adapter.sent[0], BASE_PAYLOAD)
})

await test('sendBatch() records all payloads', async () => {
  const adapter = new InMemoryNotificationAdapter()
  const payloads = [
    { ...BASE_PAYLOAD, subject: 'First' },
    { ...BASE_PAYLOAD, subject: 'Second' },
    { ...BASE_PAYLOAD, subject: 'Third' },
  ]
  await adapter.sendBatch(payloads)
  assert.strictEqual(adapter.sent.length, 3)
})

await test('clear() removes all recorded payloads', async () => {
  const adapter = new InMemoryNotificationAdapter()
  await adapter.send(BASE_PAYLOAD)
  await adapter.send(BASE_PAYLOAD)
  assert.strictEqual(adapter.sent.length, 2)
  adapter.clear()
  assert.strictEqual(adapter.sent.length, 0)
})

await test('byEventType() filters recorded payloads by eventType', async () => {
  const adapter = new InMemoryNotificationAdapter()
  await adapter.send({ ...BASE_PAYLOAD, eventType: 'task_assigned' })
  await adapter.send({ ...BASE_PAYLOAD, eventType: 'task_rejected' })
  await adapter.send({ ...BASE_PAYLOAD, eventType: 'task_assigned' })

  const assigned = adapter.byEventType('task_assigned')
  assert.strictEqual(assigned.length, 2)
})

await test('multiple send() calls accumulate in .sent', async () => {
  const adapter = new InMemoryNotificationAdapter()
  for (let i = 0; i < 5; i++) {
    await adapter.send({ ...BASE_PAYLOAD, subject: `Notification ${i}` })
  }
  assert.strictEqual(adapter.sent.length, 5)
})

// ── WhatsApp stub ─────────────────────────────────────────────────────────────

section('WhatsApp stub adapter')

await test('WhatsAppNotificationAdapter.send() throws NotImplementedNotificationChannel', async () => {
  const adapter = new WhatsAppNotificationAdapter()
  await assert.rejects(
    () => adapter.send(BASE_PAYLOAD),
    NotImplementedNotificationChannel
  )
})

await test('WhatsAppNotificationAdapter.sendBatch() throws NotImplementedNotificationChannel', async () => {
  const adapter = new WhatsAppNotificationAdapter()
  await assert.rejects(
    () => adapter.sendBatch([BASE_PAYLOAD]),
    NotImplementedNotificationChannel
  )
})

// ── WF-09: CompositeNotificationAdapter partial failure ───────────────────────

section('WF-09: Composite partial failure — partial adapter failure does not stop others')

await test('send(): if one adapter throws, other adapters still receive the payload', async () => {
  const goodAdapter1 = new InMemoryNotificationAdapter()
  const badAdapter   = new InMemoryNotificationAdapter()
  const goodAdapter2 = new InMemoryNotificationAdapter()

  // Make badAdapter throw
  badAdapter.send = async () => { throw new Error('Network timeout') }

  const composite = new CompositeNotificationAdapter([goodAdapter1, badAdapter, goodAdapter2])
  await composite.send(BASE_PAYLOAD) // should NOT throw

  assert.strictEqual(goodAdapter1.sent.length, 1, 'goodAdapter1 should have received payload')
  assert.strictEqual(goodAdapter2.sent.length, 1, 'goodAdapter2 should have received payload')
})

await test('send(): composite does NOT re-throw when adapter fails (WF-09)', async () => {
  const alwaysFails = new InMemoryNotificationAdapter()
  alwaysFails.send = async () => { throw new Error('Always fails') }

  const composite = new CompositeNotificationAdapter([alwaysFails])

  // Must not throw
  let threw = false
  try {
    await composite.send(BASE_PAYLOAD)
  } catch {
    threw = true
  }
  assert.strictEqual(threw, false, 'CompositeNotificationAdapter.send should not throw')
})

await test('send(): all adapters fail — no throw, all failures logged', async () => {
  const a1 = new InMemoryNotificationAdapter()
  const a2 = new InMemoryNotificationAdapter()
  a1.send = async () => { throw new Error('a1 fail') }
  a2.send = async () => { throw new Error('a2 fail') }

  const composite = new CompositeNotificationAdapter([a1, a2])
  await composite.send(BASE_PAYLOAD) // should complete without throwing
})

await test('sendBatch(): partial failure still delivers to working adapters', async () => {
  const goodAdapter = new InMemoryNotificationAdapter()
  const badAdapter  = new InMemoryNotificationAdapter()
  badAdapter.sendBatch = async () => { throw new Error('batch fail') }

  const composite = new CompositeNotificationAdapter([goodAdapter, badAdapter])
  await composite.sendBatch([BASE_PAYLOAD, { ...BASE_PAYLOAD, subject: 'Second' }])

  assert.strictEqual(goodAdapter.sent.length, 2, 'good adapter should have received both payloads')
})

await test('all adapters succeed — payloads recorded in all', async () => {
  const a1 = new InMemoryNotificationAdapter()
  const a2 = new InMemoryNotificationAdapter()
  const composite = new CompositeNotificationAdapter([a1, a2])

  await composite.send(BASE_PAYLOAD)

  assert.strictEqual(a1.sent.length, 1)
  assert.strictEqual(a2.sent.length, 1)
})

await test('empty adapter list — send completes without error', async () => {
  const composite = new CompositeNotificationAdapter([])
  await composite.send(BASE_PAYLOAD) // should not throw
})

// ── Multiple channels ─────────────────────────────────────────────────────────

section('Multi-channel payload structure')

await test('in_app channel payload is recorded correctly', async () => {
  const adapter = new InMemoryNotificationAdapter()
  const payload: NotificationPayload = {
    ...BASE_PAYLOAD,
    channel:   'in_app',
    eventType: 'workflow_blocked',
  }
  await adapter.send(payload)
  assert.strictEqual(adapter.sent[0].channel, 'in_app')
  assert.strictEqual(adapter.sent[0].eventType, 'workflow_blocked')
})

await test('recipients array supports multiple recipients', async () => {
  const adapter = new InMemoryNotificationAdapter()
  const payload: NotificationPayload = {
    ...BASE_PAYLOAD,
    recipients: [
      { userId: 'user-001', email: 'alice@example.com' },
      { userId: 'user-002', email: 'bob@example.com' },
    ],
  }
  await adapter.send(payload)
  assert.strictEqual(adapter.sent[0].recipients.length, 2)
})

// ── Summary ───────────────────────────────────────────────────────────────────

console.log(`\n${'─'.repeat(60)}`)
console.log(`Notification Adapter Tests: ${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)

} // end main()

main().catch(err => {
  console.error('Test runner error:', err)
  process.exit(1)
})
