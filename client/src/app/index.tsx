import { BlurTargetView } from "expo-blur";
import { ComponentRef, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BinderDialog } from "@/components/BinderDialog";
import { CategoriesCard } from "@/components/CategoriesCard";
import { Header } from "@/components/Header";
import { fonts, useColors } from "@/constants/theme";
import { useCategories } from "@/hooks/useCategories";
import { scaled, useScale } from "@/hooks/useScale";
import { formatAmount, totalAmount } from "@/utils/amount";
import { filterByPeriod } from "@/utils/period";
import { shiftMonth } from "@/utils/shiftMonth";

export default function Index() {
  const colors = useColors();
  const scale = useScale();
  const insets = useSafeAreaInsets();
  const blurTarget = useRef<ComponentRef<typeof View>>(null);
  const [dialogCategory, setDialogCategory] = useState<string | null>(null);
  const [period, setPeriod] = useState({ month: 9, year: 2026 });
  const { categories, loading, error, reload } = useCategories();
  const periodCategories = useMemo(() => filterByPeriod(categories, period), [categories, period]);

  return (
    <View style={styles.root}>
      <BlurTargetView ref={blurTarget} style={styles.root}>
        <View style={[styles.screen, { backgroundColor: colors.background }]}>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={[
                styles.headerBand,
                {
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
                expenses={formatAmount(totalAmount(periodCategories))}
                onPreviousMonth={() => setPeriod(shiftMonth(period, -1))}
                onNextMonth={() => setPeriod(shiftMonth(period, 1))}
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
              {error ? (
                <View style={styles.feedback}>
                  <Text style={[styles.feedbackText, { color: colors.text }]}>{error}</Text>
                  <Pressable accessibilityRole="button" onPress={reload}>
                    <Text style={[styles.retry, { color: colors.text }]}>Réessayer</Text>
                  </Pressable>
                </View>
              ) : loading && categories.length === 0 ? (
                <ActivityIndicator color={colors.text} />
              ) : (
                <CategoriesCard
                  categories={periodCategories}
                  onManageExpenses={(category) => setDialogCategory(category.name)}
                />
              )}
            </View>
          </ScrollView>
        </View>
      </BlurTargetView>

      <BinderDialog
        visible={dialogCategory !== null}
        onClose={() => setDialogCategory(null)}
        title={dialogCategory ?? ""}
        blurTarget={blurTarget}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
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
  feedback: {
    alignItems: "center",
    gap: 12,
  },
  feedbackText: {
    fontFamily: fonts.monoRegular,
    fontSize: 14,
    textAlign: "center",
  },
  retry: {
    fontFamily: fonts.monoSemiBold,
    fontSize: 14,
    textDecorationLine: "underline",
  },
  body: {
    flex: 1,
    alignItems: "center",
    paddingTop: 24,
  },
});
