# SmartFlow

**Manufacturing Financial Risk Analysis and Decision Support**  
**HackGB 2026 | Industrial Track | October 17-18, 2026**  
**Status: In development**

SmartFlow is a financial analysis and decision-support application for small manufacturing businesses. It combines a four-phase financial assessment, cash-flow calculations, scenario simulations, manufacturing risk analysis, and comparisons of potential financial actions.

SmartFlow also supports dated cash-flow analysis through the Cash Gap Navigator. This module identifies short-term liquidity gaps, evaluates supplier minimum order quantities and payment terms, and compares recovery options against business-defined cash targets.

The core workflow answers three questions: **What is the business's financial position? How much pressure can it withstand? Which permitted actions could improve the outcome?**

## 1. The Problem

Small manufacturers often pay for materials, payroll, facilities, and equipment before customers pay their invoices. A rise in purchasing costs or delay in customer collections can cause cash shortages even when monthly sales and projected ending cash look healthy.

A useful financial tool needs to explain both the monthly outcome and the timing of its underlying payments. It should also account for constraints such as supplier minimum order quantities (MOQs), payment terms, and realistic limits on expense reductions.

SmartFlow is designed for owners, finance managers, and operations managers who need to understand manufacturing-related financial exposure and compare practical responses.

## 2. Product Workflow

1. **Assess:** Enter monthly receipts, expenses, financing obligations, opening cash, and financial goals.
2. **Analyze:** Review cash flow, liquidity, debt-payment burden, and reserve headroom.
3. **Simulate:** Apply individual or combined financial shocks.
4. **Identify thresholds:** Calculate when cash flow or cash reserves reach a critical limit.
5. **Explain risk:** Attribute deterioration to material costs, reduced collections, or other changes.
6. **Compare responses:** Evaluate the financial effect of alternative business actions.
7. **Plan:** Determine what changes are needed to reach a financial target.
8. **Evaluate timing:** When dated information is available, analyze daily cash gaps and supplier-constrained recovery options.

The monthly model is the foundation for all calculations. The daily cash-flow and supplier modules extend this model without requiring users to change the original four-phase assessment.

## 3. Product Differentiation

| Capability | Question answered | Decision value |
|---|---|---|
| Risk Threshold Finder | How much can costs rise or collections fall before a critical boundary? | Quantifies financial headroom |
| Risk Driver Breakdown | Which changes cause the largest cash-flow decline? | Makes combined shocks explainable |
| Manufacturing Margin Guard | What happens to material contribution per unit? | Connects finance with production economics |
| Action Comparison Lab | What would different corrective actions achieve? | Makes alternatives comparable |
| Goal-Based Reverse Planner | What adjustment reaches a selected target? | Translates goals into measurable changes |
| Cash Gap Navigator | When will cash be lowest, even if the month ends positively? | Detects interim liquidity stress |
| Supplier Constraints | Are order changes and payment terms permitted? | Excludes invalid purchasing options |
| Recovery Planning | Which allowable actions or combinations meet the reserve target? | Connects risk detection to decisions |

## 4. Four-Phase Financial Assessment

The questionnaire preserves four consecutive phases. Amounts are specified for a consistent monthly reporting period, and cash receipts are distinguished from accounting revenue.

### Phase 1: Revenue and Cash Receipts

- Record monthly revenue for context and actual or expected customer cash receipts for cash-flow analysis.
- Record variability or a hypothetical collection decline for scenario testing.
- Optionally record invoice amounts and expected payment dates for the Cash Gap Navigator.
- Keep moved collections distinct from newly generated sales, so the same receipt is not counted twice.

**Result:** Monthly customer cash inflow and, when provided, the dated collection schedule.

### Phase 2: Operating Costs and Debt

- Record material purchases, payroll, facility expenses, other operating payments, and debt payments.
- Distinguish outstanding loan balances from payments due during the modeled period.
- Optionally record dated payroll, supplier invoices, rent, debt payments, and other cash outflows.
- Optionally record supplier required quantity, MOQ, order increments, unit price, and permitted payment dates.

**Result:** Monthly cash-payment breakdown and optional scheduled outflows without duplicated expenses.

### Phase 3: Assets and Liquidity

- Record opening available cash and a user-defined minimum reserve.
- Record other business assets and liabilities separately from spendable cash when available.
- Provide reserve headroom and projected ending cash for the monthly model.

**Result:** Cash position and distance from the financial reserve target.

### Phase 4: Goals and Planning Constraints

- Select a goal such as positive monthly cash flow, a target ending cash balance, or a minimum daily cash reserve.
- Define a planning horizon and permissible action limits, including cost reductions, collection improvements, or negotiated payment dates.
- Provide the assumptions needed to evaluate an action as permitted, conditional on approval, or infeasible.

**Result:** A measurable target and the constraints used to evaluate recovery scenarios.

## 5. Product Capabilities

Features are grouped by analysis type and development priority. Each module uses validated financial inputs and consistent scenario assumptions.

### 5.1 Financial Health Dashboard

Display:
- Monthly cash receipts and total cash payments.
- Payment breakdown: materials, payroll, facility, other operating payments, and debt.
- Monthly net cash flow and projected ending cash.
- Debt-payment burden as a percentage of cash receipts.
- Cash available above a selected reserve floor.
- Baseline-versus-scenario differences in dollars and percentages where mathematically meaningful.

A metric card must identify the reporting period and distinguish a monthly flow from a point-in-time cash balance. Undefined percentages should display as unavailable rather than as zero.

### 5.2 What-If Scenario Simulator

Allow a user to change:
- Material-payment increase or decrease (%).
- Cash-receipts increase or decline (%).
- Other operating-payment changes ($ or %).
- Debt-payment changes ($), if supported by the agreed input contract.

Recalculate all affected cash-flow metrics and display **baseline, scenario, and difference**. Multiple shocks must be usable together, not just one at a time. Provide a reliable reset to baseline.

### 5.3 Risk Threshold Finder

Calculate, when defined:
- Material-cost increase (%) that reduces monthly net cash flow to zero.
- Cash-receipts decline (%) that reduces monthly net cash flow to zero.
- Material-cost increase (%) that reduces projected ending cash to a specified reserve floor.

