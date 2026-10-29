import { ReactNode, useMemo } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

import { colors, fonts } from "@/constants/theme";
import { scaled, useScale } from "@/hooks/useScale";

type TabCardProps = {
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
      borderTopLeftRadius: s(6),
      borderTopRightRadius: s(6),
    },
    tabLabel: {
      color: colors.card,
      fontFamily: fonts.title,
      fontSize: s(14),
    },
    card: {
      backgroundColor: colors.card,
      borderTopRightRadius: s(6),
      borderBottomLeftRadius: s(6),
      borderBottomRightRadius: s(6),
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
      borderTopRightRadius: s(6),
    },
  });
}

export function TabCard({ title, color = colors.accent, children, style }: TabCardProps) {
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
