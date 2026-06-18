import type { CompanyClassification, EventContext, DeadlineUnit } from './types'

export function addDuration(triggerDate: Date, value: number, unit: DeadlineUnit): Date {
  const d = new Date(triggerDate)
  switch (unit) {
    case 'days':
      d.setUTCDate(d.getUTCDate() + value)
      break
    case 'weeks':
      d.setUTCDate(d.getUTCDate() + value * 7)
      break
    case 'months': {
      // Clamp to end-of-month when the target month is shorter than the source day.
      // e.g. Jan 31 + 1 month → Feb 28 (not March 3).
      const originalDay = d.getUTCDate()
      d.setUTCMonth(d.getUTCMonth() + value)
      if (d.getUTCDate() !== originalDay) {
        // Overflow occurred — setDate(0) rewinds to last day of the previous month.
        d.setUTCDate(0)
      }
      break
    }
    case 'years': {
      const originalDay = d.getUTCDate()
      d.setUTCFullYear(d.getUTCFullYear() + value)
      if (d.getUTCDate() !== originalDay) {
        d.setUTCDate(0)
      }
      break
    }
    default:
      throw new Error(`InvalidDeadlineUnit: ${unit}`)
  }
  return d
}

export function addHours(date: Date, hours: number): Date {
  const d = new Date(date)
  d.setUTCHours(d.getUTCHours() + hours)
  return d
}

export function computeTriggerDate(
  mode: 'event' | 'date_driven',
  eventCtx: EventContext | undefined,
  co: CompanyClassification,
  today: Date
): Date {
  if (mode === 'event') {
    // Event-triggered: trigger_date = the real-world event date.
    // Chained obligations get their trigger_date overridden in resolveObligationChains().
    return eventCtx!.event_date
  }

  // Date-driven: trigger_date = company's most recent financial year end
  const fye = new Date(Date.UTC(
    today.getUTCFullYear(),
    co.financial_year_end_month - 1,
    co.financial_year_end_day
  ))
  if (fye > today) {
    fye.setUTCFullYear(fye.getUTCFullYear() - 1)
  }
  return fye
}