Thresholds should report whether the baseline is already at or beyond the target boundary, whether the input makes a percentage undefined, and whether a mathematically valid threshold falls outside a physically meaningful range.

### 5.4 Risk Driver Breakdown

For cash-flow scenarios based on independent additive changes:
- Calculate the dollar contribution of each changed input.
- Rank drivers by absolute adverse cash-flow effect.
- Reconcile the sum of contributions with the total change from baseline.
- Show both adverse changes and offsets when an action improves the scenario.

If later models introduce interactions between variables, the attribution method must account for those interactions rather than claiming that a simple additive breakdown is universal.

### 5.5 Manufacturing Margin Guard

Given the number of units sold and the relevant sales/collection assumptions, calculate:
- Baseline material cost per unit.
- Stressed material cost per unit.
- Material-only contribution per unit.
- Illustrative price increase required to offset a material-price shock, assuming unchanged unit volume and collection timing.

Label the metric **material-only contribution**, not net profit or gross margin, unless all necessary cost components have been supplied. Avoid dividing monthly material purchases by units sold without a stated inventory/production alignment assumption.

### 5.6 Action Comparison Lab

Compare a stressed scenario against possible responses:
- A percentage reduction in stressed material payments through supplier negotiation.
- A fixed-dollar or percentage reduction in selected operating payments.
- An increase in cash collected within the modeled month through faster customer collections.
- A modeled price increase when unit volume and collection assumptions are provided.

For each action display:
- Changed input and assumption.
- Monthly cash-flow improvement.
- Ending cash after the action.
- Remaining gap to the selected target.
- Whether the action satisfies a user-defined limit.

Allow side-by-side comparison; do not present one action as guaranteed or operationally feasible without the necessary constraints.

### 5.7 Goal-Based Reverse Planner

Work backward from a selected target, such as **nonnegative monthly cash flow** or **ending cash of at least $20,000**. Calculate the additional receipts or reduction in payments required. Where feasible constraints are available, compare single actions or simple combinations that meet the gap.

Clearly distinguish a mathematical requirement (for example, “reduce payments by $3,000”) from a practical recommendation (which requires business-specific feasibility information).

### 5.8 Stress-Test Heatmap

Display a two-dimensional grid of material-cost increases versus customer-collection declines. Calculate net cash flow or ending cash for every cell and distinguish positive, break-even, and negative outcomes. Use the same calculation engine as the standard simulator.

### 5.9 Equipment Financing Analysis

Estimate loan payments from principal, annual interest rate, and term. Show the additional monthly payment and its effect on the cash-flow baseline. Treat financing cash inflow and equipment purchase cash outflow explicitly if modeled; do not assume that a loan payment alone represents an entire equipment investment.

### 5.10 Financial Explanations and Reports

Generate explanations and exportable summaries using validated calculation results and declared assumptions. Explanations may describe risks and trade-offs but must not replace the calculation engine or introduce unsupported numerical claims. A text-based explanation is sufficient for an initial demonstration; report export is optional.

### 5.11 Financial Data Import

The application should remain functional with manual input and synthetic sample data. External financial data integration may be added after the team selects and validates a provider. Any imported records must be mapped into the shared financial schema and checked for incomplete or duplicate categories. Manufacturing inputs such as unit volume and supplier prices generally require separate collection.

### 5.12 Cash Gap Navigator

Cash Gap Navigator calculates daily cash availability from dated customer receipts, supplier invoices, payroll, facility expenses, and debt payments. The feature runs when a dated cash schedule is provided.

**Inputs**

- Opening cash at the start of the selected month.
- Dated customer receipts and other cash inflows.
- Dated material, payroll, facility, operating, and financing payments.
- A user-defined minimum cash reserve.
- Optional invoice, supplier, and event identifiers for traceability.

**Outputs**

- Cash balance after each dated event and at the end of each day.
- Lowest projected balance and its date.
- First date cash falls below the reserve floor.
- First date the balance falls below zero, if any.
- Maximum additional liquidity needed to maintain the reserve floor over the schedule.
- Reconciliation between the dated schedule and monthly baseline totals.

**Required behavior**

- Calculate each day's ending cash from the preceding day's balance, plus that day's actual modeled inflows and minus that day's actual modeled outflows.
- Include all same-day events before evaluating the **end-of-day** balance; do not imply that the model detects within-day payment ordering unless timestamps are supplied.
- Display a coverage warning if dated events omit monthly receipts or payment categories.
- Never present a partial timeline as a complete liquidity forecast.
- Keep the monthly baseline available when the timeline is absent or incomplete.

### 5.13 Supplier Minimum Orders and Payment Terms

The supplier module evaluates whether proposed materials-related changes are compatible with defined purchasing requirements.

**Inputs**

- Quantity needed for the manufacturing order.
- MOQ and any required order increment or pack size.
- Purchase price per material unit.
- Current payment date and permitted alternative payment terms.
- Optional supplier permission flags for partial orders or installment payments.

**Outputs**

- Smallest permissible order quantity under the entered MOQ and ordering increment.
- Required purchase cash amount and scheduled payment date.
- Material quantity above the immediate order requirement, if applicable.
- Validation result for proposed order reductions or deferred payments.

An 800-unit requirement does not permit an 800-unit purchase from a supplier requiring at least 1,000 units. A proposed payment extension is marked **conditional on supplier approval** unless the user's supplied terms explicitly permit it. Order size and supplier invoice value are not independently added to the same cash-flow total: the modeled materials payment appears only once.

### 5.14 Constraint-Aware Recovery Planning

Constraint-aware recovery planning combines Action Comparison Lab scenarios with cash-reserve targets and documented operational limits.

The user can specify the minimum acceptable cash balance and allowable actions, including:

- Change a supplier invoice due date within approved bounds.
- Move an amount of a customer payment to an earlier date without duplicating receipts.
- Apply a valid supplier discount subject to an entered cap.
- Apply an allowed operating-cost reduction.
- Add a temporary financing inflow together with any modeled repayment or fees.
- Combine two or more permitted actions.

For each candidate, calculate the new cash timeline, lowest balance, ending cash, remaining gap, and constraints satisfied or violated. Rank feasible candidates by a stated criterion, such as smallest financing requirement, smallest number of changes, or greatest minimum cash balance. State the selection criterion in the interface.

