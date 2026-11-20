import { render, screen, userEvent } from "@testing-library/react-native";
import { BackHandler, Text } from "react-native";

import { BinderDialog } from "@/components/BinderDialog";

describe("[integration] BinderDialog", () => {
  test("renders nothing when it is not visible", async () => {
    await render(
      <BinderDialog visible={false} onClose={jest.fn()} title="CIVIC">
        <Text>Contenu</Text>
      </BinderDialog>,
    );

    expect(screen.queryByText("CIVIC")).not.toBeOnTheScreen();
    expect(screen.queryByText("Contenu")).not.toBeOnTheScreen();
  });

  test("shows its title and children when visible", async () => {
    await render(
      <BinderDialog visible onClose={jest.fn()} title="CIVIC">
        <Text>Contenu</Text>
      </BinderDialog>,
    );

    expect(screen.getByText("CIVIC")).toBeOnTheScreen();
    expect(screen.getByText("Contenu")).toBeOnTheScreen();
  });

  test("calls onClose when pressing the close button", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    await render(<BinderDialog visible onClose={onClose} title="CIVIC" />);

    await user.press(screen.getByRole("button", { name: "Fermer" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("calls onClose on the hardware back button", async () => {
    const onClose = jest.fn();
    const spy = jest.spyOn(BackHandler, "addEventListener");
    await render(<BinderDialog visible onClose={onClose} title="CIVIC" />);

    const [, handler] = spy.mock.calls[0];
    expect((handler as () => boolean)()).toBe(true);
    expect(onClose).toHaveBeenCalledTimes(1);

    spy.mockRestore();
  });
});
