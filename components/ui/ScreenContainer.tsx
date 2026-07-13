import { Colors } from "@/core/constants";
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

/**
 * Props for the ScreenContainer component.
 */
interface ScreenContainerProps extends ViewProps {
  /** The content to be rendered inside the container. */
  children: React.ReactNode;
  /** If true, wraps the content in a ScrollView to enable vertical scrolling. Default: false. */
  scrollable?: boolean;
  /** If true, applies standard horizontal padding to the content wrapper. Default: true. */
  withPadding?: boolean;
  /** Whether the ScrollView is currently showing the refresh spinner. Only applicable if scrollable is true and onRefresh is provided. Default: false. */
  refreshing?: boolean;
  /** Callback triggered when a pull-to-refresh gesture is performed on the ScrollView. */
  onRefresh?: () => void;
  /** If true, wraps the screen in a KeyboardAvoidingView to prevent inputs from being obscured by the keyboard. Default: true. */
  avoidKeyboard?: boolean;
  /** The vertical offset (in pixels) used by the KeyboardAvoidingView. Often needed when headers or tab bars are present. Default: iOS: 50, Android: 0. */
  keyboardVerticalOffset?: number;
}

/**
 * ScreenContainer is a layout wrapper component intended to be used as the root view for screens.
 *
 * It automatically handles:
 * - Safe area inset bounds using `SafeAreaView`.
 * - Optional vertical scrolling with built-in pull-to-refresh capabilities.
 * - Dynamic keyboard avoidance, preventing text inputs from being covered by the soft keyboard.
 */
export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = false,
  withPadding = true,
  refreshing = false,
  onRefresh,
  avoidKeyboard = false,
  keyboardVerticalOffset = Platform.OS === "ios" ? 50 : 0,
  style,
  ...props
}) => {
  // Wrap children in a standardized container with optional padding.
  // If the view is scrollable, flexGrow: 1 ensures it expands to fill space correctly.
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

  const renderContent = () => {
    // 1. Determine if the main layout needs to be scrollable
    const mainView = scrollable ? (
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
    );

    // 2. Conditionally wrap the layout in KeyboardAvoidingView
    if (avoidKeyboard) {
      return (
        <KeyboardAvoidingView
          // We use 'padding' on both iOS and Android. With edgeToEdgeEnabled: true on Android,
          // the system doesn't natively resize the window layout, so we need KeyboardAvoidingView
          // to add bottom padding. Using 'padding' instead of 'height' on Android prevents the
          // view height from getting stuck with a gap after the keyboard is dismissed.
          behavior="padding"
          style={{ flex: 1 }}
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          {mainView}
        </KeyboardAvoidingView>
      );
    }

    return mainView;
  };

  // 3. Final Return Content
  return <SafeAreaView style={styles.safeArea}>{renderContent()}</SafeAreaView>;
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
