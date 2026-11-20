import { render, screen, userEvent } from "@testing-library/react-native";
import { useState } from "react";

import { MonthSwitcher } from "@/components/MonthSwitcher";
import { shiftMonth } from "@/utils/shiftMonth";

// MonthSwitcher + shiftMonth, branchés comme dans l'écran.
function Switcher({ initial }: { initial: { month: number; year: number } }) {
  const [period, setPeriod] = useState(initial);

  return (
    <MonthSwitcher
      month={period.month}
      year={period.year}
      onPrevious={() => setPeriod(shiftMonth(period, -1))}
      onNext={() => setPeriod(shiftMonth(period, 1))}
    />
  );
}

describe("[integration] MonthSwitcher + shiftMonth", () => {
  test("moves to the next month", async () => {
    const user = userEvent.setup();
    await render(<Switcher initial={{ month: 9, year: 2026 }} />);

    await user.press(screen.getByRole("button", { name: "Next month" }));

    expect(screen.getByLabelText("NOV")).toBeOnTheScreen();
    expect(screen.getByLabelText("2026")).toBeOnTheScreen();
  });

  test("moves to the previous month", async () => {
    const user = userEvent.setup();
    await render(<Switcher initial={{ month: 9, year: 2026 }} />);

    await user.press(screen.getByRole("button", { name: "Previous month" }));

    expect(screen.getByLabelText("SEP")).toBeOnTheScreen();
  });

  test("goes from DEC to JAN and increments the year", async () => {
    const user = userEvent.setup();
    await render(<Switcher initial={{ month: 11, year: 2026 }} />);

    await user.press(screen.getByRole("button", { name: "Next month" }));

    expect(screen.getByLabelText("JAN")).toBeOnTheScreen();
    expect(screen.getByLabelText("2027")).toBeOnTheScreen();
  });

  test("goes from JAN to DEC and decrements the year", async () => {
    const user = userEvent.setup();
    await render(<Switcher initial={{ month: 0, year: 2026 }} />);

    await user.press(screen.getByRole("button", { name: "Previous month" }));

    expect(screen.getByLabelText("DEC")).toBeOnTheScreen();
    expect(screen.getByLabelText("2025")).toBeOnTheScreen();
  });
});
