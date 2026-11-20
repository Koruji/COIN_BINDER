export type ExpenseRow = {
  id: string;
  label: string;
  amount: number;
};

export type CategoryRow = {
  id: string;
  name: string;
  expenses: ExpenseRow[];
};

export type Expense = {
  id: string;
  label: string;
  amount: string;
};