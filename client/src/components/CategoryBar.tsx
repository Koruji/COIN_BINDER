import { Image } from "expo-image";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { fonts, Palette, radii, useColors } from "@/constants/theme";
import { scaled, useScale } from "@/hooks/useScale";
import { blend } from "@/utils/color";
import { ExpenseRow } from "@/types/expenses";
import { clamp, formatAmount } from "@/utils/amount";

type CategoryBarProps = {
  name: string;
  amount: string;
  ratio: number;
  expenses?: ExpenseRow[];
  onManageExpenses?: () => void;
  color?: string;
};

const arrowDown = require("../../assets/images/arrow-drop-down.svg");

const DURATION = 280;

function createStyles(scale: number, color: string, colors: Palette) {
  const s = (value: number) => scaled(value, scale);

  return StyleSheet.create({
    container: {
      backgroundColor: blend(color, colors.card, 0.5),
      borderRadius: s(radii.small),
      overflow: "hidden",
    },
    row: {
      minHeight: s(40),
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: s(8),
      paddingLeft: s(10),
      paddingRight: s(6),
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
      borderRadius: s(4),
      overflow: "hidden",
    },
    fill: {
      height: "100%",
      backgroundColor: color,
      borderRadius: s(4),
    },
    amount: {
      flex: 3,
      textAlign: "right",
      color: colors.text,
      fontFamily: fonts.monoRegular,
      fontSize: s(12),
    },
  arrowButton: {
      marginLeft: s(4),
    },
    arrow: {
      width: s(16),
      height: s(16),
    },
    drawer: {
      overflow: "hidden",
    },
    drawerContent: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      paddingLeft: s(10),
      paddingRight: s(26),
      paddingTop: s(4),
      paddingBottom: s(10),
    },
    separator: {
      marginRight: -s(16),
      marginBottom: s(4),
    },
    separatorShade: {
      height: StyleSheet.hairlineWidth * 2,
      backgroundColor: "rgba(46, 38, 24, 0.12)",
    },
    separatorLight: {
      height: StyleSheet.hairlineWidth * 2,
      backgroundColor: "rgba(255, 255, 255, 0.45)",
    },
    expense: {
      flexDirection: "row",
      alignItems: "flex-end",
      paddingVertical: s(5),
    },
    expenseLabel: {
      flexShrink: 1,
      color: colors.text,
      fontFamily: fonts.monoRegular,
      fontSize: s(11),
    },
    leader: {
      flex: 1,
      height: 1,
      overflow: "hidden",
      marginHorizontal: s(6),
      marginBottom: s(4),
    },
    leaderDots: {
      height: 2,
      marginTop: -1,
      borderWidth: 1,
      borderStyle: "dotted",
      borderColor: colors.text,
    },
    expenseAmount: {
      color: colors.text,
      fontFamily: fonts.monoRegular,
      fontSize: s(11),
    },
    manage: {
      alignSelf: "flex-start",
      marginTop: s(6),
      paddingVertical: s(2),
    },
    manageLabel: {
      color,
      fontFamily: fonts.monoBold,
      fontSize: s(11),
    },
  });
}

export function CategoryBar({
  name,
  amount,
  ratio,
  expenses = [],
  onManageExpenses,
  color,
}: CategoryBarProps) {
  const scale = useScale();
  const colors = useColors();
  const barColor = color ?? colors.categories;
  const styles = useMemo(
    () => createStyles(scale, barColor, colors),
    [scale, barColor, colors],
  );
  const progress = clamp(ratio, 0, 1);

  const [expanded, setExpanded] = useState(false);
  const open = useSharedValue(0);
  const contentHeight = useSharedValue(0);

  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    open.set(
      withTiming(next ? 1 : 0, {
        duration: DURATION,
        easing: Easing.out(Easing.cubic),
      }),
    );
  };

  const drawerStyle = useAnimatedStyle(() => ({
    height: contentHeight.value * open.value,
    opacity: open.value,
  }));

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${open.value * 180}deg` }],
  }));

  return (
    <View style={styles.container}>
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
        <Pressable
          onPress={toggle}
          style={styles.arrowButton}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={`${expanded ? "Masquer" : "Afficher"} les dépenses de ${name}`}
          accessibilityState={{ expanded }}
        >
          <Animated.View style={arrowStyle}>
            <Image source={arrowDown} tintColor={barColor} style={styles.arrow} />
          </Animated.View>
        </Pressable>
      </View>

      <Animated.View style={[styles.drawer, drawerStyle]} pointerEvents={expanded ? "auto" : "none"}>
        <View
          style={styles.drawerContent}
          onLayout={(e) => {
            contentHeight.set(e.nativeEvent.layout.height);
          }}
        >
          <View style={styles.separator}>
            <View style={styles.separatorShade} />
            <View style={styles.separatorLight} />
          </View>
          {expenses.map((expense) => (
            <View key={expense.id} style={styles.expense}>
              <Text style={styles.expenseLabel} numberOfLines={1}>
                {expense.label}
              </Text>
              <View style={styles.leader}>
                <View style={styles.leaderDots} />
              </View>
              <Text style={styles.expenseAmount}>{formatAmount(expense.amount)}</Text>
            </View>
          ))}
          <Pressable
            onPress={onManageExpenses}
            style={styles.manage}
            hitSlop={8}
            accessibilityRole="button"
          >
            <Text style={styles.manageLabel}>Gérer les dépenses</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}
