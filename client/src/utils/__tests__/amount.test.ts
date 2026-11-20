import { CategoryRow } from "@/types/categories";
import { categoryAmount, categoryRatio, clamp, formatAmount, totalAmount } from "../amount";

describe("Amount", () => {
    test.each([
        [1040.61, "1040,61"],
        [100, "100,00"],
        [254.8, "254,80"],
        [0, "0,00"],
        [-5.5, "-5,50"]
    ])
    ("convert %d to %s", (input, expected) => {
        const result = formatAmount(input);
        expect(result).toEqual(expected);
    });
});

const makeRow = (...amounts: number[]): CategoryRow => ({
    id: "1",
    name: "Test",
    expenses: amounts.map((amount, i) => ({ id: String(i), label: "Dépense", amount })),
});

describe("categoryAmount", () => {
    test("returns 0 for a category without expenses", () => {
        expect(categoryAmount(makeRow())).toBe(0);
    });

    test("returns the amount of a single expense", () => {
        expect(categoryAmount(makeRow(100))).toBe(100);
    });

    test("sums several expenses", () => {
        expect(categoryAmount(makeRow(10, 20, 30))).toBe(60);
    });

    test("handles decimals", () => {
        expect(categoryAmount(makeRow(68.94, 88.94, 88.94))).toBeCloseTo(246.82);
    });
});

describe("totalAmount", () => {
    test("returns 0 when there are no categories", () => {
        expect(totalAmount([])).toBe(0);
    });

    test("sums the expenses of every category", () => {
        expect(totalAmount([makeRow(10, 20), makeRow(5), makeRow(100)])).toBe(135);
    });

    test("ignores empty categories", () => {
        expect(totalAmount([makeRow(), makeRow(50)])).toBe(50);
    });
});

describe("categoryRatio", () => {
    test("returns the share of the category in the total", () => {
        expect(categoryRatio(makeRow(25), 100)).toBe(0.25);
    });

    test("returns 1 when the category is the whole total", () => {
        expect(categoryRatio(makeRow(40, 60), 100)).toBe(1);
    });

    test("returns 0 for an empty category", () => {
        expect(categoryRatio(makeRow(), 100)).toBe(0);
    });

    test("returns 0 instead of dividing by zero when total is 0", () => {
        expect(categoryRatio(makeRow(10), 0)).toBe(0);
    });
});

describe("clamp", () => {
    test.each([
        [0.5, 0, 1, 0.5],
        [-0.2, 0, 1, 0],
        [1.7, 0, 1, 1],
        [0, 0, 1, 0],
        [1, 0, 1, 1],
        [0.5, 0.85, 1.4, 0.85],
        [2, 0.85, 1.4, 1.4],
    ])("clamp(%d, %d, %d) gives %d", (value, min, max, expected) => {
        expect(clamp(value, min, max)).toBe(expected);
    });
});
