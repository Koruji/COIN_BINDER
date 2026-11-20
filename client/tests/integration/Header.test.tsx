import { render, screen, userEvent } from "@testing-library/react-native";
import { useState } from "react";

import { Header } from "@/components/Header";
import { shiftMonth } from "@/utils/shiftMonth";

function HeaderWithPeriod() {
  const [period, setPeriod] = useState({ month: 9, year: 2026 });

  return (
    <Header
      userName="Koruji"
      month={period.month}
      year={period.year}
      remaining="1040,61"
      savings="100,00"
      expenses="1319,39"
      onPreviousMonth={() => setPeriod(shiftMonth(period, -1))}
      onNextMonth={() => setPeriod(shiftMonth(period, 1))}
    />
  );
}

describe("[integration] Header", () => {
  test("shows the summary card with the user's amounts", async () => {
    await render(<HeaderWithPeriod />);

    expect(screen.getByText("Résumé du mois")).toBeOnTheScreen();
    expect(screen.getByText("Koruji !")).toBeOnTheScreen();
    expect(screen.getByText("1040,61")).toBeOnTheScreen();
    expect(screen.getByText("100,00")).toBeOnTheScreen();
    expect(screen.getByText("1319,39")).toBeOnTheScreen();
  });

  test("changes the displayed month when pressing the arrows", async () => {
    const user = userEvent.setup();
    await render(<HeaderWithPeriod />);

    await user.press(screen.getByRole("button", { name: "Next month" }));
    expect(screen.getByLabelText("NOV")).toBeOnTheScreen();

    await user.press(screen.getByRole("button", { name: "Previous month" }));
    await user.press(screen.getByRole("button", { name: "Previous month" }));
    expect(screen.getByLabelText("SEP")).toBeOnTheScreen();
  });
});
