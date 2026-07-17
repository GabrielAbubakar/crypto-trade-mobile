import type { FontSize } from "@/shared/constants";
import { Colors } from "@/shared/constants";
import React from "react";
import type { TextStyle, ViewStyle } from "react-native";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { BaseText } from "./BaseText";
import type { CustomTouchableOpacityProps } from "./BaseTouchableOpacity";
import { BaseTouchableOpacity } from "./BaseTouchableOpacity";

type ButtonVariant = "primary" | "secondary" | "outline" | "text" | "cancel";
type ButtonSize = "small" | "medium" | "large";

interface BaseButtonProps extends CustomTouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  textStyle?: TextStyle;
}

export const BaseButton: React.FC<BaseButtonProps> = ({
  title,
  variant = "primary",
  size = "large",
  isLoading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  disabled,
  ...props
}) => {
  const theme = Colors;

  const variants: Record<ButtonVariant, ViewStyle> = {
    primary: {
      backgroundColor: theme.primary,
    },
    secondary: {
      backgroundColor: theme.textSecondary,
    },
    outline: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: theme.primary,
    },
    cancel: {
      backgroundColor: theme.error,
    },
    text: {
      backgroundColor: "transparent",
    },
  };

  const textVariants: Record<ButtonVariant, string> = {
    primary: theme.secondary,
    secondary: theme.white,
    outline: theme.primary,
    cancel: theme.secondary,
    text: theme.primary,
  };

  const sizes: Record<ButtonSize, ViewStyle> = {
    small: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 16,
    },
    medium: {
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 16,
    },
    large: {
      paddingVertical: 18,
      paddingHorizontal: 32,
      borderRadius: 16,
    },
  };

  const fontSizes: Record<ButtonSize, keyof typeof FontSize> = {
    small: "xs",
    medium: "sm",
    large: "md",
  };

  const buttonStyle = [
    styles.container,
    variants[variant],
    sizes[size],
    (disabled || isLoading) && styles.disabled,
    style,
  ];

  const textColor = textVariants[variant];

  return (
    <BaseTouchableOpacity
      style={buttonStyle}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <BaseText
            variant="regular"
            size={fontSizes[size]}
            style={[
              {
                color: textColor,
                letterSpacing: 1,
              },
              textStyle,
            ]}
          >
            {title}
          </BaseText>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
      )}
    </BaseTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  iconLeft: {
    marginRight: 10,
  },
  iconRight: {
    marginLeft: 10,
  },
});
