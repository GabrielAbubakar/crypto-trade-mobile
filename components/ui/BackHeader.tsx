import { Colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Body, Header } from "./BaseText";
import { BaseTouchableOpacity } from "./BaseTouchableOpacity";

interface BackHeaderProps {
  title: string;
  subtitle?: string;
}

export const BackHeader: React.FC<BackHeaderProps> = ({ title, subtitle }) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <BaseTouchableOpacity
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.textSecondary} />
      </BaseTouchableOpacity>
      <View>
        <Header style={styles.title}>{title}</Header>
        {subtitle && (
          <Body size="sm" color={Colors.textSecondary}>
            {subtitle}
          </Body>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    marginBottom: 10,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  title: {
    // fontFamily: FontFamily.bold,
  },
});
