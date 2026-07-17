/**
 * Typography Design System
 */

export const FontFamily = {
  bold: "NeueMontreal-Bold",
  regular: "NeueMontreal-Regular",
  light: "NeueMontreal-Light",
  medium: "NeueMontreal-Medium",
} as const;

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  "2xl": 24,
  "3xl": 28,
  xxxl: 32,
  xxxxl: 44,
} as const;

export const LineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
} as const;

export const FontWeight = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

export const Typography = {
  header: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxl,
    lineHeight: LineHeight.tight,
  },
  title: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xl,
    lineHeight: LineHeight.tight,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    lineHeight: LineHeight.normal,
  },
  body: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    lineHeight: LineHeight.normal,
  },
  caption: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    lineHeight: LineHeight.normal,
  },
} as const;

export type TypographyPreset = keyof typeof Typography;
export type FontSizeKey = keyof typeof FontSize;
export type FontFamilyKey = keyof typeof FontFamily;