The planner distinguishes **mathematical feasibility** from **external agreement**: a model can calculate that a supplier extension would solve a cash gap, but it cannot claim the supplier will grant that extension. Where no combination meets the required reserve, show the remaining shortfall rather than fabricate an acceptable plan.

### 5.15 Feature Priorities

| Priority | Features | Deliverable |
|---|---|---|
| **P0: Core** | Four-phase questionnaire, monthly financial engine, dashboard, material and collection scenarios, risk thresholds | Functional financial assessment and scenario analysis |
| **P1: Analytical** | Risk attribution, Action Comparison Lab, goal calculations, manufacturing unit analysis | Financial risk and action comparison workflow |
| **P1: Cash timing** | Dated cash schedule, liquidity gap detection, MOQ validation, recovery options | Cash Gap Navigator and supplier constraints |
| **P2: Advanced planning** | Multi-action constrained search, detailed payment terms, heatmap, expanded margins, equipment financing | Broader scenario and feasibility analysis |
| **P2: Integrations and reporting** | Financial explanations, reports, external import, advanced visuals | Additional delivery and analysis features |

The roadmap distinguishes features required for the initial release from later enhancements. Feature completion is tracked through the acceptance criteria in Section 9.

## 6. Financial Model

### 6.1 Definitions

For one monthly reporting period:

```text
operating_payments = materials + payroll + facility + other_operating_payments

total_cash_payments = operating_payments + debt_payments

net_cash_flow = cash_receipts - total_cash_payments

ending_cash = opening_cash + net_cash_flow

debt_payment_burden_pct = (debt_payments / cash_receipts) * 100
                            when cash_receipts > 0

reserve_headroom = ending_cash - minimum_cash_reserve
```

A positive net cash flow means monthly cash inflows exceed modeled cash outflows. It does not establish profitability under accrual accounting.

### 6.2 Scenario Transformations

For a material-cost increase of `m%` and a customer-collection decline of `r%`:

```text
scenario_materials = baseline_materials * (1 + m / 100)

scenario_cash_receipts = baseline_cash_receipts * (1 - r / 100)

scenario_net_cash_flow = scenario_cash_receipts
                         - scenario_total_cash_payments
```

Percentages are defined relative to baseline values unless the interface clearly specifies otherwise. Positive `r` represents a decline in receipts; positive `m` represents an increase in material payments.

### 6.3 Risk Thresholds

For a baseline with positive monthly net cash flow:

```text
material_increase_to_cashflow_breakeven_pct =
    100 * baseline_net_cash_flow / baseline_materials

receipts_decline_to_cashflow_breakeven_pct =
    100 * baseline_net_cash_flow / baseline_cash_receipts

material_increase_to_reserve_floor_pct =
    100 * (baseline_ending_cash - reserve_floor) / baseline_materials
```

These formulas assume all other cash flows remain constant. Threshold calculations must handle zero denominators, already-breached boundaries, and the fact that a receipt decline greater than 100% is not a valid decline under this model.

### 6.4 Risk Attribution

For the material-and-receipts example:

```text
material_impact = -(scenario_materials - baseline_materials)

receipts_impact = scenario_cash_receipts - baseline_cash_receipts

total_cashflow_change = material_impact + receipts_impact
```

With additional expense categories, the model adds each category's change once. The total must equal scenario net cash flow minus baseline net cash flow within the selected numerical tolerance.

### 6.5 Numerical Reliability

Financial amounts should be represented consistently as decimal currency values or integer minor units rather than accumulated binary floating-point approximations. Apply rounding at documented boundaries, reject invalid nonnumeric inputs, and keep all computations consistent with the selected monthly period.

### 6.6 Dated Cash-Flow Calculation

For a complete dated schedule over the same calendar month:

```text
opening_cash = cash available at the beginning of the first day

daily_net_flow[d] = sum(cash_inflows_on_day[d]) - sum(cash_outflows_on_day[d])

daily_ending_cash[d] = daily_ending_cash[d-1] + daily_net_flow[d]

lowest_daily_cash = min(opening_cash, daily_ending_cash[1..last_day])

first_reserve_breach = first day with daily_ending_cash < reserve_floor

first_negative_day = first day with daily_ending_cash < 0

maximum_reserve_shortfall = max(0, reserve_floor - lowest_daily_cash)
```

Evaluate each end-of-day balance consistently. If times within a day are not captured, the model cannot determine whether a particular morning payment can be made before an afternoon receipt. Multiple events on one date are aggregated for end-of-day modeling.

The dated schedule and the original monthly calculations must reconcile:

```text
sum(dated_inflows)       = monthly_cash_receipts
sum(dated_materials)     = monthly_material_payments
sum(dated_payroll)       = monthly_payroll_payments
sum(dated_facility)      = monthly_facility_payments
sum(dated_other)         = monthly_other_operating_payments
sum(dated_debt_payments) = monthly_debt_payments

last_daily_ending_cash = monthly_projected_ending_cash
```

If any equality fails, the response includes the mismatched category, the difference, and a coverage status. Partial schedules may be displayed as illustrative event sequences only and must not be labeled complete monthly forecasts.

### 6.7 Supplier Order Validation

For a positive minimum order quantity and positive order increment:

```text
minimum_feasible_qty = smallest nonnegative order quantity q where:
  q >= required_qty
  q >= minimum_order_quantity
  q satisfies the supplier's order-increment rule

material_invoice = minimum_feasible_qty * unit_purchase_price
```

The order-increment rule must be defined in the supplier's terms: increments may apply to all ordered units or only quantities above the MOQ. Do not assume the two are interchangeable. If no valid quantity exists under the entered maximum capacity or budget, report the order as infeasible.

An invoice is a cash-flow event on its modeled payment date. Purchasing surplus units may create inventory value, but it does not turn that inventory into immediately spendable cash.

### 6.8 Recovery Scenario Rules

