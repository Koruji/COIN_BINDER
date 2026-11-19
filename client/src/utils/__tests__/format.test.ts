import { formatAmount } from "../format";

describe("formatAmount", () => {
    test.each([
        [1040.61, "1040,61"],
        [100, "100,00"],
        [254.8, "254,80"],
        [0, "0,00"],
        [-5.5, "-5,50"]
    ])
    ("convert %d to %s", (input, expected) => {
        var result = formatAmount(input);
        expect(result).toEqual(expected);
    })
});