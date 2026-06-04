import { BackHeader, ProfileOptionCard, ScreenContainer } from "@/components";
import { BaseText } from "@/components/ui/BaseText";
import { Colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function SecurityScreen() {
  const router = useRouter();

  return (
    <ScreenContainer style={styles.container} withPadding={true}>
      <BackHeader title="Security" />

      <BaseText color="#8594A6" style={styles.subtitle}>
        Protect account access and sensitive actions.
      </BaseText>

      <View style={styles.menuList}>
        <ProfileOptionCard
          title="Transaction PIN"
          description="Required for trades and withdrawals"
          icon={<Ionicons name="keypad-outline" size={20} color="#5ED5A8" />}
          value="Set"
          valueColor={Colors.primary}
          onPress={() => router.push("/profile/security/pin")}
        />
        <ProfileOptionCard
          title="Authenticator app"
          description="Enabled for login protection"
          icon={
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color="#5ED5A8"
            />
          }
          value="On"
          valueColor={Colors.primary}
          onPress={() => router.push("/profile/security/2fa")}
        />
        <ProfileOptionCard
          title="Recovery codes"
          description="8 backup codes remaining"
          icon={
            <Ionicons name="document-text-outline" size={20} color="#5ED5A8" />
          }
          value="View"
          onPress={() => router.push("/profile/security/recovery-codes")}
        />
        <ProfileOptionCard
          title="Registered devices"
          description="iPhone 15 Pro - push enabled"
          icon={
            <Ionicons name="phone-portrait-outline" size={20} color="#5ED5A8" />
          }
          value="2"
          onPress={() => router.push("/profile/security/devices")}
        />
        <ProfileOptionCard
          title="Biometric login"
          description="Face ID enabled on this device"
          icon={
            <Ionicons name="finger-print-outline" size={20} color="#5ED5A8" />
          }
          value="On"
          valueColor={Colors.primary}
          onPress={() => {}}
        />
      </View>

      {/* Admin Notice Box */}
      <View style={styles.noticeBox}>
        <BaseText variant="bold" style={styles.noticeTitle}>
          Admin will never ask for codes
        </BaseText>
        <BaseText size="sm" color="#8594A6" style={styles.noticeText}>
          Keep recovery codes private and regenerate them if exposed.
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
  menuList: {
    marginBottom: 24,
  },
  noticeBox: {
    backgroundColor: "#2B2416",
    paddingVertical: 22,
    paddingHorizontal: 26,
    borderRadius: 16,
    marginTop: 10,
    marginBottom: 40,
  },
  noticeTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  noticeText: {
    lineHeight: 18,
  },
});
