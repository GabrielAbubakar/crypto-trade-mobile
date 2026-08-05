/* eslint-disable no-console */
import { useRegisterDeviceMutation } from "@/features/profile";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";

// Set standard foreground notification handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function usePushNotifications(isAuthenticated: boolean) {
  const [registerDevice] = useRegisterDeviceMutation();
  const notificationListener = useRef<Notifications.EventSubscription>(null);
  const responseListener = useRef<Notifications.EventSubscription>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function setupNotifications() {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        try {
          await registerDevice({
            expoPushToken: token,
            platform:
              Platform.OS === "ios"
                ? "ios"
                : Platform.OS === "android"
                  ? "android"
                  : Platform.OS,
          }).unwrap();
          console.log(
            "✅ Push notification token registered on server:",
            token,
          );
        } catch (error) {
          console.error("❌ Failed to register push token on server:", error);
        }
      }
    }

    setupNotifications();

    // Triggered when a notification is received while the app is in the foreground
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("🔔 Notification Received:", notification);
      });

    // Triggered when a user taps or interacts with a notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("🖱️ Notification Tapped:", response);
      });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [isAuthenticated, registerDevice]);
}

async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    console.log("Must use physical device for Push Notifications");
    return null;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.warn("Permission to receive push notifications was denied.");
    return null;
  }

  // Read project ID from your EAS app configuration
  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  if (!projectId) {
    console.error(
      "EAS Project ID is not defined in app.json / expo configuration.",
    );
    return null;
  }

  try {
    const token = (await Notifications.getExpoPushTokenAsync({ projectId }))
      .data;
    return token;
  } catch (e) {
    console.error("Error fetching Expo Push Token:", e);
    return null;
  }
}
