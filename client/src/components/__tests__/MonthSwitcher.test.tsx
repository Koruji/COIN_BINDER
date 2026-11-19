import { render, screen, userEvent } from "@testing-library/react-native";

import { MonthSwitcher } from "../MonthSwitcher";

describe("MonthSwitcher", () => {
  test("call onNext", async() => {
    const user = userEvent.setup();
    const onNext = jest.fn();
    const onPrevious = jest.fn();
    await render(<MonthSwitcher month={9} year={2026} onNext={onNext} onPrevious={onPrevious}/>);

    await user.press(screen.getByRole("button", { name: "Next month" }));

    expect(onNext).toHaveBeenCalledTimes(1);
    expect(onPrevious).not.toHaveBeenCalled();
  });

  test("call onPrevious", async() => {
    const user = userEvent.setup();
    const onNext = jest.fn();
    const onPrevious = jest.fn();
    await render(<MonthSwitcher month={9} year={2026} onNext={onNext} onPrevious={onPrevious}/>);

    await user.press(screen.getByRole("button", { name: "Previous month" }));

    expect(onPrevious).toHaveBeenCalledTimes(1);
    expect(onNext).not.toHaveBeenCalled();
  });

  test("display month and year", async() => {
    await render(<MonthSwitcher month={9} year={2026} />);

    expect(screen.getByLabelText("OCT")).toBeOnTheScreen();
    expect(screen.getByLabelText("2026")).toBeOnTheScreen();
  });

  test.each([
    [0, "JAN"],
    [1, "FEB"],
    [8, "SEP"],
    [11, "DEC"]
  ])
  ("month %i display %s", async (month, expected) => {
    await render(<MonthSwitcher month={month} year={2026} />);

    expect(screen.getByLabelText(expected)).toBeOnTheScreen();
  })
});
