import { Colors } from "@/constants";
import React from "react";
import type { ViewProps } from "react-native";
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenContainerProps extends ViewProps {
  children: React.ReactNode;
  scrollable?: boolean;
  withPadding?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = false,
  withPadding = true,
  refreshing = false,
  onRefresh,
  style,
  ...props
}) => {
  const content = (
    <View
      style={[
        scrollable ? { flexGrow: 1 } : styles.content,
        withPadding && styles.padding,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}
      >
        {scrollable ? (
          <ScrollView
            style={{ flex: 1 }}
            refreshControl={
              onRefresh && (
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              )
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {content}
          </ScrollView>
        ) : (
          content
        )}
      </KeyboardAvoidingView>
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
