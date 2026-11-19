export type Palette = {
  background: string;
  card: string;
  secondaryText: string;
  border: string;
  text: string;
  onColor: string;
  coin: string;
  savings: string;
  mandatory: string;
  categories: string;
  income: string;
  refunds: string;
};

export const darkColors: Palette = {
  background: "#2E2618",
  card: "#3A3122",
  secondaryText: "#A3947A",
  border: "#C9B89B",
  text: "#F4EFE3",
  onColor: "#2E2618",
  coin: "#E0B04F",
  savings: "#E0B04F",
  mandatory: "#E0786C",
  categories: "#D98A6A",
  income: "#8DB5A0",
  refunds: "#6F9A87",
};

export const lightColors: Palette = {
  background: "#F4EFE3",
  card: "#FBF7EC",
  secondaryText: "#5E5343",
  border: "#C9B89B",
  text: "#2E2618",
  onColor: "#FBF7EC",
  coin: "#7A5510",
  savings: "#E0B04F",
  mandatory: "#A8443B",
  categories: "#A24F30",
  income: "#2F5F4B",
  refunds: "#8DB5A0",
};

export const DEFAULT_SCHEME: "light" | "dark" = "light";

export function useColors(): Palette {
  return DEFAULT_SCHEME === "dark" ? darkColors : lightColors;
}

export const fonts = {
  monoRegular: "IBMPlexMono_400Regular",
  monoSemiBold: "IBMPlexMono_600SemiBold",
  monoBold: "IBMPlexMono_700Bold",
  title: "SpaceGrotesk_700Bold",
  titleRegular: "SpaceGrotesk_400Regular",
};
