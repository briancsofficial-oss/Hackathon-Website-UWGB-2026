export type Category = "revenue" | "materials" | "payroll" | "overhead" | "debt" | "transfer" | "other";

export type Txn = {
  id: string;
  date: string; // YYYY-MM-DD
  description: string;
  amount: number; // positive = money in, negative = money out
  balance?: number; // running balance printed on the statement, if any
  category: Category;
  source: string; // statement file name
};

export type StatementMeta = {
  name: string;
  size: number;
  status: "ok" | "empty" | "error";
  count: number;
  from?: string;
  to?: string;
  endingBalance?: number;
  message?: string;
};

export const MAX_STATEMENTS = 12;
export const MAX_FILE_BYTES = 10 * 1024 * 1024;
