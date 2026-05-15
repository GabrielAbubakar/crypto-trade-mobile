import { Colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { BaseTouchableOpacity } from "./BaseTouchableOpacity";
import { Body, Subtitle } from "./BaseText";

interface MenuItemProps {
  label: string;
  value?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  showArrow?: boolean;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  label,
  value,
  icon,
  onPress,
  showArrow = true,
}) => {
  return (
    <BaseTouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.leftSection}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Subtitle style={styles.label}>{label}</Subtitle>
      </View>
      <View style={styles.rightSection}>
        {value && <Body style={styles.value}>{value}</Body>}
        {showArrow && (
          <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
        )}
      </View>
    </BaseTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconContainer: {
    width: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: Colors.textPrimary,
  },
  value: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
});
