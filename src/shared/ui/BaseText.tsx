import type { FontFamilyKey, FontSizeKey, TypographyPreset } from "@/shared/constants";
import { Colors, FontFamily, FontSize, Typography } from "@/shared/constants";
import React from "react";
import type { TextProps } from "react-native";
import { StyleSheet, Text, useColorScheme } from "react-native";

export interface BaseTextProps extends TextProps {
  variant?: FontFamilyKey;
  size?: FontSizeKey;
  color?: string;
  textAlign?: "left" | "center" | "right" | "justify";
  preset?: TypographyPreset;
  children?: React.ReactNode;
}

export const BaseText: React.FC<BaseTextProps> = ({
  variant,
  size,
  color,
  textAlign,
  preset = "body",
  style,
  children,
  ...props
}) => {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors;

  // If a preset is provided, use its properties as base
  const presetStyles = Typography[preset];

  const textStyles = [
    styles.base,
    {
      fontFamily: variant ? FontFamily[variant] : presetStyles.fontFamily,
      fontSize: size ? FontSize[size] : presetStyles.fontSize,
      color: color || theme.textPrimary,
      textAlign: textAlign || "left",
    },
    // Apply line height from preset if not overridden
    !size &&
      !variant && {
        lineHeight: Math.round(presetStyles.fontSize * presetStyles.lineHeight),
      },
    style,
  ];

  return (
    <Text style={textStyles} {...props}>
      {children}
    </Text>
  );
};

// Convenient sub-components
export const Header = (props: BaseTextProps) => (
  <BaseText preset="header" {...props} />
);
export const Title = (props: BaseTextProps) => (
  <BaseText preset="title" {...props} />
);
export const Subtitle = (props: BaseTextProps) => (
  <BaseText preset="subtitle" {...props} />
);
export const Body = (props: BaseTextProps) => (
  <BaseText preset="body" {...props} />
);
export const Caption = (props: BaseTextProps) => (
  <BaseText preset="caption" {...props} />
);

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
    textAlignVertical: "center",
  },
});
