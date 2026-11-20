import { render, screen, userEvent } from "@testing-library/react-native";

import { CategoriesCard } from "@/components/CategoriesCard";

describe("[integration] CategoriesCard + CategoryBar + amount utils", () => {
  test("shows the number of categories and the computed total", async () => {
    await render(<CategoriesCard />);

    expect(screen.getByText("Catégories")).toBeOnTheScreen();
    expect(screen.getByText("3 catégories")).toBeOnTheScreen();
    expect(screen.getByText("546,82")).toBeOnTheScreen();
  });

  test("shows one bar per category with its own amount", async () => {
    await render(<CategoriesCard />);

    expect(screen.getByText("CIVIC")).toBeOnTheScreen();
    expect(screen.getByText("246,82")).toBeOnTheScreen();
    expect(screen.getByText("Sorties, events")).toBeOnTheScreen();
    expect(screen.getByText("Vêtements")).toBeOnTheScreen();
  });

  test("expands a category from its arrow", async () => {
    const user = userEvent.setup();
    await render(<CategoriesCard />);

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
    await render(<CategoriesCard onManageExpenses={onManageExpenses} />);

    await user.press(
      screen.getByRole("button", { name: "Afficher les dépenses de Sorties, events" }),
    );
    await user.press(screen.getAllByText("Gérer les dépenses")[1]);

    expect(onManageExpenses).toHaveBeenCalledWith({ id: 2, name: "Sorties, events" });
  });
});
