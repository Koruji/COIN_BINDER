import { CategoryRow } from "@/types/categories";

export function formatAmount(value:number): string {
    return value.toFixed(2).toString().replace(".", ",");
}

export function categoryAmount(row: CategoryRow): number {
    return row.expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

export function totalAmount(rows: CategoryRow[]): number {
    return rows.reduce((sum, row) => sum + categoryAmount(row), 0);
}

export function categoryRatio(row: CategoryRow, total: number): number{
    return total > 0 ? categoryAmount(row) / total : 0;
}

export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}