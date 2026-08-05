import { Stack } from "expo-router";

export default function TradesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="operation" />
      <Stack.Screen name="quote-preview" />
      <Stack.Screen name="confirm" />
      <Stack.Screen name="status" />
    </Stack>
  );
}