- A customer collection moved earlier creates a positive cash-flow effect on the new date and an equal negative cash-flow effect on the original date, provided both fall in the same modeled period. It does **not** create new sales or duplicate receipts.
- A supplier invoice deferred to a later date is removed from its old date and inserted on the new date. It remains an obligation. If deferred beyond the reporting month, the month-end cash balance changes, and the unpaid obligation must be identified separately.
- Cost reductions change payment amounts only if the modeled savings are defined and applicable to that payment category.
- Financing inflows are not operating revenue. Related fees and scheduled repayments must be modeled as separate obligations when known.
- Validate every recovery candidate against the stated MOQ, payment-term, available-cash, and action-limit constraints before comparing outcomes.
- Multiple possible solutions must state the chosen ranking objective; no result should be presented as globally optimal without an exhaustive or justified optimization method.

### 6.9 Calculation Consistency and Model Coverage

Monthly and dated analyses serve different purposes. A positive monthly cash flow does not guarantee positive daily cash, while an approved timing shift can improve the daily minimum without changing total monthly cash flow.

All amounts use one declared currency and calendar period. For cash timelines, dates are interpreted in the business's selected local calendar; no automatic assumption is made about bank settlement, weekends, holidays, or invoice collectability. Record whether the schedule is complete and whether payment-term changes are permitted, conditional, or rejected.

## 7. Demonstration: Green Bay Precision Components

The following fictional manufacturer provides a reproducible demonstration scenario.

### 7.1 Monthly Baseline

| Input | Amount |
|---|---:|
| Customer cash receipts | $80,000 |
| Material payments | $25,000 |
| Payroll | $22,000 |
| Facility payments | $8,000 |
| Other operating payments | $5,000 |
| Debt payments | $6,000 |
| Opening cash balance | $30,000 |
| Minimum cash reserve (example) | $20,000 |

**Expected baseline:**

| Metric | Result |
|---|---:|
| Operating payments | $60,000 |
| Total cash payments | $66,000 |
| Net cash flow | +$14,000 |
| Projected ending cash | $44,000 |
| Debt-payment burden | 7.5% |
| Headroom above $20,000 reserve | $24,000 |

### 7.2 Stress Scenarios

| Scenario | Cash receipts | Material payments | Net cash flow | Ending cash |
|---|---:|---:|---:|---:|
| Baseline | $80,000 | $25,000 | +$14,000 | $44,000 |
| Materials +20% | $80,000 | $30,000 | +$9,000 | $39,000 |
| Receipts −15% | $68,000 | $25,000 | +$2,000 | $32,000 |
| Combined shocks | $68,000 | $30,000 | −$3,000 | $27,000 |

The combined scenario has a **$17,000 decline in monthly cash flow**: $12,000 from reduced receipts and $5,000 from increased material payments.

### 7.3 Reverse Stress Test

Under unchanged other assumptions:

- Material payments can rise by **56%** before baseline monthly cash flow reaches zero.
- Cash receipts can fall by **17.5%** before baseline monthly cash flow reaches zero.
- Material payments can rise by **96%** before projected ending cash reaches the example $20,000 reserve floor.

Each threshold is calculated from the specified baseline and the assumption that other cash flows remain unchanged.

### 7.4 Example Action Comparison

Following the **20% material-cost shock**, monthly material payments are $30,000 and net cash flow is $9,000.

| Response | Modeled effect | Revised net cash flow |
|---|---|---:|
| No response | Material payments remain $30,000 | +$9,000 |
| Negotiate 10% off stressed material payments | Save $3,000 | +$12,000 |
| Reduce other operating payments by $2,000 | Save $2,000 | +$11,000 |
| Combine both actions | Save $5,000 | +$14,000 |

The combined response restores the original $14,000 monthly cash surplus under these assumptions. The comparison uses explicitly entered discount and operating-cost assumptions.

### 7.5 Example Manufacturing Unit Economics

Assume 1,000 units are sold and collected for during the month, and the $25,000 material payments correspond to those same units:

- Collected price per unit: **$80**.
- Baseline material cost per unit: **$25**.
- Baseline material-only contribution per unit: **$55**.
- Material cost per unit after a 20% increase: **$30**.
- Illustrative price to preserve the $55 material-only contribution: **$85**.

This calculation excludes labor, overhead, debt service, demand changes, and collection timing effects beyond the stated assumptions.

### 7.6 Dated Cash Gap Example - Same Monthly Financial Profile

The monthly example above ends with **$44,000 in cash**, but that outcome depends on **when** money is received and paid. The following illustrative schedule allocates the **same $80,000 in receipts and $66,000 in payments** to individual dates. It uses the existing **$20,000 reserve floor**.

| Date | Event | Cash movement | Projected cash after event |
|---|---|---:|---:|
| Day 1 | Opening cash | - | $30,000 |
| Day 5 | Materials invoice due | −$25,000 | $5,000 |
| Day 10 | Payroll due | −$22,000 | **−$17,000** |
| Day 12 | Customer collection | +$35,000 | $18,000 |
| Day 16 | Facility payment | −$8,000 | $10,000 |
| Day 20 | Customer collection | +$25,000 | $35,000 |
| Day 23 | Other operating payments | −$5,000 | $30,000 |
| Day 25 | Debt payments | −$6,000 | $24,000 |
| Day 28 | Customer collection | +$20,000 | **$44,000** |

**Expected findings:**

- Monthly net cash flow: **+$14,000**.
- Monthly ending cash: **$44,000**.
- Lowest end-of-day cash: **−$17,000 on Day 10**.
- First day below the $20,000 reserve floor: **Day 5**.
- First negative day: **Day 10**.
- Maximum additional liquidity needed to maintain the $20,000 reserve: **$37,000**.

The monthly and daily projections reveal different aspects of liquidity: month-end cash remains positive even though interim obligations exceed available funds.

### 7.7 Supplier Constraint Example

Assume 800 material units are needed for the next manufacturing order. The contracted supplier requires a minimum purchase of 1,000 units, at $25 per unit, with payment due on Day 5. Orders must be placed in 1,000-unit increments.

| Input / Result | Value |
|---|---:|
| Immediate production need | 800 units |
| Supplier minimum order | 1,000 units |
| Order increment | 1,000 units |
| Price per unit | $25 |
| Minimum valid purchase | 1,000 units |
| Cash required for the purchase | $25,000 |
| Units above immediate need | 200 units |
| Original payment due date | Day 5 |

