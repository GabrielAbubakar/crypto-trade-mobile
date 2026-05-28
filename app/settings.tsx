import {
  BackHeader,
  BaseButton,
  ConfirmationModal,
  MenuItem,
  ScreenContainer,
} from "@/components";
import { Colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

// Import custom SVGs from settings folder
import AboutIcon from "@/assets/icons/settings/about.svg";
import AppearanceIcon from "@/assets/icons/settings/appearance.svg";
import CurrencyIcon from "@/assets/icons/settings/currency.svg";
import LanguageIcon from "@/assets/icons/settings/language.svg";
import PreferenceIcon from "@/assets/icons/settings/preference.svg";

// Additional asset SVG icons
import FingerprintIcon from "@/assets/icons/auth/Fingerprint.svg";
import NotificationIcon from "@/assets/icons/main/notification.svg";
import { useLogOutMutation } from "@/store";
import { showToast } from "@/utils";
import { router } from "expo-router";

const settingsItems = [
  {
    label: "Language",
    value: "English",
    icon: <LanguageIcon width={17} height={17} color={Colors.primary} />,
  },
  {
    label: "Currency",
    value: "USD",
    icon: <CurrencyIcon width={17} height={17} color={Colors.primary} />,
  },
  {
    label: "Appearance",
    value: "Use Device Settings",
    icon: <AppearanceIcon width={17} height={17} color={Colors.primary} />,
  },
  {
    label: "Preference",
    value: "Customize",
    icon: <PreferenceIcon width={17} height={17} color={Colors.primary} />,
  },
  {
    label: "Price Alerts",
    value: "On",
    icon: (
      <Ionicons name="trending-up-outline" size={17} color={Colors.primary} />
    ),
  },
  {
    label: "Push notifications",
    value: "On",
    icon: <NotificationIcon width={17} height={17} color={Colors.primary} />,
  },
  {
    label: "Biometrics",
    value: "Disabled",
    icon: <FingerprintIcon width={17} height={17} color={Colors.primary} />,
  },
  {
    label: "About Us",
    value: "v1.2.3",
    icon: <AboutIcon width={17} height={17} color={Colors.primary} />,
  },
];

export default function SettingsScreen() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logOut, { isLoading }] = useLogOutMutation();

  async function handleConfirmLogout() {
    try {
      await logOut("").unwrap();
      setShowLogoutModal(false);
      showToast("success", "Logged out successfully");
      router.replace("/(auth)");
    } catch (error) {
      console.log(error);
      showToast("error", "Unable to logout. Please try again.");
    }
  }

  return (
    <ScreenContainer scrollable style={styles.container}>
      <BackHeader title="Settings" />
      <View style={styles.menuList}>
        {settingsItems.map((item) => (
          <MenuItem
            key={item.label}
            label={item.label}
            value={item.value}
            icon={item.icon}
            onPress={() => {}}
          />
        ))}

        <BaseButton
          variant="cancel"
          title="Log out"
          disabled={isLoading}
          onPress={() => setShowLogoutModal(true)}
          style={{ marginTop: "auto" }}
        />

        <ConfirmationModal
          visible={showLogoutModal}
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={handleConfirmLogout}
          isLoading={isLoading}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondary,
  },
  menuList: {
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: 30,
  },
});
