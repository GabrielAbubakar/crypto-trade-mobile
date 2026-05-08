import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      initialRouteName="register-mobile"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="register-mobile" />
      <Stack.Screen name="otp" />
    </Stack>
  );
}
