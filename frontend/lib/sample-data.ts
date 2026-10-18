import { categorize } from "./categorize";
import type { StatementMeta, Txn } from "./types";

// Deterministic 12-month demo dataset (Oct 2025 – Sep 2026) for a small manufacturer.
function rng(seed: number) { return () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296); }

export function sampleData(): { txns: Txn[]; files: StatementMeta[] } {
  const rand = rng(42);
  const txns: Txn[] = [];
  const files: StatementMeta[] = [];
  let balance = 38000;
  for (let i = 0; i < 12; i++) {
    const d = new Date(2025, 9 + i, 1);
    const y = d.getFullYear(), m = d.getMonth() + 1;
    const name = `sample-statement-${y}-${String(m).padStart(2, "0")}.pdf`;
    const season = 1 + 0.12 * Math.sin((i / 12) * Math.PI * 2);
    const day = (n: number) => `${y}-${String(m).padStart(2, "0")}-${String(Math.min(n, 28)).padStart(2, "0")}`;
    const items: [number, string, number][] = [
      [1, "RENT - INDUSTRIAL UNIT", -4200], [3, "PAYROLL GUSTO", -11800], [17, "PAYROLL GUSTO", -11800],
      [5, "SBA LOAN PAYMENT", -1650], [12, "EQUIPMENT FIN PMT", -980], [8, "ELECTRIC UTILITY", -Math.round(620 + rand() * 180)],
      [9, "QUICKBOOKS SOFTWARE", -85], [20, "FACEBK ADS", -Math.round(300 + rand() * 250)],
      [6, "STEEL WHOLESALE SUPPLY", -Math.round(8200 * season + rand() * 900)], [19, "PACKAGING SUPPLIES ULINE", -Math.round(1300 + rand() * 400)],
      [14, "LUMBER VENDOR INVENTORY", -Math.round(3100 * season + rand() * 500)],
      [2, "INVOICE DEPOSIT - ACME RETAIL", Math.round(9500 * season + rand() * 1500)], [10, "STRIPE PAYOUT", Math.round(7200 * season + rand() * 1800)],
      [16, "INVOICE DEPOSIT - NORTHWIND", Math.round(11800 * season + rand() * 2000)], [24, "SQUARE DEPOSIT", Math.round(5400 * season + rand() * 1200)],
      [27, "WIRE IN - BRIGHTON SUPPLY", Math.round(8800 * season + rand() * 2200)],
      [11, "ONLINE TRANSFER TO SAVINGS", -2000],
    ];
    items.sort((a, b) => a[0] - b[0]);
    let count = 0;
    items.forEach(([dd, desc, amt], k) => {
      balance += amt;
      txns.push({ id: `${name}-${k}`, date: day(dd), description: desc, amount: amt, balance: Math.round(balance * 100) / 100, category: categorize(desc, amt), source: name });
      count++;
    });
    files.push({ name, size: 0, status: "ok", count, from: day(1), to: day(27), endingBalance: Math.round(balance * 100) / 100, message: "Sample data" });
  }
  return { txns, files };
}
