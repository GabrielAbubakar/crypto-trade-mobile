import { Stack } from "expo-router";

export default function WalletsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="portfolio-history" />
      <Stack.Screen name="deposit" />
      <Stack.Screen name="deposit-details" />
      <Stack.Screen name="simulate-deposit" />
      <Stack.Screen name="withdraw" />
      <Stack.Screen name="transactions" />
      <Stack.Screen name="transaction/[id]" />
    </Stack>
  );
}
