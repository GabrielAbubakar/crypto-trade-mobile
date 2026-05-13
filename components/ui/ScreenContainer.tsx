import { Colors } from "@/constants";
import React from "react";
import type { ViewProps } from "react-native";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenContainerProps extends ViewProps {
  children: React.ReactNode;
  scrollable?: boolean;
  withPadding?: boolean;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = false,
  withPadding = true,
  style,
  ...props
}) => {
  const content = (
    <View
      style={[styles.content, withPadding && styles.padding, style]}
      {...props}
    >
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {scrollable ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  content: {
    flex: 1,
  },
  padding: {
    paddingHorizontal: 20,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
