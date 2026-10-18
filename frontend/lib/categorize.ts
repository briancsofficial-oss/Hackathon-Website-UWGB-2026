import type { Category } from "./types";

// Keyword rules, checked in order. Heuristic only: swap for a real categorizer (or Plaid enrichment) later.
const DEBIT_RULES: [Category, RegExp][] = [
  ["transfer", /\b(TRANSFER|XFER|OWNER (DRAW|CONTRIB)|ZELLE TO (SELF|SAVINGS))\b/],
  ["debt", /\b(LOAN|MORTGAGE|LINE OF CREDIT|LOC PMT|CREDIT CARD|CARD PAYMENT|CARD PMT|SBA|LEASE PMT|EQUIPMENT FIN|INTEREST CHARGE|FINANCE CHARGE|AMEX|CAPITAL ONE)\b/],
  ["payroll", /\b(PAYROLL|GUSTO|ADP|PAYCHEX|PAYCOM|WAGES|SALARY)\b/],
  ["materials", /\b(MATERIAL|MATERIALS|SUPPLY|SUPPLIES|WHOLESALE|INVENTORY|STEEL|LUMBER|FABRIC|PACKAGING|RAW|ULINE|GRAINGER|SYSCO|US FOODS|HOME DEPOT|LOWES|VENDOR)\b/],
  ["overhead", /\b(RENT|LEASE|ELECTRIC|UTILITY|UTILITIES|WATER|INTERNET|COMCAST|VERIZON|AT&T|INSURANCE|SOFTWARE|AWS|GOOGLE|MICROSOFT|ADOBE|QUICKBOOKS|SHOPIFY|MARKETING|FACEBK|META ADS|SERVICE FEE|MONTHLY FEE|TAX|FUEL|SHELL|PHONE)\b/],
];
const CREDIT_TRANSFER = /\b(TRANSFER|XFER|OWNER (DRAW|CONTRIB)|LOAN PROCEEDS)\b/;
const CREDIT_HINT = /\b(DEPOSIT|DEP|CREDIT|REFUND|INTEREST PAID|PAYMENT FROM|SQUARE|STRIPE|PAYPAL|SHOPIFY PAYOUT|INVOICE|ACH CREDIT|WIRE IN)\b/;

export function categorize(description: string, amount: number): Category {
  const d = description.toUpperCase();
  if (amount > 0) return CREDIT_TRANSFER.test(d) ? "transfer" : "revenue";
  for (const [cat, re] of DEBIT_RULES) if (re.test(d)) return cat;
  return "other";
}

export function looksLikeCredit(description: string) {
  return CREDIT_HINT.test(description.toUpperCase());
}

export const CATEGORY_LABELS: Record<Category, string> = {
  revenue: "Revenue",
  materials: "Raw materials",
  payroll: "Payroll",
  overhead: "Rent, utilities & software",
  debt: "Debt payments",
  transfer: "Transfers",
  other: "Other expenses",
};

export const SLICE_COLORS: Record<Category | "retained", string> = {
  payroll: "#f7b8c9", materials: "#e3f7f0", overhead: "#6366F1", other: "#F59E0B", debt: "#86EFAC", transfer: "#0EA5E9", revenue: "#F43F5E", retained: "#A855F7",
};
export const SLICE_LABELS: Record<Category | "retained", string> = { ...CATEGORY_LABELS, retained: "Cash retained" };

export const COLORS = [
  "#f7b8c9",
  "#e3f7f0",
  "#6366F1",
  "#F59E0B",
  "#86EFAC",
  "#0EA5E9",
  "#F43F5E",
  "#A855F7"
]