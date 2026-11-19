import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { CategoryBar } from "@/components/CategoryBar";
import { BinderCard } from "@/components/BinderCard";
import { fonts, Palette, useColors } from "@/constants/theme";
import { scaled, useScale } from "@/hooks/useScale";

type ExpenseRow = {
  id: string;
  label: string;
  amount: number;
};

type CategoryRow = {
  id: string;
  name: string;
  expenses: ExpenseRow[];
};

type CategoriesCardProps = {
  color?: string;
  onManageExpenses?: (category: { id: string; name: string }) => void;
};

const rows: CategoryRow[] = [
  {
    id: "1",
    name: "CIVIC",
    expenses: [
      { id: "1", label: "Assurance voiture", amount: 68.94 },
      { id: "2", label: "Assurance voiture", amount: 88.94 },
      { id: "3", label: "Assurance voiture", amount: 88.94 },
    ],
  },
  {
    id: "2",
    name: "Sorties, events",
    expenses: [{ id: "1", label: "Concert", amount: 200 }],
  },
  {
    id: "3",
    name: "Vêtements",
    expenses: [{ id: "1", label: "Veste", amount: 100 }],
  },
];

function formatAmount(value: number) {
  return value.toFixed(2).replace(".", ", ");
}

function categoryAmount(row: CategoryRow) {
  return row.expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

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
  const total = rows.reduce((sum, row) => sum + categoryAmount(row), 0);

  return (
    <BinderCard title="Catégories" color={cardColor}>
      <View style={styles.header}>
        <Text style={styles.count}>
          {rows.length} {rows.length > 1 ? "catégories" : "catégorie"}
        </Text>
        <Text style={styles.total}>{formatAmount(total)}</Text>
      </View>
      <View style={styles.list}>
        {rows.map((row) => (
          <CategoryBar
            key={row.id}
            name={row.name}
            amount={formatAmount(categoryAmount(row))}
            ratio={total > 0 ? categoryAmount(row) / total : 0}
            expenses={row.expenses.map((e) => ({
              id: e.id,
              label: e.label,
              amount: formatAmount(e.amount),
            }))}
            onManageExpenses={() => onManageExpenses?.({ id: row.id, name: row.name })}
            color={cardColor}
          />
        ))}
      </View>
    </BinderCard>
  );
}
