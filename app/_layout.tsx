import { Colors, FontFamily, FontSize } from "@/constants";
import { store } from "@/store";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Provider } from "react-redux";
import Toast, { BaseToast, ErrorToast, ToastConfig } from "react-native-toast-message";

const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: Colors.primary,
        backgroundColor: "#222C35",
        height: "auto",
        minHeight: 60,
        paddingVertical: 10,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: FontSize.md,
        fontFamily: FontFamily.bold,
        color: Colors.white,
      }}
      text2Style={{
        fontSize: FontSize.sm,
        fontFamily: FontFamily.regular,
        color: Colors.textSecondary,
      }}
      text2NumberOfLines={3}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: Colors.error,
        backgroundColor: "#222C35",
        height: "auto",
        minHeight: 60,
        paddingVertical: 10,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: FontSize.md,
        fontFamily: FontFamily.bold,
        color: Colors.white,
      }}
      text2Style={{
        fontSize: FontSize.sm,
        fontFamily: FontFamily.regular,
        color: Colors.textSecondary,
      }}
      text2NumberOfLines={3}
    />
  ),
  info: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#4AA9FF",
        backgroundColor: "#222C35",
        height: "auto",
        minHeight: 60,
        paddingVertical: 10,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: FontSize.md,
        fontFamily: FontFamily.bold,
        color: Colors.white,
      }}
      text2Style={{
        fontSize: FontSize.sm,
        fontFamily: FontFamily.regular,
        color: Colors.textSecondary,
      }}
      text2NumberOfLines={3}
    />
  ),
};

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
    // Redux Provider
    <Provider store={store}>
      <Stack
        initialRouteName="(tabs)"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.secondary },
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <Toast config={toastConfig} />
    </Provider>
  );
}

