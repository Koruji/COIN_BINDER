import { shiftMonth } from "../shiftMonth";

describe("shiftMonth", () => {
    test.each([
        [{ month: 9, year: 2026 }, +1, { month: 10, year: 2026 }],
        [{ month: 11, year: 2026 }, +1, { month: 0, year: 2027 }],
        [{ month: 0, year: 2026 }, -1, { month: 11, year: 2025 }],
        [{ month: 5, year: 2026 }, 0, { month: 5, year: 2026 }],
        [{ month: 5, year: 2026 }, +12, { month: 5, year: 2027 }],
    ])
    ("change displayed month", (period, delta, expected) => {
        const result = shiftMonth(period, delta);
        expect(result).toEqual(expected);
    })
})