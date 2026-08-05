import { Colors, FontFamily, FontSize } from "@/shared/constants";
import { StyleSheet } from "react-native";
import type { ToastConfig } from "react-native-toast-message";
import { BaseToast, ErrorToast } from "react-native-toast-message";

export const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={styles.toast}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.text1}
      text2Style={styles.text2}
      text2NumberOfLines={3}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={[styles.toast, styles.errorToast]}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.text1}
      text2Style={styles.text2}
      text2NumberOfLines={3}
    />
  ),
  info: (props) => (
    <BaseToast
      {...props}
      style={[styles.toast, styles.infoToast]}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.text1}
      text2Style={styles.text2}
      text2NumberOfLines={3}
    />
  ),
};

const styles = StyleSheet.create({
  toast: {
    backgroundColor: "#222C35",
    height: "auto",
    minHeight: 60,
    paddingVertical: 10,
  },
  errorToast: {
    borderLeftColor: Colors.error,
  },
  infoToast: {
    borderLeftColor: "#4AA9FF",
  },
  contentContainer: {
    paddingHorizontal: 15,
  },
  text1: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  text2: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
  },
});
