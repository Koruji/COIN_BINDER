import { StyleSheet, View } from "react-native";

import { CategoriesCard } from "@/components/CategoriesCard";
import { colors } from "@/constants/theme";

export default function Index() {
  return (
    <View style={styles.screen}>
      <View style={styles.spaceTop} />
      <CategoriesCard />
      <View style={styles.spaceBottom} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    paddingHorizontal: 14,
  },
  spaceTop: {
    flex: 1,
  },
  spaceBottom: {
    flex: 3,
  },
});
