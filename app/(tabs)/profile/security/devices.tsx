import { BackHeader, ProfileOptionCard, ScreenContainer } from "@/components";
import { BaseText } from "@/components/ui/BaseText";
import { Colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function DevicesScreen() {
  return (
    <ScreenContainer style={styles.container} withPadding={true}>
      <BackHeader title="Devices" />

      <BaseText color="#8594A6" style={styles.subtitle}>
        Registered devices for push notification and session awareness.
      </BaseText>

      <View style={styles.list}>
        <ProfileOptionCard
          title="iPhone 15 Pro"
          description="iOS - Push enabled"
          icon={<Ionicons name="phone-portrait-outline" size={20} color="#5ED5A8" />}
          rightElement={
            <View style={styles.currentBadge}>
              <BaseText variant="bold" size="xs" color="#5ED5A8">
                Current
              </BaseText>
            </View>
          }
        />

        <ProfileOptionCard
          title="Chrome browser"
          description="macOS - Last seen today"
          icon={<Ionicons name="desktop-outline" size={20} color="#5ED5A8" />}
          rightElement={
            <View style={styles.activeBadge}>
              <BaseText variant="bold" size="xs" color="#5ED5A8">
                Active
              </BaseText>
            </View>
          }
        />

        <ProfileOptionCard
          title="Expo Go"
          description="Android - Last seen yesterday"
          icon={<Ionicons name="phone-portrait-outline" size={20} color="#8594A6" />}
          iconBgColor="#1A2130"
          rightElement={<View />} // empty view to hide chevron
        />
      </View>

      {/* No unknown devices card */}
      <View style={styles.infoCard}>
        <Ionicons name="shield-checkmark" size={32} color="#5ED5A8" style={styles.infoIcon} />
        <BaseText variant="bold" color="#FFFFFF" style={styles.infoTitle}>
          No unknown devices
        </BaseText>
        <BaseText size="sm" color="#8594A6" style={styles.infoText}>
          New device alerts appear here after sign in from another device.
        </BaseText>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondary,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 20,
  },
  list: {
    marginBottom: 32,
  },
  currentBadge: {
    backgroundColor: "rgba(94, 213, 168, 0.12)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: "rgba(94, 213, 168, 0.08)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  infoCard: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.04)",
    padding: 24,
    alignItems: "center",
    marginBottom: 40,
  },
  infoIcon: {
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    marginBottom: 6,
    textAlign: "center",
  },
  infoText: {
    color: "#8594A6",
    textAlign: "center",
    lineHeight: 20,
  },
});
