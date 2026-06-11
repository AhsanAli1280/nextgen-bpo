# Development Workflow — Pakistan Withholding Tax Calculator

**Status:** Active policy
**Date:** 2026-06-11
**Scope:** `lib/tax-rules/`, `lib/wht-engine/`, `lib/utils/`, `components/wht/`, `app/wht-calculator/`

---

## 1. Current Architecture

The calculator has been migrated into the main website repository (`nextgen-bpo`) and lives at:

```
nextgen-bpo/lib/tax-rules/
nextgen-bpo/lib/wht-engine/
nextgen-bpo/lib/utils/
nextgen-bpo/components/wht/
nextgen-bpo/app/wht-calculator/
```

Live route: `https://next-genbpo.com/wht-calculator`

---

## 2. Source of Truth Policy

1. `nextgen-bpo` is the **sole authoritative source code** for the calculator.
2. All future calculator development must occur **directly inside `nextgen-bpo`**.
3. Do **NOT** implement changes in the standalone calculator repository (`C:\Users\ahsan\OneDrive\Desktop\New folder`).
4. Do **NOT** copy code from the standalone repository into `nextgen-bpo`.
5. Do **NOT** use the standalone repository as a deployment source.
6. The standalone repository is retained **only as a historical backup/reference** (pre-migration state).
7. If differences exist between repositories, **`nextgen-bpo` always takes precedence**.

---

## 3. Finance Act Maintenance Policy

1. The calculator must be reviewed after every Finance Act, Finance Bill, Tax Laws (Amendment) Ordinance, or other material change to withholding tax law.
2. New Finance Act changes must be implemented **directly in `nextgen-bpo`**.
3. When rates, thresholds, categories, exemptions, ATL/Non-ATL treatment, surcharge rules, or withholding mechanisms change, the calculator must be updated accordingly.
4. Each tax-law update must include:
   - Rule updates (`lib/tax-rules/rules/fy{year}.ts`, `registry.ts`)
   - Engine updates (`lib/wht-engine/`), if required
   - Test updates (`lib/wht-engine/tests/`)
   - Documentation updates
   - Validation against primary statutory sources (FBR Withholding Tax Card, Finance Act text)
5. No Finance Act update is considered complete until:
   - Tests pass
   - TypeScript validation passes (`npx tsc --noEmit`)
   - Production build succeeds (`npm run build`)
   - Documentation is updated

---

## 4. Change Management Rules

- All bug fixes, UI changes, engine changes, tax-law updates, and new section implementations must be made directly in `nextgen-bpo`.
- Verify current architecture before making changes (read this file + `CURRENT_ARCHITECTURE.md` / `IMPLEMENTATION_STATUS.md` if present).
- Follow existing project conventions and code style.
- Avoid duplicate implementations across repositories.

---

## 5. Required Post-Change Workflow

After every change:

1. Run tests.
2. Run TypeScript validation: `npx tsc --noEmit`.
3. Run production build: `npm run build`.
4. Update `SESSION_HANDOFF`.
5. Update `IMPLEMENTATION_STATUS` (if applicable).
6. Update `CURRENT_ARCHITECTURE` (if architecture changed).

---

## 6. Deployment Workflow

1. Develop in `nextgen-bpo`.
2. Validate locally (tests, `tsc`, `build`, smoke test on `/wht-calculator`).
3. Update documentation.
4. Commit changes.
5. Deploy from `nextgen-bpo` only.

---

## 7. Purpose

Prevent repository drift, eliminate manual file copying, maintain a single source of truth, and ensure the calculator remains current with future Finance Act changes and withholding tax law amendments.
