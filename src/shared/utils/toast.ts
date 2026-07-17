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

/**
 * Utility to display a success toast message.
 * @param message The success message to show.
 */
export function showSuccessToast(message: string) {
  showToast("success", message);
}

/**
 * Utility to display an error toast message.
 * @param message The error message to show.
 */
export function showErrorToast(message: string) {
  showToast("error", message);
}

/**
 * Utility to display an info toast message.
 * @param message The info message to show.
 */
export function showInfoToast(message: string) {
  showToast("info", message);
}