A proposed reduction to 800 units fails the supplier quantity constraint. Reducing the material cash payment from $25,000 to $20,000 is therefore **not a valid recovery option under the stated terms**.

### 7.8 Feasible Recovery Comparison

Consider two hypothetical, explicitly authorized changes to the original dated schedule:

1. The supplier **approves** moving the $25,000 material payment from Day 5 to Day 18.
2. The customer **agrees** to move $12,000 of the Day 28 payment to Day 9. Total monthly receipts remain $80,000.

| Recovery scenario | Lowest end-of-day cash | Breaches $20,000 floor? | Month-end cash |
|---|---:|---|---:|
| Original schedule | −$17,000 | Yes | $44,000 |
| Supplier payment moved to Day 18 only | $8,000 | Yes | $44,000 |
| Both approved changes | **$20,000** | **No** | **$44,000** |

In the combined scenario, cash reaches $20,000 on Day 10, remains at least $20,000 throughout the month, and still ends at $44,000. The recovery improves **cash timing**, not monthly sales, monthly net cash flow, or total monthly receipts. If either change is not available under real terms, the combined plan must be shown as unavailable or conditional rather than as an executable recommendation.

## 8. Technical Design and Data Contract

The application's modules share one financial definition, independent of the selected frontend or backend framework. The JSON contracts below define inputs and outputs for the reference demonstration. The service interface can be implemented as HTTP endpoints or framework-native server functions.

### 8.1 Application Components

```text
Financial Questionnaire / Demo Data / Optional External Import
                           |
                           v
                Input Validation and Mapping
                           |
                           v
                 Financial Calculation Engine
                           |
              +------------+-------------+
              |                          |
              v                          v
       Dashboard Metrics          Scenario Engine
                                         |
                           +-------------+-------------+
                           |             |             |
                           v             v             v
                      Thresholds     Risk Drivers   Unit Analysis
                           |             |             |
                           +-------------+-------------+
                                         |
                                         v
                            Action Comparison / Goals
                                         |
                                         v
                           Visualizations and Explanations
```

### 8.2 Baseline Input Schema

```json
{
  "cash_receipts": 80000,
  "materials": 25000,
  "payroll": 22000,
  "facility": 8000,
  "other_expenses": 5000,
  "debt_payments": 6000,
  "opening_cash": 30000,
  "minimum_cash_reserve": 20000
}
```

All monetary fields are amounts in one consistent currency for the same monthly period, except `opening_cash`, which is the cash balance at the beginning of that period.

### 8.3 Baseline Output Schema

```json
{
  "operating_payments": 60000,
  "total_cash_payments": 66000,
  "net_cash_flow": 14000,
  "ending_cash": 44000,
  "debt_payment_burden_pct": 7.5,
  "reserve_headroom": 24000
}
```

### 8.4 Scenario Input Schema

```json
{
  "baseline": {
    "cash_receipts": 80000,
    "materials": 25000,
    "payroll": 22000,
    "facility": 8000,
    "other_expenses": 5000,
    "debt_payments": 6000,
    "opening_cash": 30000,
    "minimum_cash_reserve": 20000
  },
  "changes": {
    "material_increase_pct": 20,
    "cash_receipts_decline_pct": 15
  }
}
```

**Expected scenario:** net cash flow `-3000`; ending cash `27000`.

### 8.5 Core API Surface

| Endpoint | Purpose | Minimum result |
|---|---|---|
| `POST /api/analyze` | Calculate baseline financial metrics | Payments, net cash flow, ending cash, debt burden |
| `POST /api/simulate` | Apply one or more financial shocks | Baseline, scenario, deltas |
| `POST /api/thresholds` | Calculate cash-flow and reserve boundaries | Threshold values or explicit undefined states |
| `POST /api/risk-drivers` | Attribute scenario changes | Itemized contributions and reconciled total |
| `POST /api/actions` | Compare proposed financial responses | Revised outcomes and target gaps |
| `POST /api/goals` | Calculate adjustments required for a target | Required change and feasibility flags |
| `GET /api/demo` | Return synthetic demonstration data | Valid baseline profile |

These routes define the application service interface. The same data contracts can be used with framework-native server functions.

### 8.6 Dated Cash Schedule Input

The following input represents the complete monthly example from Section 7.6. Financial events are cash movements, not invoices whose payment dates have not been determined.

```json
{
  "period": "2026-10",
  "currency": "USD",
  "opening_cash": 30000,
  "minimum_cash_reserve": 20000,
  "events": [
    {"id": "mat-001", "day": 5, "direction": "outflow", "category": "materials", "amount": 25000},
    {"id": "pay-001", "day": 10, "direction": "outflow", "category": "payroll", "amount": 22000},
    {"id": "rec-001", "day": 12, "direction": "inflow", "category": "cash_receipts", "amount": 35000},
    {"id": "fac-001", "day": 16, "direction": "outflow", "category": "facility", "amount": 8000},
    {"id": "rec-002", "day": 20, "direction": "inflow", "category": "cash_receipts", "amount": 25000},
    {"id": "oth-001", "day": 23, "direction": "outflow", "category": "other_expenses", "amount": 5000},
    {"id": "debt-001", "day": 25, "direction": "outflow", "category": "debt_payments", "amount": 6000},
    {"id": "rec-003", "day": 28, "direction": "inflow", "category": "cash_receipts", "amount": 20000}
  ]
}
```

**Expected summary:**

```json
{
  "coverage_status": "complete",
  "monthly_inflows": 80000,
  "monthly_outflows": 66000,
  "net_cash_flow": 14000,
  "ending_cash": 44000,
  "minimum_daily_cash": -17000,
  "minimum_cash_day": 10,
  "first_reserve_breach_day": 5,
  "first_negative_cash_day": 10,
  "maximum_reserve_shortfall": 37000
}
```

### 8.7 Supplier Rule Input

```json
{
  "supplier_id": "supplier-a",
  "required_units": 800,
  "minimum_order_quantity": 1000,
  "order_increment": 1000,
  "unit_price": 25,
  "order_quantity": 1000,
  "payment_due_day": 5,
  "allow_partial_order": false,
  "approved_payment_days": [5, 18]
}
```

