# Withholding Tax (WHT) Computation Engine

This package handles the runtime execution concerns of the Pakistan Withholding Tax Calculator, separating logic from the declarative configurations in `lib/tax-rules`.

## Architectural Rules on Monetary Precision

> [!IMPORTANT]
> **Mandatory Decimal Arithmetic**
> To avoid floating-point rounding errors typical of JavaScript's double-precision binary floating-point format (`number`), **all monetary calculations must use `Decimal` from the `decimal.js` library.**
>
> - **Rule**: No runtime arithmetic (addition, subtraction, multiplication, division, percentage application, slab portion calculation) may be performed using standard JavaScript numbers.
> - **Input conversion**: Raw numeric values passed to the engine must be wrapped in `new Decimal(value)` immediately upon entry.
> - **Calculations**: All intermediate sums, slab band bounds, rates (e.g. `rate.div(100)`), and thresholds must be computed using `Decimal` operations (`.add()`, `.sub()`, `.mul()`, `.div()`, `.round()`).
> - **Rounding**: Final results must be rounded to the nearest integer Rupee using `Decimal.ROUND_HALF_UP` (or `.round()`) before returning to ensure compliance with Federal Board of Revenue (FBR) rounding specifications.
