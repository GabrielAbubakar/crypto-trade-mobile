import { Colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View, StyleProp, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { BaseText } from "./BaseText";
import { BaseTouchableOpacity } from "./BaseTouchableOpacity";

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(BaseTouchableOpacity);

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
  style?: StyleProp<ViewStyle>;
}

export const ProfileOptionCard: React.FC<ProfileOptionCardProps> = ({
  title,
  description,
  icon,
  iconBgColor = Colors.iconBgActive, // default dark green background
  rightElement,
  value,
  valueColor = Colors.textSecondary,
  onPress,
  onLongPress,
  style,
}) => {
  return (
    <AnimatedTouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      style={[styles.container, style]}
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
          <BaseText variant="bold" size="md" color={Colors.white}>
            {title}
          </BaseText>
          {description ? (
            <BaseText
              size="xs"
              color={Colors.textSecondary}
              style={styles.description}
            >
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
          <Ionicons
            name="chevron-forward"
            size={18}
            color={Colors.textSecondary}
          />
        )}
      </View>
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 16,
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
