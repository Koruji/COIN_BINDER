import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CategoriesCard } from "@/components/CategoriesCard";
import { Header } from "@/components/Header";
import { useColors } from "@/constants/theme";
import { scaled, useScale } from "@/hooks/useScale";
import { shiftMonth } from "@/utils/shiftMonth";

export default function Index() {
  const colors = useColors();
  const scale = useScale();
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useState({ month: 9, year: 2026 });

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.headerBand,
            {
              backgroundColor: colors.background,
              paddingTop: insets.top + scaled(10, scale),
              paddingBottom: scaled(14, scale),
              paddingLeft: insets.left + 14,
              paddingRight: insets.right + 14,
            },
          ]}
        >
          <Header
            userName="Koruji"
            month={period.month}
            year={period.year}
            remaining="1040, 61"
            savings="100, 00"
            expenses="1319, 39"
            onPreviousMonth={() => shiftMonth(period, -1)}
            onNextMonth={() => shiftMonth(period, 1)}
          />
        </View>
        <View
          style={[
            styles.body,
            {
              paddingLeft: insets.left + 14,
              paddingRight: insets.right + 14,
              paddingBottom: insets.bottom + 24,
            },
          ]}
        >
          <CategoriesCard />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  headerBand: {
    width: "100%",
    alignItems: "center",
  },
  body: {
    flex: 1,
    alignItems: "center",
    paddingTop: 24,
  },
});
