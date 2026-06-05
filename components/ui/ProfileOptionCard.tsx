import { Colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { BaseText } from "./BaseText";
import { BaseTouchableOpacity } from "./BaseTouchableOpacity";

interface ProfileOptionCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  iconBgColor?: string;
  rightElement?: React.ReactNode;
  value?: string;
  valueColor?: string;
  onPress?: () => void;
  onLongPress?: () => void;
}

export const ProfileOptionCard: React.FC<ProfileOptionCardProps> = ({
  title,
  description,
  icon,
  iconBgColor = "#23362F", // default dark green background
  rightElement,
  value,
  valueColor = Colors.textSecondary,
  onPress,
  onLongPress,
}) => {
  return (
    <BaseTouchableOpacity 
      onPress={onPress} 
      onLongPress={onLongPress} 
      style={styles.container}
    >
      <View style={styles.leftSection}>
        {icon ? (
          <View
            style={[styles.iconContainer, { backgroundColor: iconBgColor }]}
          >
            {icon}
          </View>
        ) : null}
        <View style={styles.textContainer}>
          <BaseText variant="bold" size="md" color="#FFFFFF">
            {title}
          </BaseText>
          {description ? (
            <BaseText size="xs" color="#8594A6" style={styles.description}>
              {description}
            </BaseText>
          ) : null}
        </View>
      </View>
      <View style={styles.rightSection}>
        {value ? (
          <BaseText size="sm" color={valueColor} style={styles.valueText}>
            {value}
          </BaseText>
        ) : null}
        {rightElement || (
          <Ionicons name="chevron-forward" size={18} color="#8594A6" />
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
    backgroundColor: "#141820",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  description: {
    marginTop: 2,
  },
  valueText: {
    marginRight: 4,
  },
});
