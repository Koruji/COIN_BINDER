function toRgb(hex: string) {
  const value = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16));
}

export function blend(foreground: string, background: string, ratio: number) {
  const fg = toRgb(foreground);
  const bg = toRgb(background);
  const mixed = fg.map((channel, i) =>
    Math.round(channel * ratio + bg[i] * (1 - ratio)),
  );
  return `#${mixed.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}
