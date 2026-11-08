import {
  IBMPlexMono_400Regular,
  IBMPlexMono_600SemiBold,
  IBMPlexMono_700Bold,
} from "@expo-google-fonts/ibm-plex-mono";
import { SpaceGrotesk_700Bold } from "@expo-google-fonts/space-grotesk";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";

export default function RootLayout() {
  const [loaded] = useFonts({
    IBMPlexMono_400Regular,
    IBMPlexMono_600SemiBold,
    IBMPlexMono_700Bold,
    SpaceGrotesk_700Bold,
  });

  if (!loaded) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