`approved_payment_days` represents user-supplied permitted dates, not dates inferred or negotiated by the application. A proposed date must be selected from the applicable approved set or marked as a hypothetical option requiring approval.

### 8.8 Cash-Timing Service Interface

| Endpoint | Input | Result |
|---|---|---|
| `POST /api/cash-timeline` | Complete or partial dated cash-event schedule | Daily balances, cash minimum, reserve breaches, reconciliation |
| `POST /api/supplier/validate` | Order need, MOQ, increments, price, terms | Allowed quantity, invoice amount, validation messages |
| `POST /api/cash-recovery` | Timeline, supplier rules, approved candidate actions, target | Compared schedules, constraint status, remaining gaps |

The same operations can be implemented with framework-native server functions instead of separate HTTP routes, as long as the frontend and backend share equivalent request and response shapes.

### 8.9 Validation Rules

- Reject missing required financial inputs and nonnumeric values.
- Reject negative payment amounts unless a field explicitly models credits or refunds.
- Reject negative opening cash only if the agreed model does not support overdraft; otherwise treat it explicitly.
- Keep receipt-decline percentages within 0-100% for that control.
- Require positive unit counts for per-unit calculations.
- Reject impossible loan terms or rates in financing analysis.
- Do not compute a percentage ratio with a zero denominator.
- Record the meaning and units of every scenario control.
- Preserve baseline data when applying scenarios; never mutate the original input object.
- Require valid calendar days and unique identifiers for dated events.
- Ensure dated inflow and outflow categories reconcile to the monthly financial model before labeling a schedule complete.
- Reject nonpositive MOQ, order increments, or unit prices when a supplier order is evaluated.
- Prevent the same material invoice or customer receipt from being counted twice after a scheduling change.
- Distinguish supplier-approved payment terms from hypothetical, approval-dependent proposals.

## 9. Development Roadmap

Development is organized around independently testable deliverables. **P0** covers the core financial assessment and connected demo, **P1** covers extended manufacturing and decision analysis, and **P2** covers optional enhancements. Feature labels in the roadmap indicate priorities, not completion status.

The initial integration milestone is a completed questionnaire producing correct financial results in the browser. Backend, frontend, and data preparation can then progress in parallel.

### Phase A: Foundation

- [ ] **A01 | P0: Confirm frontend, backend, and deployment stack.** Done when: Frameworks and communication method are recorded.
- [ ] **A02 | P0: Define shared currency and reporting-period conventions.** Done when: All calculations use a consistent unit and month.
- [ ] **A03 | P0: Approve baseline input schema.** Done when: One sample JSON payload validates end to end.
- [ ] **A04 | P0: Approve baseline output and error schemas.** Done when: Frontend mock results match backend responses.
- [ ] **A05 | P0: Create synthetic manufacturer profile.** Done when: Fixture reproduces the baseline values in Section 7.
- [ ] **A06 | P0: Initialize repository and environment configuration.** Done when: Every contributor can run the starter application.
- [ ] **A07 | P0: Establish test command and basic continuous checks.** Done when: One test passes in a fresh checkout.
- [ ] **A08 | P0: Connect one financial input to one visible result.** Done when: A browser change produces a verified calculation.

### Phase B: Financial Calculation Engine

- [ ] **B01 | P0: Validate required financial fields.** Done when: Missing, nonnumeric, or invalid inputs return useful errors.
- [ ] **B02 | P0: Calculate operating payments.** Done when: Reference total equals $60,000.
- [ ] **B03 | P0: Calculate total cash payments.** Done when: Reference total equals $66,000 without debt duplication.
- [ ] **B04 | P0: Calculate net cash flow and ending cash.** Done when: Reference results equal $14,000 and $44,000.
- [ ] **B05 | P0: Calculate reserve headroom.** Done when: Reference headroom equals $24,000.
- [ ] **B06 | P0: Calculate debt-payment burden.** Done when: Reference burden equals 7.5%; zero receipts are handled.
- [ ] **B07 | P0: Add monetary precision and rounding tests.** Done when: Displayed values match test expectations to cents.
- [ ] **B08 | P0: Expose baseline calculation through the service layer.** Done when: Input JSON returns validated metrics.

### Phase C: Scenario Engine

- [ ] **C01 | P0: Implement material-cost percentage changes.** Done when: A 20% increase adds $5,000 to material payments.
- [ ] **C02 | P0: Implement customer-collection changes.** Done when: A 15% decline reduces receipts to $68,000.
- [ ] **C03 | P0: Combine multiple shocks.** Done when: Combined reference net cash flow equals -$3,000.
- [ ] **C04 | P0: Keep baseline input immutable.** Done when: Repeated simulations do not change original figures.
- [ ] **C05 | P0: Return baseline, revised metrics, and differences.** Done when: The UI can display a complete comparison.
- [ ] **C06 | P0: Support reset and valid percentage ranges.** Done when: Zero shock reproduces baseline and invalid ranges are rejected.
- [ ] **C07 | P0: Add other operating and debt payment scenarios.** Done when: Affected cash metrics recalculate consistently.

### Phase D: Risk and Manufacturing Analysis

- [ ] **D01 | P0: Calculate material break-even threshold.** Done when: Reference threshold equals 56%.
- [ ] **D02 | P0: Calculate collection-decline break-even threshold.** Done when: Reference threshold equals 17.5%.
- [ ] **D03 | P0: Calculate ending-cash reserve threshold.** Done when: Reference material threshold equals 96%.
- [ ] **D04 | P0: Handle already-breached thresholds and zeros.** Done when: Undefined or already-breached states are explicit.
- [ ] **D05 | P1: Attribute individual cash-flow shocks.** Done when: Contributions reconcile to total scenario change.
- [ ] **D06 | P1: Calculate material cost per unit.** Done when: 1,000 units and $25,000 yield $25 per unit.
- [ ] **D07 | P1: Calculate material-only contribution per unit.** Done when: Receipts and unit assumptions are displayed.
- [ ] **D08 | P1: Calculate illustrative price offset.** Done when: A 20% material shock produces a $5 unit offset under stated assumptions.

### Phase E: Actions and Goal Planning

