import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { BinderCard } from "@/components/BinderCard";

describe("[integration] BinderCard", () => {
  test("shows its title and renders its children inside", async () => {
    await render(
      <BinderCard title="Catégories">
        <Text>Contenu</Text>
        <Text>Autre contenu</Text>
      </BinderCard>,
    );

    expect(screen.getByText("Catégories")).toBeOnTheScreen();
    expect(screen.getByText("Contenu")).toBeOnTheScreen();
    expect(screen.getByText("Autre contenu")).toBeOnTheScreen();
  });

  test("uses the given color for the tab", async () => {
    await render(<BinderCard title="Résumé" color="#ff0000" />);

    expect(screen.getByText("Résumé").parent).toHaveStyle({
      backgroundColor: "#ff0000",
    });
  });
});
