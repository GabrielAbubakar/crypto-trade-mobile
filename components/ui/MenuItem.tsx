import { Colors } from "@/core/constants";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Body, Subtitle } from "./BaseText";
import { BaseTouchableOpacity } from "./BaseTouchableOpacity";

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
          <Ionicons
            name="arrow-forward"
            size={18}
            color={Colors.textSecondary}
          />
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
    width: 31,
    height: 28,
    borderRadius: 16,
    backgroundColor: Colors.cardBgAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: Colors.textLightGray,
  },
  value: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
});
