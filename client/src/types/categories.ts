import { ExpenseRow } from "./expenses";

export type Category = {
  id: number,
  user_id: number,
  label: string,
  amount: number,
  created_at: string
}

export type UpgradeCategory = {
  label: string
}

export type CategoryRow = {
  id: number;
  name: string;
  expenses: ExpenseRow[]
};