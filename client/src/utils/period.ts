import { CategoryRow } from "@/types/categories";

type Period = {
    year: number,
    month: number
}

export function isInPeriod(isoMonth: string, period: Period): boolean {
    const date = new Date(isoMonth);
    return date.getUTCFullYear() === period.year && date.getUTCMonth() === period.month;
}

export function filterByPeriod(rows: CategoryRow[], period: Period): CategoryRow[] {
    return rows.map((row) => ({
        ...row,
        expenses: row.expenses.filter((expense) => isInPeriod(expense.month, period)),
    }));
}
