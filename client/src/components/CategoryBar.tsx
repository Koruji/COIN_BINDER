import { Image } from "expo-image";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, fonts } from "@/constants/theme";
import { scaled, useScale } from "@/hooks/useScale";
import { blend } from "@/utils/color";

type CategoryBarProps = {
  name: string;
  amount: string;
  ratio: number;
  color?: string;
};

const arrowDown = require("../../assets/images/arrow-drop-down.svg");

function createStyles(scale: number, color: string) {
  const s = (value: number) => scaled(value, scale);

  return StyleSheet.create({
    row: {
      minHeight: s(40),
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: s(8),
      paddingLeft: s(10),
      paddingRight: s(6),
      backgroundColor: blend(color, colors.card, 0.5),
      borderRadius: s(3),
    },
    name: {
      flex: 5,
      color: colors.text,
      fontFamily: fonts.monoBold,
      fontSize: s(12),
    },
    track: {
      flex: 6,
      height: s(8),
      marginHorizontal: s(8),
      backgroundColor: colors.card,
      borderRadius: s(2),
      overflow: "hidden",
    },
    fill: {
      height: "100%",
      backgroundColor: color,
      borderRadius: s(2),
    },
    amount: {
      flex: 3,
      textAlign: "right",
      color: colors.text,
      fontFamily: fonts.monoRegular,
      fontSize: s(12),
    },
    arrow: {
      width: s(16),
      height: s(16),
      marginLeft: s(4),
    },
  });
}

export function CategoryBar({ name, amount, ratio, color = colors.accent }: CategoryBarProps) {
  const scale = useScale();
  const styles = useMemo(() => createStyles(scale, color), [scale, color]);
  const progress = Math.min(Math.max(ratio, 0), 1);

  return (
    <View style={styles.row}>
      <Text style={styles.name} numberOfLines={2}>
        {name}
      </Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={styles.amount} numberOfLines={1} adjustsFontSizeToFit>
        {amount}
      </Text>
      <Image source={arrowDown} tintColor={color} style={styles.arrow} />
    </View>
  );
}
