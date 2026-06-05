import { Colors } from "@/constants";
import React from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import { BaseText } from "./BaseText";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  style?: ViewStyle;
  withPadding?: boolean;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  style,
  withPadding = false,
}) => {
  return (
    <View style={[styles.container, withPadding && styles.padding, style]}>
      <BaseText variant="bold" size="3xl" style={styles.title}>
        {title}
      </BaseText>
      {subtitle ? (
        <BaseText color={Colors.textSecondary} size="md" style={styles.subtitle}>
          {subtitle}
        </BaseText>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 20,
  },
  padding: {
    paddingHorizontal: 20,
  },
  title: {
    color: Colors.white,
  },
  subtitle: {
    marginTop: 10,
    lineHeight: 20,
  },
});
