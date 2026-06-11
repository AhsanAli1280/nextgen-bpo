import { Decimal } from 'decimal.js';

export type AtlStatus = 'ATL' | 'NON_ATL' | 'LATE_FILER';
export type TaxpayerType = 'INDIVIDUAL' | 'AOP' | 'COMPANY';
export type PaymentFrequency = 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUAL' | 'ANNUALLY' | 'ONE_TIME';

export const FREQUENCY_MULTIPLIERS: Record<PaymentFrequency, number> = {
  MONTHLY: 12,
  QUARTERLY: 4,
  SEMI_ANNUAL: 2,
  ANNUALLY: 1,
  ONE_TIME: 1,
} as const;

export interface FieldOption {
  readonly value: string;
  readonly label: string;
}

export interface FieldDefinition {
  readonly key: string;
  readonly label: string;
  readonly type: 'number' | 'select' | 'radio' | 'frequency_select';
  readonly placeholder?: string;
  readonly helperText?: string;
  readonly options?: readonly FieldOption[];
  readonly required: boolean;
  readonly lockedValue?: string;
  readonly amountField?: boolean;
  readonly frequencyTarget?: string;
  readonly blocksSubmitIfEmpty?: boolean;
  // When set, the field is only rendered (and required-checked) when the named
  // sibling field currently equals the given value. Skipped when the condition
  // is not met. Used for subType-dependent inputs (e.g. §233 LIA annual total).
  readonly visibleWhen?: { readonly field: string; readonly equals: string };
}

export interface WhtRule {
  readonly id: string;
  readonly atlStatus: AtlStatus | null;
  readonly taxpayerType: TaxpayerType | null;
  readonly subType: string | null;             // e.g., "GOODS", "SERVICES", "CONTRACTS"
  readonly rate: number;                        // Percentage, e.g., 8.0
  readonly rateLabel: string;
  readonly priority: number;
  readonly effectiveFrom: string;               // ISO date format YYYY-MM-DD
  readonly effectiveTo?: string;                 // ISO date format YYYY-MM-DD
  readonly fixedAmount?: number;
  readonly surchargeRate?: number;
}

export interface WhtThreshold {
  readonly subType?: string;
  readonly taxpayerType?: TaxpayerType;
  readonly minimumAmount: number;
  readonly note?: string;
}

export interface WhtSlab {
  readonly from: number;
  readonly to: number | null;
  readonly fixedTax: number;
  readonly rate: number;                        // Percentage, e.g., 5.0
  readonly label: string;
}

export interface WhtSectionConfig {
  readonly code: string;
  readonly label: string;
  readonly legalReference: string;
  readonly displayOrder: number;                // Statutory ordering for UI section selectors (ascending)
  readonly displayName?: string;                // Short business-activity name for transaction-card UI
  readonly shortDescription?: string;           // One-line description for transaction-card UI
  readonly icon?: string;                       // Emoji icon for transaction-card UI
  readonly category?: string;                   // Grouping label for transaction-card UI
  readonly thresholds?: readonly WhtThreshold[];
  readonly rules: readonly WhtRule[];
  readonly requiresSlabComputation?: boolean;
  readonly slabs?: readonly WhtSlab[];
  readonly transactionFields: readonly FieldDefinition[];
}

export interface WhtRateConfig {
  readonly financeActYear: number;
  readonly effectiveFrom: string;               // ISO date format YYYY-MM-DD
  readonly effectiveTo: string;                 // ISO date format YYYY-MM-DD
  readonly sections: readonly WhtSectionConfig[];
}

export interface WhtInput {
  readonly sectionCode: string;
  /**
   * Explicitly selected Finance Act year (e.g. 2026 for Tax Year 2026-27).
   * When provided, the engine uses this year's config directly — the selected
   * Tax Year drives calculations regardless of today's date or transactionDate.
   * Takes priority over transactionDate if both are supplied.
   */
  readonly financeActYear?: number;
  readonly transactionDate?: Date | string;     // Defaults to now if not provided
  readonly sectionSpecific: Record<string, unknown>;
}

export interface SlabLine {
  readonly slabLabel: string;
  readonly taxableAmount: Decimal;
  readonly rate: number;
  readonly tax: Decimal;
}

export interface WhtResult {
  readonly applicable: boolean;
  readonly inapplicableReason?: string;
  readonly sectionCode: string;
  readonly sectionLabel: string;
  readonly legalReference: string;
  readonly financeActYear: number;
  readonly transactionSummary: string;
  readonly inputs: Record<string, unknown>;
  readonly enteredAmount: Decimal;
  readonly enteredAmountLabel: string;
  readonly enteredFrequency?: PaymentFrequency;
  readonly annualisedAmount?: Decimal;
  readonly rate: number;
  readonly rateLabel: string;
  readonly whtAmountAnnual?: Decimal;
  readonly whtAmountPerPeriod: Decimal;
  readonly netAmountPerPeriod: Decimal;
  readonly isProgressiveSlab?: boolean;
  readonly slabBreakdown?: readonly SlabLine[];
  readonly explanation: string;                 // Markdown formatted step-by-step math explanation
  // Supplementary fields — only populated when applicable: false due to a threshold guard.
  // All existing fields (rate, whtAmountPerPeriod, netAmountPerPeriod) remain at their
  // exempt values (0 / enteredAmount). These fields add transparency without altering
  // the statutory determination.
  readonly theoreticalRate?: number;            // Rate that would apply if the threshold were met
  readonly theoreticalRateLabel?: string;       // Human-readable label for theoreticalRate
  readonly theoreticalWhtAmount?: Decimal;      // enteredAmount × theoreticalRate/100, rounded
  readonly thresholdMinimum?: number;           // The statutory minimumAmount that blocked WHT
}
