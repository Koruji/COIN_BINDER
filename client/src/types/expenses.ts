export type Expense = {
  id: number,
  label: string,
  user_id: number,
  category_id?: number,
  month: string,
  amount: number,
  created_at: string
};

export type NewExpense = {
    label: string, 
    category_id?: number,
    month: string,
    amount: number
}

export type UpdateExpense = {
    label: string,
    category_id?: number,
    amount: number
}

export type ExpenseRow = {
  id: number,
  label: string,
  amount: number,
  month: string
};