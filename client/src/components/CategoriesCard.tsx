import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { CategoryBar } from "@/components/CategoryBar";
import { BinderCard } from "@/components/BinderCard";
import { fonts, Palette, useColors } from "@/constants/theme";
import { scaled, useScale } from "@/hooks/useScale";
import { CategoryRow } from "@/types/categories";
import { categoryAmount, formatAmount, totalAmount, categoryRatio } from "@/utils/amount";

type CategoriesCardProps = {
  color?: string;
  onManageExpenses?: (category: { id: number; name: string }) => void;
};

// Mock data ---------- //
const categoryRows: CategoryRow[] = [
  {
    id: 1,
    name: "CIVIC",
    expenses: [
      { id: 1, label: "Assurance voiture", amount: 68.94 },
      { id: 2, label: "Assurance voiture", amount: 88.94 },
      { id: 3, label: "Assurance voiture", amount: 88.94 },
    ],
  },
  {
    id: 2,
    name: "Sorties, events",
    expenses: [{ id: 1, label: "Concert", amount: 200 }],
  },
  {
    id: 3,
    name: "Vêtements",
    expenses: [{ id: 1, label: "Veste", amount: 100 }],
  },
];
// ------------------- //

function createStyles(scale: number, colors: Palette) {
  const s = (value: number) => scaled(value, scale);

  return StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: s(4),
      paddingBottom: s(8),
    },
    count: {
      color: colors.text,
      fontFamily: fonts.monoSemiBold,
      fontSize: s(12),
    },
    total: {
      color: colors.text,
      fontFamily: fonts.monoSemiBold,
      fontSize: s(18),
    },
    divider: {
      marginHorizontal: s(4),
      borderTopWidth: StyleSheet.hairlineWidth,
      borderStyle: "dotted",
      borderColor: colors.text,
    },
    list: {
      marginTop: s(10),
      gap: s(8),
    },
  });
}

export function CategoriesCard({ color, onManageExpenses }: CategoriesCardProps) {
  const scale = useScale();
  const colors = useColors();
  const styles = useMemo(() => createStyles(scale, colors), [scale, colors]);
  const cardColor = color ?? colors.categories;
  const total = totalAmount(categoryRows);
  return (
    <BinderCard title="Catégories" color={cardColor}>
      <View style={styles.header}>
        <Text style={styles.count}>
          {categoryRows.length} {categoryRows.length > 1 ? "catégories" : "catégorie"}
        </Text>
        <Text style={styles.total}>{formatAmount(total)}</Text>
      </View>
      <View style={styles.list}>
        {categoryRows.map((categoryRow) => (
          <CategoryBar
            key={categoryRow.id}
            name={categoryRow.name}
            amount={formatAmount(categoryAmount(categoryRow))}
            ratio={categoryRatio(categoryRow, total)}
            expenses={categoryRow.expenses}
            onManageExpenses={() => onManageExpenses?.({ id: categoryRow.id, name: categoryRow.name })}
            color={cardColor}
          />
        ))}
      </View>
    </BinderCard>
  );
}
