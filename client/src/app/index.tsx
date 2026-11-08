import { BlurTargetView } from "expo-blur";
import { ComponentRef, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BinderDialog } from "@/components/BinderDialog";
import { CategoriesCard } from "@/components/CategoriesCard";
import { colors } from "@/constants/theme";

export default function Index() {
  const insets = useSafeAreaInsets();
  const blurTarget = useRef<ComponentRef<typeof View>>(null);
  const [dialogCategory, setDialogCategory] = useState<string | null>(null);

  return (
    <View style={styles.root}>
      <BlurTargetView ref={blurTarget} style={styles.root}>
        <ScrollView
          style={styles.screen}
          contentContainerStyle={[
            styles.content,
            { paddingTop: insets.top + 48, paddingBottom: insets.bottom + 24 },
          ]}
        >
          <CategoriesCard onManageExpenses={(category) => setDialogCategory(category.name)} />
        </ScrollView>
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
    backgroundColor: colors.background,
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 14,
  },
});
