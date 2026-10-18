import { categorize, looksLikeCredit } from "./categorize";
import type { Txn } from "./types";

const MONTHS: Record<string, number> = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
const MON = "(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\\.?";

// Each pattern captures [month, day, year?] in a normalised way via the `read` function.
const DATE_PATTERNS: { re: RegExp; read: (m: RegExpMatchArray) => [number, number, number | undefined] }[] = [
  { re: /^(\d{4})-(\d{2})-(\d{2})\s+/, read: (m) => [+m[2], +m[3], +m[1]] },
  { re: /^(\d{1,2})[\/-](\d{1,2})(?:[\/-](\d{2,4}))?\s+/, read: (m) => [+m[1], +m[2], m[3] ? fullYear(+m[3]) : undefined] }, // US order: MM/DD
  { re: new RegExp(`^${MON}\\s+(\\d{1,2})(?:,?\\s+(\\d{4}))?\\s+`, "i"), read: (m) => [MONTHS[m[1].toLowerCase()], +m[2], m[3] ? +m[3] : undefined] },
  { re: new RegExp(`^(\\d{1,2})\\s+${MON}(?:\\s+(\\d{4}))?\\s+`, "i"), read: (m) => [MONTHS[m[2].toLowerCase()], +m[1], m[3] ? +m[3] : undefined] },
];
const fullYear = (y: number) => (y < 100 ? 2000 + y : y);

const MONEY = /(\()?(-)?\$?\s?(\d{1,3}(?:,\d{3})+|\d+)\.(\d{2})(\))?(-)?(?:\s?(CR|DR))?(?![\d])/gi;
type Money = { value: number; sign: -1 | 1 | 0; index: number };

function moneyTokens(s: string): Money[] {
  const out: Money[] = [];
  for (const m of s.matchAll(MONEY)) {
    const value = parseFloat(`${m[3].replace(/,/g, "")}.${m[4]}`);
    const neg = !!(m[1] || m[2] || m[6]) || m[7]?.toUpperCase() === "DR";
    const pos = m[7]?.toUpperCase() === "CR";
    out.push({ value, sign: neg ? -1 : pos ? 1 : 0, index: m.index ?? 0 });
  }
  return out;
}

const SKIP_DESC = /(beginning|opening|previous|ending|closing|new) balance|balance forward|total|summary|page \d|account number|statement period/i;
const CREDIT_HEADER = /^(deposits?|credits?|additions?|other credits)\b/i;
const DEBIT_HEADER = /^(withdrawals?|debits?|checks?|purchases|other debits|fees|electronic payments|subtractions)\b/i;

export type ParsedStatement = {
  transactions: Omit<Txn, "id" | "source">[];
  from?: string;
  to?: string;
  endingBalance?: number;
};

export function parseStatementText(text: string): ParsedStatement {
  const lines = text.split(/\r?\n/).map((l) => l.replace(/\s+/g, " ").trim()).filter(Boolean);

  // Years mentioned in the first part of the statement tell us the period for dates printed without a year.
  const header = lines.slice(0, 40).join(" ");
  const years = [...new Set([...header.matchAll(/\b(20\d{2})\b/g)].map((m) => +m[1]))].sort();
  const fallbackYear = years.at(-1) ?? new Date().getFullYear();
  const yearFor = (month: number, explicit?: number) => {
    if (explicit) return explicit;
    if (years.length >= 2) return month >= 7 ? years[0] : years[years.length - 1]; // period crosses New Year
    return fallbackYear;
  };

  let prevBalance: number | undefined;
  let endingBalance: number | undefined;
  let mode: 1 | -1 | 0 = 0;
  const txns: ParsedStatement["transactions"] = [];
  let lastWasTxn = false;

  for (const line of lines) {
    const lower = line.toLowerCase();

    const balLine = /(beginning|opening|previous) balance|balance forward/i.test(line);
    const endLine = /(ending|closing|new) balance/i.test(line);
    if (balLine || endLine) {
      const t = moneyTokens(line).at(-1);
      if (t && balLine) prevBalance = t.value;
      else if (t) endingBalance = t.value;
      lastWasTxn = false;
      continue;
    }
    if (CREDIT_HEADER.test(lower) && !moneyTokens(line).length) { mode = 1; lastWasTxn = false; continue; }
    if (DEBIT_HEADER.test(lower) && !moneyTokens(line).length) { mode = -1; lastWasTxn = false; continue; }

    let date: [number, number, number | undefined] | undefined;
    let rest = line;
    for (const p of DATE_PATTERNS) {
      const m = line.match(p.re);
      if (m) {
        const [mo, d, y] = p.read(m);
        if (mo >= 1 && mo <= 12 && d >= 1 && d <= 31) { date = [mo, d, y]; rest = line.slice(m[0].length); break; }
      }
    }

    if (!date) {
      // Wrapped description line: no date, no amounts, directly after a transaction.
      const prev = txns.at(-1);
      if (lastWasTxn && prev && !moneyTokens(line).length && line.length < 70 && !SKIP_DESC.test(line)) prev.description = `${prev.description} ${line}`.slice(0, 120);
      else lastWasTxn = false;
      continue;
    }

    // Some banks print both a transaction date and a posting date.
    for (const p of DATE_PATTERNS) { const m = rest.match(p.re); if (m) { rest = rest.slice(m[0].length); break; } }

    const tokens = moneyTokens(rest);
    if (!tokens.length) { lastWasTxn = false; continue; }
    const description = rest.slice(0, tokens[0].index).replace(/[\s$]+$/, "").trim();
    if (!description || SKIP_DESC.test(description)) { lastWasTxn = false; continue; }

    const amountTok = tokens.length >= 2 ? tokens[tokens.length - 2] : tokens[0];
    const balance = tokens.length >= 2 ? tokens[tokens.length - 1].value : undefined;
    const abs = amountTok.value;

    // Work out the direction: printed sign > balance change > column header > wording.
    let sign: 1 | -1 = -1;
    if (amountTok.sign) sign = amountTok.sign;
    else if (balance !== undefined && prevBalance !== undefined && Math.abs(balance - prevBalance - abs) < 0.011) sign = 1;
    else if (balance !== undefined && prevBalance !== undefined && Math.abs(prevBalance - balance - abs) < 0.011) sign = -1;
    else if (mode) sign = mode;
    else sign = looksLikeCredit(description) ? 1 : -1;
    if (balance !== undefined) prevBalance = balance;

    const [mo, d, y] = date;
    const year = yearFor(mo, y);
    const iso = `${year}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const amount = Math.round(sign * abs * 100) / 100;
    txns.push({ date: iso, description, amount, balance, category: categorize(description, amount) });
    lastWasTxn = true;
  }

  const dates = txns.map((t) => t.date).sort();
  if (endingBalance === undefined) endingBalance = [...txns].reverse().find((t) => t.balance !== undefined)?.balance;
  return { transactions: txns, from: dates[0], to: dates.at(-1), endingBalance };
}
