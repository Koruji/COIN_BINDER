import { useMemo } from "react";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { fonts, Palette, useColors } from "@/constants/theme";
import { scaled, useScale } from "@/hooks/useScale";

type MonthSwitcherProps = {
  month: number;
  year: number;
  onPrevious?: () => void;
  onNext?: () => void;
};

const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

const MAX_WIDTH = 560;
const SIDE_PADDING = 14;
const TILE_COUNT = 7;

function createStyles(scale: number, colors: Palette, availableWidth: number) {
  const s = (value: number) => scaled(value, scale);
  const gap = s(4);
  const arrow = s(10) + s(16);
  const fixed = 2 * arrow + 3 * s(14) + 5 * gap;
  const tileWidth = Math.min(s(26), (availableWidth - fixed) / TILE_COUNT);
  const ratio = tileWidth / s(26);

  return StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: s(14),
    },
    group: {
      flexDirection: "row",
      gap: s(4),
    },
    groupGap: {
      width: s(6),
    },
    tile: {
      width: tileWidth,
      height: s(36) * ratio,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.card,
      borderRadius: s(3),
      shadowColor: colors.text,
      shadowOpacity: 0.35,
      shadowOffset: { width: 0, height: s(3) },
      shadowRadius: s(2),
      elevation: 3,
    },
    glyph: {
      color: colors.text,
      fontFamily: fonts.monoRegular,
      fontSize: s(24) * ratio,
      lineHeight: s(30) * ratio,
      includeFontPadding: false,
    },
    fold: {
      position: "absolute",
      left: 0,
      right: 0,
      top: "50%",
      height: StyleSheet.hairlineWidth * 2,
      backgroundColor: colors.border,
    },
    arrowHit: {
      padding: s(8),
    },
    arrowLeft: {
      borderTopWidth: s(6),
      borderBottomWidth: s(6),
      borderRightWidth: s(10),
      borderTopColor: "transparent",
      borderBottomColor: "transparent",
      borderRightColor: colors.text,
    },
    arrowRight: {
      borderTopWidth: s(6),
      borderBottomWidth: s(6),
      borderLeftWidth: s(10),
      borderTopColor: "transparent",
      borderBottomColor: "transparent",
      borderLeftColor: colors.text,
    },
  });
}

export function MonthSwitcher({
  month,
  year,
  onPrevious,
  onNext,
}: MonthSwitcherProps) {
  const scale = useScale();
  const colors = useColors();
  const { width } = useWindowDimensions();
  const availableWidth = Math.min(width - 2 * SIDE_PADDING, MAX_WIDTH);
  const styles = useMemo(
    () => createStyles(scale, colors, availableWidth),
    [scale, colors, availableWidth],
  );

  const label = MONTHS[((month % 12) + 12) % 12];
  const renderTiles = (text: string) =>
    text.split("").map((char, index) => (
      <View key={`${char}-${index}`} style={styles.tile}>
        <Text style={styles.glyph}>{char}</Text>
        <View style={styles.fold} />
      </View>
    ));

  return (
    <View style={styles.row}>
      <Pressable
        onPress={onPrevious}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Mois précédent"
        style={styles.arrowHit}
      >
        <View style={styles.arrowLeft} />
      </Pressable>
      <View style={styles.group}>{renderTiles(label)}</View>
      <View style={styles.group}>{renderTiles(String(year))}</View>
      <Pressable
        onPress={onNext}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Mois suivant"
        style={styles.arrowHit}
      >
        <View style={styles.arrowRight} />
      </Pressable>
    </View>
  );
}
