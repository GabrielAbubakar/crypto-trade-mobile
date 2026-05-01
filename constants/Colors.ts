const palette = {
  primary: "#5ED5A8",
  secondary: "#1B232A",
  white: "#FFFFFF",
  black: "#000000",
  gray: {
    100: "#F2F3F7",
    200: "#EBEAEC",
    300: "#777777",
    400: "#3F414E",
  },
  error: "#FF4D4D",
  success: "#4BB543",
};

export const Colors = {
  primary: palette.primary,
  secondary: palette.secondary,
  background: palette.secondary,
  textPrimary: palette.white,
  textSecondary: palette.gray[300],
  textTertiary: palette.gray[300],
  border: palette.gray[200],
  white: palette.white,
  error: palette.error,
  success: palette.success,
} as const;

export type ColorTheme = typeof Colors;
