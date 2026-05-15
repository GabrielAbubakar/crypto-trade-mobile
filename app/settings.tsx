import { BackHeader, MenuItem, ScreenContainer } from "@/components";
import { Colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function SettingsScreen() {
  return (
    <ScreenContainer>
      <BackHeader title="Settings" />
      <View style={styles.menuList}>
        <MenuItem
          label="Language"
          value="English"
          icon={<Ionicons name="globe-outline" size={22} color={Colors.primary} />}
          onPress={() => {}}
        />
        <MenuItem
          label="Currency"
          value="USD"
          icon={<Ionicons name="cash-outline" size={22} color={Colors.primary} />}
          onPress={() => {}}
        />
        <MenuItem
          label="Appearance"
          value="Use Device Settings"
          icon={<Ionicons name="aperture-outline" size={22} color={Colors.primary} />}
          onPress={() => {}}
        />
        <MenuItem
          label="Preference"
          value="Customize"
          icon={<Ionicons name="options-outline" size={22} color={Colors.primary} />}
          onPress={() => {}}
        />
        <MenuItem
          label="About Us"
          value="v1.2.3"
          icon={<Ionicons name="people-outline" size={22} color={Colors.primary} />}
          onPress={() => {}}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  menuList: {
    marginTop: 20,
  },
});
