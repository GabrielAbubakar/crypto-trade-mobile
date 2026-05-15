import { Colors, FontFamily } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Header } from "./BaseText";
import { BaseTouchableOpacity } from "./BaseTouchableOpacity";

interface BackHeaderProps {
  title: string;
}

export const BackHeader: React.FC<BackHeaderProps> = ({ title }) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <BaseTouchableOpacity
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.textSecondary} />
      </BaseTouchableOpacity>
      <Header style={styles.title}>{title}</Header>

      <Ionicons
        name="ellipsis-vertical"
        size={20}
        color={Colors.textPrimary}
        style={{ marginLeft: "auto" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontFamily: FontFamily.bold,
  },
});
