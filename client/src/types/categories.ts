import { ExpenseRow } from "./expenses";

export type Category = {
  id: number,
  user_id: number,
  label: string,
  amount: number,
  created_at: string
}

export type NewCategory = {
  label: string
}

export type UpdateCategory = {
  label: string
}

export type CategoryRow = {
  id: number;
  name: string;
  expenses: ExpenseRow[]
};