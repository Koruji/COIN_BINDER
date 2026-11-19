import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { CategoryBar } from "@/components/CategoryBar";
import { TabCard } from "@/components/TabCard";
import { fonts, Palette, useColors } from "@/constants/theme";
import { scaled, useScale } from "@/hooks/useScale";

type CategoryRow = {
  id: string;
  name: string;
  amount: string;
  ratio: number;
};

type CategoriesCardProps = {
  color?: string;
};

const rows: CategoryRow[] = [
  { id: "1", name: "CIVIC", amount: "150, 00", ratio: 63 / 195 },
  { id: "2", name: "Sorties, events", amount: "200, 00", ratio: 94 / 195 },
  { id: "3", name: "Vêtements", amount: "100, 00", ratio: 28 / 195 },
];

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

export function CategoriesCard({ color }: CategoriesCardProps) {
  const scale = useScale();
  const colors = useColors();
  const styles = useMemo(() => createStyles(scale, colors), [scale, colors]);
  const cardColor = color ?? colors.categories;

  return (
    <TabCard title="Catégories" color={cardColor}>
      <View style={styles.header}>
        <Text style={styles.count}>3 catégories</Text>
        <Text style={styles.total}>450, 00</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.list}>
        {rows.map((row) => (
          <CategoryBar
            key={row.id}
            name={row.name}
            amount={row.amount}
            ratio={row.ratio}
            color={cardColor}
          />
        ))}
      </View>
    </TabCard>
  );
}
