import { Image, ImageSource } from "expo-image";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { MonthSwitcher } from "@/components/MonthSwitcher";
import { BinderCard } from "@/components/BinderCard";
import { fonts, Palette, useColors } from "@/constants/theme";
import { scaled, useScale } from "@/hooks/useScale";

type HeaderProps = {
  userName: string;
  avatar?: ImageSource;
  month: number;
  year: number;
  remaining: string;
  savings: string;
  expenses: string;
  onPreviousMonth?: () => void;
  onNextMonth?: () => void;
};

function createStyles(scale: number, colors: Palette) {
  const s = (value: number) => scaled(value, scale);

  return StyleSheet.create({
    wrapper: {
      width: "100%",
      maxWidth: 560,
      gap: s(24),
    },
    top: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    greeting: {
      marginTop: s(8),
      color: colors.text,
      fontFamily: fonts.titleRegular,
      fontSize: s(17),
      lineHeight: s(24),
    },
    name: {
      fontFamily: fonts.title,
    },
    avatar: {
      marginTop: s(10),
      width: s(52),
      height: s(52),
      borderRadius: s(9),
      backgroundColor: colors.categories,
    },
    card: {
      marginTop: s(40),
    },
    summary: {
      paddingHorizontal: s(4),
    },
    mainRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: s(12),
    },
    mainLabel: {
      color: colors.income,
      fontFamily: fonts.monoRegular,
      fontSize: s(12),
    },
    mainAmount: {
      color: colors.income,
      fontFamily: fonts.monoBold,
      fontSize: s(17),
    },
    divider: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderStyle: "dotted",
      borderColor: colors.secondaryText,
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingTop: s(14),
    },
    detail: {
      fontFamily: fonts.monoRegular,
      fontSize: s(12),
    },
  });
}

export function Header({
  userName,
  avatar,
  month,
  year,
  remaining,
  savings,
  expenses,
  onPreviousMonth,
  onNextMonth,
}: HeaderProps) {
  const scale = useScale();
  const colors = useColors();
  const styles = useMemo(() => createStyles(scale, colors), [scale, colors]);

  return (
    <View style={styles.wrapper}>
      <View>
        <View style={styles.top} pointerEvents="none">
          <Text style={styles.greeting}>
            Bonjour, <Text style={styles.name}>{userName} !</Text>
          </Text>
          <Image
            source={avatar}
            style={styles.avatar}
            contentFit="cover"
            accessibilityLabel={`Avatar de ${userName}`}
          />
        </View>
        <BinderCard title="Résumé du mois" color={colors.text} style={styles.card}>
          <View style={styles.summary}>
            <View style={styles.mainRow}>
              <Text style={styles.mainLabel}>Reste à vivre</Text>
              <Text style={styles.mainAmount}>{remaining}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={[styles.detail, { color: colors.savings }]}>
                Economies
              </Text>
              <Text style={[styles.detail, { color: colors.savings }]}>
                {savings}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detail, { color: colors.mandatory }]}>
                Dépenses
              </Text>
              <Text style={[styles.detail, { color: colors.mandatory }]}>
                {expenses}
              </Text>
            </View>
          </View>
        </BinderCard>
      </View>
      <MonthSwitcher
        month={month}
        year={year}
        onPrevious={onPreviousMonth}
        onNext={onNextMonth}
      />
    </View>
  );
}
