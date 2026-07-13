import { useAppSelector } from "@/core/store/hooks";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

export default function AuthLayout() {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(tabs)/home");
    }
  }, [isAuthenticated, router]);

  return (
    <Stack
      // initialRouteName="register-mobile"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="register-mobile" />
      <Stack.Screen name="otp" />
      <Stack.Screen name="2fa" />
      <Stack.Screen name="recovery" />
    </Stack>
  );
}