- [ ] **E01 | P1: Model a supplier percentage discount.** Done when: Reduced material payments and resulting cash flow are correct.
- [ ] **E02 | P1: Model an operating-cost reduction.** Done when: Savings apply only to selected costs.
- [ ] **E03 | P1: Model a collection improvement.** Done when: Additional receipts or shifted timing are explicitly distinguished.
- [ ] **E04 | P1: Compare actions against the same starting scenario.** Done when: Results use identical starting assumptions.
- [ ] **E05 | P1: Show remaining target gap.** Done when: Each action reports how far it is from the goal.
- [ ] **E06 | P1: Calculate required additional receipts.** Done when: Target cash balance yields a verified required increase.
- [ ] **E07 | P1: Calculate required payment reduction.** Done when: Target cash flow yields a verified savings amount.
- [ ] **E08 | P1: Flag infeasible actions and limits.** Done when: Exceeding a selected cap cannot be labeled feasible.

### Phase F: Frontend and Visualizations

- [ ] **F01 | P0: Build four-phase questionnaire.** Done when: Inputs survive navigation and retain values.
- [ ] **F02 | P0: Validate required fields inline.** Done when: Incorrect entries produce readable messages.
- [ ] **F03 | P0: Display key dashboard metrics.** Done when: Cards show correct amounts and reporting period.
- [ ] **F04 | P0: Visualize payment categories.** Done when: Expense breakdown reconciles to totals.
- [ ] **F05 | P0: Add scenario controls and reset.** Done when: Controls update baseline comparisons reliably.
- [ ] **F06 | P0: Display break-even thresholds.** Done when: Undefined and exceeded thresholds are understandable.
- [ ] **F07 | P1: Display risk-driver contributions.** Done when: Values reconcile to the scenario delta.
- [ ] **F08 | P1: Build action comparison table.** Done when: Users can compare target and resulting figures.
- [ ] **F09 | P1: Show goal-planning results.** Done when: Required changes and feasibility are visible.
- [ ] **F10 | P0: Test on the intended demo screen.** Done when: No essential control is hidden or unusable.

### Phase G: Application Integration

- [ ] **G01 | P0: Connect questionnaire to baseline calculations.** Done when: Completed input produces the correct dashboard.
- [ ] **G02 | P0: Connect scenario changes to backend results.** Done when: Control updates use calculated service responses.
- [ ] **G03 | P0: Connect thresholds and action comparisons.** Done when: UI values match backend test fixtures.
- [ ] **G04 | P0: Handle loading and failure states.** Done when: No stale or misleading results remain after an error.
- [ ] **G05 | P0: Load demo data without external accounts.** Done when: Core walkthrough works from a fresh session.
- [ ] **G06 | P0: Prepare stable local or hosted demo.** Done when: Application runs on the event demonstration device.
- [ ] **G07 | P0: Add external integration only after provider confirmation.** Done when: Any imported data is mapped and validated against shared schema.

### Phase H: Data and Reference Testing

- [ ] **H01 | P0: Document synthetic manufacturing profile.** Done when: Every baseline input has a definition.
- [ ] **H02 | P0: Prepare baseline and combined-shock expected outputs.** Done when: Fixtures cover all four displayed scenarios.
- [ ] **H03 | P1: Prepare unit-economics assumptions.** Done when: Volume and collection-price assumptions are consistent.
- [ ] **H04 | P1: Prepare complete dated cash schedule.** Done when: Receipts sum to $80,000 and payments to $66,000.
- [ ] **H05 | P1: Prepare supplier MOQ and payment-term fixture.** Done when: Minimum purchase is 1,000 units at $25 each.
- [ ] **H06 | P0: Test source-of-truth numerical consistency.** Done when: Dashboard, tables, and exports match engine outputs.
- [ ] **H07 | P0: Review sample data and repository secrets.** Done when: No real account data or credentials are committed.

### Phase I: Cash Gap Navigator and Supplier Constraints

- [ ] **I01 | P1: Define dated receipt and payment event schema.** Done when: IDs, dates, categories, directions, and amounts validate.
- [ ] **I02 | P1: Aggregate cash events by date.** Done when: All same-day events affect that day’s ending balance.
- [ ] **I03 | P1: Calculate daily cash balance series.** Done when: Final daily balance reconciles to $44,000.
- [ ] **I04 | P1: Find minimum cash and breach dates.** Done when: Minimum is -$17,000 on Day 10; reserve breach starts Day 5.
- [ ] **I05 | P1: Calculate reserve liquidity shortfall.** Done when: Reference maximum shortfall equals $37,000.
- [ ] **I06 | P1: Detect partial timeline coverage.** Done when: Incomplete schedules are clearly labeled.
- [ ] **I07 | P1: Validate supplier order size.** Done when: 800 units fails a 1,000-unit MOQ requirement.
- [ ] **I08 | P1: Apply order increments and unit prices.** Done when: Minimum valid order produces a $25,000 invoice.
- [ ] **I09 | P1: Validate approval of alternate payment dates.** Done when: Unapproved extensions are flagged as conditional.
- [ ] **I10 | P1: Reschedule an existing supplier payment.** Done when: Moving Day 5 to Day 18 produces no duplicate outflow.
- [ ] **I11 | P1: Move a portion of an existing collection earlier.** Done when: Moving $12,000 from Day 28 to Day 9 preserves receipts.
- [ ] **I12 | P1: Recompute each recovery candidate.** Done when: Supplier deferral alone yields an $8,000 minimum.
- [ ] **I13 | P1: Compare combined recovery actions.** Done when: Both approved changes yield a $20,000 minimum.
- [ ] **I14 | P1: Report reserve target attainment and constraint status.** Done when: Each candidate is labeled feasible, conditional, or invalid.
- [ ] **I15 | P1: Build cash timeline and reserve visualization.** Done when: The negative Day 10 balance and reserve floor are visible.
- [ ] **I16 | P1: Build supplier form and recovery comparison view.** Done when: Invalid orders and approved options display correctly.
- [ ] **I17 | P1: Integrate optional views without blocking monthly analysis.** Done when: Core workflow functions with no dated events.

### Phase J: Quality, Documentation, and Submission

