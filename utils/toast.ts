import Toast from "react-native-toast-message";

export type ToastType = "success" | "error" | "info";

/**
 * Utility to display toast messages using react-native-toast-message.
 * 
 * @param type The type of toast: 'success', 'error', or 'info'.
 * @param message The main content message to show.
 */
export function showToast(type: ToastType, message: string) {
  Toast.show({
    type,
    text1: type.charAt(0).toUpperCase() + type.slice(1),
    text2: message,
    position: "top",
    visibilityTime: 4000,
    autoHide: true,
  });
}
