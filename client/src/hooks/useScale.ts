import { useWindowDimensions } from "react-native";

const BASE_WIDTH = 390;

export function useScale() {
  const { width } = useWindowDimensions();
  return Math.min(Math.max(width / BASE_WIDTH, 0.85), 1.4);
}

export function scaled(value: number, scale: number) {
  return Math.round(value * scale * 100) / 100;
}
