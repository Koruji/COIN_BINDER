import { render, screen, userEvent } from "@testing-library/react-native";

import { CategoryBar } from "@/components/CategoryBar";
import { ExpenseRow } from "@/types/expenses";

const expenses: ExpenseRow[] = [
  { id: 1, label: "Assurance", amount: 68.9, month: "2026-10-01T00:00:00Z" },
  { id: 2, label: "Entretien", amount: 120, month: "2026-10-01T00:00:00Z" },
];

describe("[integration] CategoryBar + formatAmount", () => {
  test("shows the name, the amount and the formatted expenses", async () => {
    await render(
      <CategoryBar name="CIVIC" amount="188,90" ratio={0.4} expenses={expenses} />,
    );

    expect(screen.getByText("CIVIC")).toBeOnTheScreen();
    expect(screen.getByText("188,90")).toBeOnTheScreen();
    expect(screen.getByText("Assurance")).toBeOnTheScreen();
    expect(screen.getByText("68,90")).toBeOnTheScreen();
    expect(screen.getByText("120,00")).toBeOnTheScreen();
  });

  test("toggles the expenses drawer with the arrow", async () => {
    const user = userEvent.setup();
    await render(
      <CategoryBar name="CIVIC" amount="188,90" ratio={0.4} expenses={expenses} />,
    );

    const show = screen.getByRole("button", { name: "Afficher les dépenses de CIVIC" });
    expect(show).toBeCollapsed();

    await user.press(show);

    const hide = screen.getByRole("button", { name: "Masquer les dépenses de CIVIC" });
    expect(hide).toBeExpanded();
  });

  test("calls onManageExpenses when pressing the manage button", async () => {
    const user = userEvent.setup();
    const onManageExpenses = jest.fn();
    await render(
      <CategoryBar
        name="CIVIC"
        amount="188,90"
        ratio={0.4}
        expenses={expenses}
        onManageExpenses={onManageExpenses}
      />,
    );

    // The drawer ignores touches while it is collapsed: open it first.
    await user.press(
      screen.getByRole("button", { name: "Afficher les dépenses de CIVIC" }),
    );
    await user.press(screen.getByText("Gérer les dépenses"));

    expect(onManageExpenses).toHaveBeenCalledTimes(1);
  });
});
