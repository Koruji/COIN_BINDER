import { render, screen, userEvent } from "@testing-library/react-native";

import { CategoriesCard } from "@/components/CategoriesCard";
import { CategoryRow } from "@/types/categories";

const categories: CategoryRow[] = [
  {
    id: 1,
    name: "CIVIC",
    expenses: [
      { id: 1, label: "Assurance voiture", amount: 68.94, month: "2026-10-01T00:00:00Z" },
      { id: 2, label: "Assurance voiture", amount: 88.94, month: "2026-10-01T00:00:00Z" },
      { id: 3, label: "Assurance voiture", amount: 88.94, month: "2026-10-01T00:00:00Z" },
    ],
  },
  {
    id: 2,
    name: "Sorties, events",
    expenses: [{ id: 1, label: "Concert", amount: 200, month: "2026-10-01T00:00:00Z" }],
  },
  {
    id: 3,
    name: "Vêtements",
    expenses: [{ id: 1, label: "Veste", amount: 100, month: "2026-10-01T00:00:00Z" }],
  },
];

describe("[integration] CategoriesCard + CategoryBar + amount utils", () => {
  test("shows the number of categories and the computed total", async () => {
    await render(<CategoriesCard categories={categories} />);

    expect(screen.getByText("Catégories")).toBeOnTheScreen();
    expect(screen.getByText("3 catégories")).toBeOnTheScreen();
    expect(screen.getByText("546,82")).toBeOnTheScreen();
  });

  test("shows one bar per category with its own amount", async () => {
    await render(<CategoriesCard categories={categories} />);

    expect(screen.getByText("CIVIC")).toBeOnTheScreen();
    expect(screen.getByText("246,82")).toBeOnTheScreen();
    expect(screen.getByText("Sorties, events")).toBeOnTheScreen();
    expect(screen.getByText("Vêtements")).toBeOnTheScreen();
  });

  test("expands a category from its arrow", async () => {
    const user = userEvent.setup();
    await render(<CategoriesCard categories={categories} />);

    await user.press(
      screen.getByRole("button", { name: "Afficher les dépenses de Vêtements" }),
    );

    expect(
      screen.getByRole("button", { name: "Masquer les dépenses de Vêtements" }),
    ).toBeExpanded();
  });

  test("calls onManageExpenses with the id and name of the pressed category", async () => {
    const user = userEvent.setup();
    const onManageExpenses = jest.fn();
    await render(<CategoriesCard categories={categories} onManageExpenses={onManageExpenses} />);

    await user.press(
      screen.getByRole("button", { name: "Afficher les dépenses de Sorties, events" }),
    );
    await user.press(screen.getAllByText("Gérer les dépenses")[1]);

    expect(onManageExpenses).toHaveBeenCalledWith({ id: 2, name: "Sorties, events" });
  });

  test("shows a singular label and a zero total when there are no expenses", async () => {
    await render(<CategoriesCard categories={[{ id: 1, name: "Vide", expenses: [] }]} />);

    expect(screen.getByText("1 catégorie")).toBeOnTheScreen();
    expect(screen.getAllByText("0,00")).toHaveLength(2);
  });

  test("shows zero categories for an empty list", async () => {
    await render(<CategoriesCard categories={[]} />);

    expect(screen.getByText("0 catégorie")).toBeOnTheScreen();
  });
});
