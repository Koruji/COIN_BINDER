import { Expense, ExpenseRow } from "@/types/expenses";

export function toExpenseRow(expense: Expense): ExpenseRow {
    return {
        id: expense.id,
        label: expense.label,
        amount: expense.amount
    };
}