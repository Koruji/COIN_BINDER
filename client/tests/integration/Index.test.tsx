import { render, screen, userEvent } from "@testing-library/react-native";

import Index from "@/app/index";
import { useCategories } from "@/hooks/useCategories";
import { CategoryRow } from "@/types/categories";

jest.mock("@/hooks/useCategories");
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

const mockUseCategories = jest.mocked(useCategories);

const categories: CategoryRow[] = [
  {
    id: 1,
    name: "Courses",
    expenses: [
      { id: 1, label: "Carrefour", amount: 54.3, month: "2026-10-01T00:00:00Z" },
      { id: 2, label: "Lidl", amount: 32.6, month: "2026-10-01T00:00:00Z" },
    ],
  },
  { id: 2, name: "Abonnements", expenses: [{ id: 3, label: "Netflix", amount: 13.49, month: "2026-10-01T00:00:00Z" }] },
];

describe("[integration] Index screen + useCategories", () => {
  test("shows a loader while the categories are loading", async () => {
    mockUseCategories.mockReturnValue({
      categories: [],
      loading: true,
      error: null,
      reload: jest.fn(),
    });

    await render(<Index />);

    expect(screen.queryByText("Catégories")).not.toBeOnTheScreen();
  });

  test("shows the categories and the computed total of the expenses", async () => {
    mockUseCategories.mockReturnValue({
      categories,
      loading: false,
      error: null,
      reload: jest.fn(),
    });

    await render(<Index />);

    expect(screen.getByText("2 catégories")).toBeOnTheScreen();
    expect(screen.getByText("Courses")).toBeOnTheScreen();
    expect(screen.getByText("Abonnements")).toBeOnTheScreen();
    expect(screen.getAllByText("100,39").length).toBeGreaterThan(0);
  });

  test("keeps showing the categories while reloading", async () => {
    mockUseCategories.mockReturnValue({
      categories,
      loading: true,
      error: null,
      reload: jest.fn(),
    });

    await render(<Index />);

    expect(screen.getByText("Courses")).toBeOnTheScreen();
  });

  test("shows the error and retries when pressing the button", async () => {
    const user = userEvent.setup();
    const reload = jest.fn();
    mockUseCategories.mockReturnValue({
      categories: [],
      loading: false,
      error: "ressource introuvable",
      reload,
    });

    await render(<Index />);

    expect(screen.getByText("ressource introuvable")).toBeOnTheScreen();
    expect(screen.queryByText("Catégories")).not.toBeOnTheScreen();

    await user.press(screen.getByRole("button", { name: "Réessayer" }));

    expect(reload).toHaveBeenCalledTimes(1);
  });

  test("only counts the expenses of the displayed month and follows the month switcher", async () => {
    const user = userEvent.setup();
    mockUseCategories.mockReturnValue({
      categories: [
        {
          id: 1,
          name: "Courses",
          expenses: [
            { id: 1, label: "Carrefour", amount: 50, month: "2026-10-01T00:00:00Z" },
            { id: 2, label: "Lidl", amount: 30, month: "2026-11-01T00:00:00Z" },
          ],
        },
      ],
      loading: false,
      error: null,
      reload: jest.fn(),
    });

    await render(<Index />);

    expect(screen.getAllByText("50,00").length).toBeGreaterThan(0);
    expect(screen.queryByText("30,00")).not.toBeOnTheScreen();

    await user.press(screen.getByRole("button", { name: "Next month" }));

    expect(screen.getAllByText("30,00").length).toBeGreaterThan(0);
    expect(screen.queryByText("50,00")).not.toBeOnTheScreen();
  });
});
