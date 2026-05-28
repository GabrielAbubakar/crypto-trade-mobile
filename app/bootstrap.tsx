import { Colors } from "@/constants";
import { useAppSelector } from "@/store";
import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function BootstrapScreen() {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    const nextRoute: Href = isAuthenticated ? "/(tabs)/home" : "/(auth)";
    router.replace(nextRoute as Href);
  }, [isAuthenticated, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
});
