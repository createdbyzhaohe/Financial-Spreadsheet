export interface ExpenseItem {
  id: string;
  category: string;
  name: string;
  amount: number;
}

export enum Category {
  FIXED = '固定支出',
  LIVING = '生活預算',
  SAVINGS = '預存預算/投資',
  SHORT_TERM_DEBT = '短期債務',
  LONG_TERM_DEBT = '長期債務'
}

export interface SummaryData {
  fixedTotal: number;
  livingTotal: number;
  debtTotal: number;
  savingsTotal: number;
  monthlyTotal: number;
}

export interface SavedItem {
  category: string;
  name: string;
  amount: number;
}

export interface SavedRecord {
  id: string;
  date: string;
  items: SavedItem[];
  summary: SummaryData;
}