import { Colors } from "@/constants";
import { Stack } from "expo-router";
import React from "react";

export default function KYCLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.secondary },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="limits" />
      <Stack.Screen name="details" />
      <Stack.Screen name="document" />
      <Stack.Screen name="selfie" />
      <Stack.Screen name="review" />
    </Stack>
  );
}
