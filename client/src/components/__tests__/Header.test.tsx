import { render, screen, userEvent } from "@testing-library/react-native";

import { Header } from "../Header";

const defaultProps = {
  userName: "Koruji",
  month: 9,
  year: 2026,
  remaining: "1040, 61",
  savings: "100, 00",
  expenses: "1319, 39",
};

describe("Header", () => {
  test("displays the user name and the amounts", async () => {
    await render(<Header {...defaultProps} />);

    expect(screen.getByText("Koruji !")).toBeOnTheScreen();
    expect(screen.getByText("1040, 61")).toBeOnTheScreen();
    expect(screen.getByText("100, 00")).toBeOnTheScreen();
    expect(screen.getByText("1319, 39")).toBeOnTheScreen();
  });

  test("displays the selected month and year", async () => {
    await render(<Header {...defaultProps} />);

    expect(screen.getByLabelText("OCT")).toBeOnTheScreen();
    expect(screen.getByLabelText("2026")).toBeOnTheScreen();
  });

  test("calls onNextMonth when pressing the next arrow", async () => {
    const user = userEvent.setup();
    const onNextMonth = jest.fn();
    const onPreviousMonth = jest.fn();
    await render(
      <Header
        {...defaultProps}
        onNextMonth={onNextMonth}
        onPreviousMonth={onPreviousMonth}
      />,
    );

    await user.press(screen.getByRole("button", { name: "Next month" }));

    expect(onNextMonth).toHaveBeenCalledTimes(1);
    expect(onPreviousMonth).not.toHaveBeenCalled();
  });

  test("calls onPreviousMonth when pressing the previous arrow", async () => {
    const user = userEvent.setup();
    const onNextMonth = jest.fn();
    const onPreviousMonth = jest.fn();
    await render(
      <Header
        {...defaultProps}
        onNextMonth={onNextMonth}
        onPreviousMonth={onPreviousMonth}
      />,
    );

    await user.press(screen.getByRole("button", { name: "Previous month" }));

    expect(onPreviousMonth).toHaveBeenCalledTimes(1);
    expect(onNextMonth).not.toHaveBeenCalled();
  });
});
