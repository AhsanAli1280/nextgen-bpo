// Calendar entries are a query over obligations, not a separate table.
// The calendar is a view: obligations + rule_versions + event_types + event_instances.

/** Returns the parameterized SQL for the calendar query. $1 = company_id, $2 = demo_session_id (or null). */
export function getCalendarSql(): string {
  return `
SELECT
  o.obligation_id,
  o.company_id,
  o.status,
  o.trigger_date,
  o.computed_deadline,
  o.linked_obligation_id,
  rv.deadline_value,
  rv.deadline_unit,
  rv.form_number,
  rv.filing_authority,
  rv.legal_citation,
  rv.verification_status,
  rv.practical_notes,
  et.event_category,
  et.display_name         AS event_display_name,
  ei.event_instance_id,
  ec.display_label        AS originating_card_label
FROM obligations o
JOIN rule_versions rv ON o.rule_version_id = rv.rule_version_id
JOIN rules r          ON rv.rule_id = r.rule_id
JOIN event_types et   ON r.event_type_id = et.event_type_id
LEFT JOIN event_obligations eo ON o.obligation_id = eo.obligation_id
LEFT JOIN event_instances ei   ON eo.event_instance_id = ei.event_instance_id
LEFT JOIN event_cards ec       ON ei.originating_event_card_id = ec.event_card_id
WHERE o.company_id = $1
  AND o.status NOT IN ('superseded')
  AND (o.demo_session_id = $2 OR o.demo_session_id IS NULL)
ORDER BY o.computed_deadline ASC
`.trim()
}

export const STATUS_THRESHOLDS = {
  DUE_SOON_DAYS: 30,
} as const

/**
 * Computes obligation status from computed_deadline and today.
 * Called by the daily status-update job. Filed status is set by the filing action, not here.
 */
export function computeObligationStatus(
  computedDeadline: Date,
  today: Date = new Date()
): 'upcoming' | 'due_soon' | 'overdue' {
  const diffMs   = computedDeadline.getTime() - today.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  if (diffDays < 0) return 'overdue'
  if (diffDays <= STATUS_THRESHOLDS.DUE_SOON_DAYS) return 'due_soon'
  return 'upcoming'
}
