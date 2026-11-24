import { CategoryRow } from "@/types/categories";
import { filterByPeriod, isInPeriod } from "../period";

describe("isInPeriod", () => {
    test.each([
        ["2026-10-01T00:00:00Z", { month: 9, year: 2026 }, true],
        ["2026-10-31T23:59:59Z", { month: 9, year: 2026 }, true],
        ["2026-10-01T00:00:00Z", { month: 10, year: 2026 }, false],
        ["2026-10-01T00:00:00Z", { month: 9, year: 2025 }, false],
        ["2026-01-01T00:00:00Z", { month: 0, year: 2026 }, true],
        ["2026-12-01T00:00:00Z", { month: 11, year: 2026 }, true],
    ])("%s in %o -> %s", (isoMonth, period, expected) => {
        expect(isInPeriod(isoMonth, period)).toBe(expected);
    });
});

describe("filterByPeriod", () => {
    const rows: CategoryRow[] = [
        {
            id: 1,
            name: "Courses",
            expenses: [
                { id: 1, label: "Carrefour", amount: 54.3, month: "2026-10-01T00:00:00Z" },
                { id: 2, label: "Lidl", amount: 32.6, month: "2026-11-01T00:00:00Z" },
            ],
        },
        {
            id: 2,
            name: "Abonnements",
            expenses: [{ id: 3, label: "Netflix", amount: 13.49, month: "2026-11-01T00:00:00Z" }],
        },
    ];

    test("keeps only the expenses of the given month", () => {
        const result = filterByPeriod(rows, { month: 9, year: 2026 });

        expect(result[0].expenses).toEqual([rows[0].expenses[0]]);
    });

    test("keeps every category, even without expenses in the month", () => {
        const result = filterByPeriod(rows, { month: 9, year: 2026 });

        expect(result.map((row) => row.name)).toEqual(["Courses", "Abonnements"]);
        expect(result[1].expenses).toEqual([]);
    });

    test("returns empty categories for a month without any expense", () => {
        const result = filterByPeriod(rows, { month: 0, year: 2026 });

        expect(result.every((row) => row.expenses.length === 0)).toBe(true);
    });

    test("does not modify the input", () => {
        const copy = structuredClone(rows);

        filterByPeriod(rows, { month: 9, year: 2026 });

        expect(rows).toEqual(copy);
    });
});
