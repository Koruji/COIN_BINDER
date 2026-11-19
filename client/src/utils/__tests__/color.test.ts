import { blend } from "../color";

describe("blend", () => {
    test("ratio 1 : return foreground color", () => {
        // Arrange
        var color1 = "#F4EFE3";
        var color2 = "#5E5343";

        // Act
        var result = blend(color1, color2, 1);

        // Assert
        expect(result).toBe("#f4efe3");
    });
    test("ratio 0 : return background color", () => {
        // Arrange
        var color1 = "#F4EFE3";
        var color2 = "#5E5343";

        // Act
        var result = blend(color1, color2, 0);

        // Assert
        expect(result).toBe("#5e5343");
    });
    test("ratio 0.5 : return mix between background and foreground color", () => {
        // Arrange
        var color1 = "#F4EFE3";
        var color2 = "#5E5343";

        // Act
        var result = blend(color1, color2, 0.5);

        // Assert
        expect(result).toBe("#a9a193");
    });
})