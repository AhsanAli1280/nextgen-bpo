import type { ApplicabilityExpression, CompanyClassification } from './types'

export function evaluate(expr: ApplicabilityExpression, co: CompanyClassification): boolean {
  switch (expr.op) {
    case 'always_true':  return true
    case 'always_false': return false
    case 'eq':           return co[expr.field] === expr.value
    case 'flag':         return co[expr.field] === true
    case 'contains':     return co.regulatory_categories.includes(expr.value)
    case 'capital_gte':  return co.paid_up_capital !== null && co.paid_up_capital >= expr.value
    case 'and':          return expr.conditions.every(c => evaluate(c, co))
    case 'or':           return expr.conditions.some(c => evaluate(c, co))
    case 'not':          return !evaluate(expr.condition, co)
    default:             throw new Error(`Unknown op: ${(expr as any).op}`)
  }
}
