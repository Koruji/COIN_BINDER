import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { CategoryBar } from "@/components/CategoryBar";
import { BinderCard } from "@/components/BinderCard";
import { fonts, Palette, useColors } from "@/constants/theme";
import { scaled, useScale } from "@/hooks/useScale";
import { CategoryRow } from "@/types/categories";
import { categoryAmount, formatAmount, totalAmount, categoryRatio } from "@/utils/amount";

type CategoriesCardProps = {
  categories: CategoryRow[];
  color?: string;
  onManageExpenses?: (category: { id: number; name: string }) => void;
};

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

export function CategoriesCard({ categories, color, onManageExpenses }: CategoriesCardProps) {
  const scale = useScale();
  const colors = useColors();
  const styles = useMemo(() => createStyles(scale, colors), [scale, colors]);
  const cardColor = color ?? colors.categories;
  const total = totalAmount(categories);
  return (
    <BinderCard title="Catégories" color={cardColor}>
      <View style={styles.header}>
        <Text style={styles.count}>
          {categories.length} {categories.length > 1 ? "catégories" : "catégorie"}
        </Text>
        <Text style={styles.total}>{formatAmount(total)}</Text>
      </View>
      <View style={styles.list}>
        {categories.map((category) => (
          <CategoryBar
            key={category.id}
            name={category.name}
            amount={formatAmount(categoryAmount(category))}
            ratio={categoryRatio(category, total)}
            expenses={category.expenses}
            onManageExpenses={() => onManageExpenses?.({ id: category.id, name: category.name })}
            color={cardColor}
          />
        ))}
      </View>
    </BinderCard>
  );
}
