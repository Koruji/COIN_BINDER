import { ReactNode, useMemo } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

import { colors, fonts, radii } from "@/constants/theme";
import { scaled, useScale } from "@/hooks/useScale";

type BinderCardProps = {
  title: string;
  color?: string;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

function createStyles(scale: number, color: string) {
  const s = (value: number) => scaled(value, scale);

  return StyleSheet.create({
    wrapper: {
      width: "100%",
      maxWidth: 560,
    },
    tab: {
      alignSelf: "flex-start",
      minWidth: "28%",
      height: s(26),
      paddingHorizontal: s(16),
      justifyContent: "center",
      backgroundColor: color,
      borderTopLeftRadius: s(radii.large),
      borderTopRightRadius: s(radii.large),
    },
    tabLabel: {
      color: colors.card,
      fontFamily: fonts.title,
      fontSize: s(14),
    },
    card: {
      backgroundColor: colors.card,
      borderTopRightRadius: s(radii.large),
      borderBottomLeftRadius: s(radii.large),
      borderBottomRightRadius: s(radii.large),
      paddingTop: s(14),
      paddingBottom: s(18),
      paddingHorizontal: s(10),
    },
    joint: {
      position: "absolute",
      top: -1,
      left: 0,
      right: 0,
      height: s(5),
      backgroundColor: color,
      borderTopRightRadius: s(radii.large),
    },
  });
}

export function BinderCard({ title, color = colors.accent, children, style }: BinderCardProps) {
  const scale = useScale();
  const styles = useMemo(() => createStyles(scale, color), [scale, color]);

  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.tab}>
        <Text style={styles.tabLabel}>{title}</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.joint} />
        {children}
      </View>
    </View>
  );
}
