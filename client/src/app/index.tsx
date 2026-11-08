import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CategoriesCard } from "@/components/CategoriesCard";
import { colors } from "@/constants/theme";

export default function Index() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
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
