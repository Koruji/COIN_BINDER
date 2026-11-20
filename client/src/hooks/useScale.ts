import { useWindowDimensions } from "react-native";
import { clamp } from "@/utils/amount";

const BASE_WIDTH = 390;

export function useScale() {
  const { width } = useWindowDimensions();
  return clamp(width / BASE_WIDTH, 0.85, 1.4);
}

export function scaled(value: number, scale: number) {
  return Math.round(value * scale * 100) / 100;
}
