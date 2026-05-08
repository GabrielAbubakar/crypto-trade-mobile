import { Colors } from "@/constants";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "NeueMontreal-Light": require("../assets/fonts/neue-montreal/NeueMontreal-Light.otf"),
    "NeueMontreal-Medium": require("../assets/fonts/neue-montreal/NeueMontreal-Medium.otf"),
    "NeueMontreal-Regular": require("../assets/fonts/neue-montreal/NeueMontreal-Regular.otf"),
    "NeueMontreal-Bold": require("../assets/fonts/neue-montreal/NeueMontreal-Bold.otf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // 4. Return null (keep showing splash) until loading is complete
  if (!loaded && !error) {
    return null;
  }
  return (
    <Stack
      initialRouteName="(auth)"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.secondary },
      }}
    >
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
