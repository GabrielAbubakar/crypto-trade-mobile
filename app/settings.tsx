import { BackHeader, MenuItem, ScreenContainer } from "@/components";
import { Colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
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

export default function SettingsScreen() {
  return (
    <ScreenContainer scrollable style={styles.container}>
      <BackHeader title="Settings" />
      <View style={styles.menuList}>
        <MenuItem
          label="Language"
          value="English"
          icon={<LanguageIcon width={17} height={17} color={Colors.primary} />}
          onPress={() => {}}
        />
        <MenuItem
          label="Currency"
          value="USD"
          icon={<CurrencyIcon width={17} height={17} color={Colors.primary} />}
          onPress={() => {}}
        />
        <MenuItem
          label="Appearance"
          value="Use Device Settings"
          icon={
            <AppearanceIcon width={17} height={17} color={Colors.primary} />
          }
          onPress={() => {}}
        />
        <MenuItem
          label="Preference"
          value="Customize"
          icon={
            <PreferenceIcon width={17} height={17} color={Colors.primary} />
          }
          onPress={() => {}}
        />
        <MenuItem
          label="Price Alerts"
          value="On"
          icon={
            <Ionicons
              name="trending-up-outline"
              size={17}
              color={Colors.primary}
            />
          }
          onPress={() => {}}
        />
        <MenuItem
          label="Push notifications"
          value="On"
          icon={
            <NotificationIcon width={17} height={17} color={Colors.primary} />
          }
          onPress={() => {}}
        />
        <MenuItem
          label="Biometrics"
          value="Disabled"
          icon={
            <FingerprintIcon width={17} height={17} color={Colors.primary} />
          }
          onPress={() => {}}
        />
        <MenuItem
          label="About Us"
          value="v1.2.3"
          icon={<AboutIcon width={17} height={17} color={Colors.primary} />}
          onPress={() => {}}
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
    paddingBottom: 120, // extra spacing so the float bottom tab doesn't cut it off
  },
});