- [ ] **J01 | P0: Run required numerical unit tests.** Done when: All baseline, stress, and threshold cases pass.
- [ ] **J02 | P0: Run end-to-end demonstration test.** Done when: Questionnaire through recovery comparison works.
- [ ] **J03 | P0: Test zero, missing, and extreme values.** Done when: Results are defined or errors are clearly displayed.
- [ ] **J04 | P0: Check financial event reconciliation.** Done when: Dated totals agree with monthly model.
- [ ] **J05 | P0: Confirm keyboard and viewport usability.** Done when: Primary interactions work on the demo device.
- [ ] **J06 | P0: Document real installation and startup commands.** Done when: A clean checkout can launch the application.
- [ ] **J07 | P0: Record actual frameworks and integrations.** Done when: Documentation matches the current source.
- [ ] **J08 | P0: List generative AI tools and third-party services.** Done when: README and submission disclosures identify actual usage.
- [ ] **J09 | P0: Create and check a three-minute demo video.** Done when: Video shows working software and correct figures.
- [ ] **J10 | P0: Rehearse the presentation and questions.** Done when: Demo can be delivered reliably within the time limit.
- [ ] **J11 | P0: Verify main and optional track eligibility.** Done when: Selected categories satisfy the event requirements.
- [ ] **J12 | P0: Complete public repository and Devpost submission.** Done when: Required materials are submitted by the deadline.

## 10. Development Sequence

| Milestone | Expected result |
|---|---|
| 1. Shared foundation | Agreed financial inputs and outputs, running application skeleton, and verified synthetic data |
| 2. Monthly financial model | Questionnaire generates accurate cash-flow and reserve metrics |
| 3. Scenario and risk analysis | Material and collection shocks, break-even thresholds, and reconciled risk drivers |
| 4. Action planning | Financial alternatives and goal-based adjustments work against a common scenario |
| 5. Dated liquidity extension | Daily cash gaps, supplier constraints, and recovery comparisons operate end to end |
| 6. Delivery | Validated demo, actual setup instructions, recorded video, and submission |

Complete and integrate the initial financial workflow before relying on the optional cash-timing modules for the demo. A working monthly model remains available if dated records or third-party data are unavailable.

## 11. Testing Reference Cases

| Test | Input or scenario | Expected result |
|---|---|---|
| Operating payments | Materials $25k + payroll $22k + facility $8k + other $5k | $60,000 |
| Total payments | Operating $60k + debt $6k | $66,000 |
| Baseline cash flow | Receipts $80k minus payments $66k | +$14,000 |
| Baseline ending cash | Opening $30k plus net $14k | $44,000 |
| Debt burden | $6k / $80k | 7.5% |
| Material shock | Materials +20% | $9,000 net cash flow |
| Receipt shock | Collections -15% | $2,000 net cash flow |
| Combined shock | Materials +20% and receipts -15% | -$3,000 net cash flow |
| Material break-even | Cash surplus $14k / materials $25k | 56% |
| Receipt break-even | Cash surplus $14k / receipts $80k | 17.5% |
| Reserve threshold | ($44k - $20k) / $25k | 96% |
| Full dated schedule | Reference receipts and payments | Lowest cash -$17,000 on Day 10 |
| Reserve shortfall | Reserve $20k; daily minimum -$17k | $37,000 |
| Supplier deferral | Move $25k payment from Day 5 to Day 18 | Minimum daily cash $8,000 |
| Combined recovery | Defer payment and move $12k collection to Day 9 | Minimum daily cash $20,000 |
| Supplier order | Need 800 units; MOQ 1,000; price $25 | Purchase 1,000 units for $25,000 |

Additional tests cover zero receipts, zero material payments, negative or missing inputs, percentage limits, duplicate event IDs, incomplete dated schedules, and action limits.

## 12. Repository and Collaboration

The repository structure follows the frameworks used by the application. Logical modules include:

```text
smartflow/
  README.md
  frontend/
  backend/
    financial_engine.py
    scenario_engine.py
    risk_analysis.py
    manufacturing.py
    cash_timeline.py
    supplier_constraints.py
    recovery_planner.py
  data/
    demo_factory.json
  tests/
  docs/
```

The application may use a different physical folder structure when financial services are implemented through an application framework. File names above describe responsibilities rather than a dependency on a specific framework.

Contributions should be developed in small branches and integrated once the shared request and response format is stable. Test the financial changes associated with a pull request before merging.

## 13. Security and Financial Data

- Use synthetic demonstration data unless authorized business data is explicitly provided.
- Keep API credentials and access tokens out of the repository.
- Validate inputs before calculations and distinguish cash receipts from recognized revenue.
- Do not treat equipment, inventory, or receivables as immediately available cash.
- Identify payment-date changes that depend on supplier or customer approval.
- Reconcile cash events to the applicable reporting period before presenting complete timelines.
- Store any imported financial information using the access and security controls applicable to the selected service.

## 14. Team

| Member | Responsibility |
|---|---|
| **Brian** | Application development, system integration, and confirmed external services |
| **Jasmine** | Frontend implementation, interface design, and UI/UX |
| **Chaewon** | Backend financial calculations, scenario analysis, risk models, manufacturing metrics, and numerical validation |
| **Sarah** | Data collection, synthetic business profiles, supplier scenarios, and reference examples |

All members contribute to integration testing and the demonstration.

## 15. HackGB 2026

**Main track:** Industrial  
**Dates:** October 17-18, 2026  
**Submission deadline:** Sunday, October 18, 2026 at 12:00 PM Central Time

### Judging Criteria

| Criterion | Weight |
|---|---:|
| Technical Implementation | 25% |
| Impact and Problem-Solving | 25% |
| Innovation and Creativity | 20% |
| User Experience and Design | 15% |
| Presentation and Demonstration | 15% |

The project enters one main track. Eligible additional and sponsored categories may be selected with the same submission according to the requirements of each category.

### Submission Requirements

- Public GitHub repository containing code and project documentation.
- Project description covering the problem, solution, and architecture.
- Demonstration video no longer than three minutes.
- Disclosure of generative AI assistants, services, and third-party APIs used.
- Submission through the event's Devpost before the deadline.

### AI Development Disclosure

Generative AI is used to support software development, interface creation, testing, and documentation. AI-assisted development tools and any third-party services integrated into the application are identified in the final submission. Financial calculation results are checked against the reference test cases above.
