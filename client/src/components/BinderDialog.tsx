import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { ComponentRef, ReactNode, RefObject, useEffect, useMemo } from "react";
import { BackHandler, Platform, Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { fonts, Palette, radii, useColors } from "@/constants/theme";
import { scaled, useScale } from "@/hooks/useScale";

type BinderDialogProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  color?: string;
  blurTarget?: RefObject<ComponentRef<typeof View> | null>;
  children?: ReactNode;
};

const webBlurStyle = { backdropFilter: "blur(5px)" } as ViewStyle;

const closeIcon = require("../../assets/images/close-circle.svg");

function createStyles(scale: number, color: string, colors: Palette) {
  const s = (value: number) => scaled(value, scale);

  return StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFill,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 14,
    },
    backdrop: {
      ...StyleSheet.absoluteFill,
      backgroundColor: "rgba(46, 38, 24, 0.12)",
    },
    dialog: {
      width: "100%",
      maxWidth: 560,
    },
    tabs: {
      zIndex: 1,
      height: s(36),
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
    },
    closeTab: {
      width: s(42),
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.danger,
      borderTopLeftRadius: s(radii.small),
      borderTopRightRadius: s(radii.small),
    },
    closeIcon: {
      width: s(22),
      height: s(22),
    },
    titleTab: {
      minWidth: "37%",
      height: "100%",
      paddingHorizontal: s(16),
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: color,
      borderTopLeftRadius: s(radii.large),
      borderTopRightRadius: s(radii.large),
    },
    title: {
      color: colors.onColor,
      fontFamily: fonts.title,
      fontSize: s(16),
    },
    bar: {
      marginTop: -1,
      height: s(10),
      backgroundColor: color,
    },
    body: {
      minHeight: s(160),
      padding: s(14),
      backgroundColor: colors.card,
      borderBottomLeftRadius: s(radii.large),
      borderBottomRightRadius: s(radii.large),
    },
  });
}

export function BinderDialog({
  visible,
  onClose,
  title,
  color,
  blurTarget,
  children,
}: BinderDialogProps) {
  const scale = useScale();
  const colors = useColors();
  const dialogColor = color ?? colors.categories;
  const styles = useMemo(
    () => createStyles(scale, dialogColor, colors),
    [scale, dialogColor, colors],
  );

  useEffect(() => {
    if (!visible) return;
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      onClose();
      return true;
    });
    return () => subscription.remove();
  }, [visible, onClose]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      style={styles.overlay}
      entering={FadeIn.duration(180)}
      exiting={FadeOut.duration(150)}
    >
      {Platform.OS === "web" ? (
        <View style={[StyleSheet.absoluteFill, webBlurStyle]} />
      ) : (
        <BlurView
          style={StyleSheet.absoluteFill}
          intensity={25}
          tint="light"
          blurTarget={blurTarget}
          blurMethod="dimezisBlurView"
        />
      )}
      <View style={styles.backdrop} pointerEvents="none" />

      <View style={styles.dialog} accessibilityViewIsModal>
        <View style={styles.tabs}>
          <Pressable
            onPress={onClose}
            style={styles.closeTab}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Fermer"
          >
            <Image source={closeIcon} tintColor={colors.onColor} style={styles.closeIcon} />
          </Pressable>
          <View style={styles.titleTab}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          </View>
        </View>
        <View style={styles.bar} />
        <View style={styles.body}>{children}</View>
      </View>
    </Animated.View>
  );
}
