import { Stack } from "expo-router";

export default function SecurityLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="pin" />
      <Stack.Screen name="2fa" />
      <Stack.Screen name="recovery-codes" />
      <Stack.Screen name="devices" />
    </Stack>
  );
}
