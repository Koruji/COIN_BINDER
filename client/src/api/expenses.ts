import { request } from "@/api/request";
import type { Expense, NewExpense, UpdateExpense } from "@/types/expenses";

export function getExpensesByCategory(categoryId: number): Promise<Expense[]> {
  return request<Expense[]>("GET", `/categories/${categoryId}/expenses`);
}

export function getExpenseById(id: number): Promise<Expense> {
  return request<Expense>("GET", `/categories/expenses/${id}`);
}

export function createExpense(expense: NewExpense): Promise<Expense> {
  return request<Expense>("POST", "/categories/expenses", expense);
}

export function updateExpense(
  id: number,
  expense: UpdateExpense,
): Promise<Expense> {
  return request<Expense>("PUT", `/categories/expenses/${id}`, expense);
}

export function deleteExpense(id: number): Promise<void> {
  return request<void>("DELETE", `/categories/expenses/${id}`);
}
