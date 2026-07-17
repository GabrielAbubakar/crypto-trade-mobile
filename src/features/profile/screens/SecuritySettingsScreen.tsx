import { BackHeader, ProfileOptionCard, ScreenContainer } from "@/shared/ui";
import { BaseText } from "@/shared/ui/BaseText";
import { Colors } from "@/shared/constants";
import { useGet2FAStatusQuery } from "@/features/auth";
import { useGetProfileQuery } from "@/features/profile/api/profileApi";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function SecuritySettingsScreen() {
  const router = useRouter();
  const { data: profile } = useGetProfileQuery();
  const { data: twoFactorStatus } = useGet2FAStatusQuery();

  const is2faEnabled = profile?.twoFactorEnabled;
  const remainingCodes =
    twoFactorStatus !== undefined ? twoFactorStatus.recoveryCodesRemaining : 8;
  const recoveryCodesDescription = `${is2faEnabled ? "" : "2FA not setup yet and "
    }${remainingCodes} backup codes remaining`;

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
          description={
            profile?.twoFactorEnabled
              ? "Enabled for login protection"
              : "Not enabled for login protection"
          }
          icon={
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color="#5ED5A8"
            />
          }
          value={profile?.twoFactorEnabled ? "On" : "Off"}
          valueColor={profile?.twoFactorEnabled ? Colors.primary : Colors.error}
          onPress={() => router.push("/profile/security/2fa")}
        />
        <ProfileOptionCard
          title="Recovery codes"
          description={recoveryCodesDescription}
          icon={
            <Ionicons name="document-text-outline" size={20} color="#5ED5A8" />
          }
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
          onPress={() => { }}
        />
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
    gap: 12,
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
