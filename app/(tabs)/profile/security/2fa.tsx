import {
  BackHeader,
  BaseButton,
  BaseInput,
  ScreenContainer,
} from "@/components";
import { BaseText } from "@/components/ui/BaseText";
import { Colors } from "@/constants";
import {
  useDisable2FAMutation,
  useEnable2FAMutation,
  useGetProfileQuery,
  useSetup2FAMutation,
} from "@/store";
import { showErrorToast, showSuccessToast } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Clipboard,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";

type Step =
  | "intro"
  | "setup_qr"
  | "success_recovery"
  | "active"
  | "disable_form";

export default function TwoFactorScreen() {
  const router = useRouter();
  const { data: profile, isLoading: isProfileLoading } = useGetProfileQuery();

  const [setup2FA, { isLoading: isSettingUp }] = useSetup2FAMutation();
  const [enable2FA, { isLoading: isEnabling }] = useEnable2FAMutation();
  const [disable2FA, { isLoading: isDisabling }] = useDisable2FAMutation();

  const [step, setStep] = useState<Step>("intro");
  const [setupData, setSetupData] = useState<{
    secret: string;
    otpauthUri: string;
  } | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);

  // Inputs
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  console.log(recoveryCodes);

  useEffect(() => {
    if (profile) {
      if (profile.twoFactorEnabled) {
        setStep("active");
      } else {
        setStep((currentStep) => {
          if (
            currentStep !== "setup_qr" &&
            currentStep !== "success_recovery"
          ) {
            return "intro";
          }
          return currentStep;
        });
      }
    }
  }, [profile]);

  const handleCopySecret = () => {
    if (setupData?.secret) {
      Clipboard.setString(setupData.secret);
      showSuccessToast("Secret key copied to clipboard!");
    }
  };

  const handleCopyRecoveryCodes = () => {
    if (recoveryCodes.length > 0) {
      Clipboard.setString(recoveryCodes.join("\n"));
      showSuccessToast("Recovery codes copied to clipboard!");
    }
  };

  const handleStartSetup = async () => {
    try {
      const res = await setup2FA().unwrap();
      setSetupData(res);
      setStep("setup_qr");
      setCode("");
    } catch (err: any) {
      showErrorToast(err?.data?.message || "Failed to start 2FA setup");
    }
  };

  const handleEnable2FA = async () => {
    if (!code || code.length !== 6) {
      showErrorToast("Please enter a valid 6-digit authenticator code");
      return;
    }

    try {
      const res = await enable2FA({ code }).unwrap();
      setRecoveryCodes(res.recoveryCodes || []);
      setStep("success_recovery");
      showSuccessToast("Two-Factor Authentication enabled successfully!");
    } catch (err: any) {
      showErrorToast(err?.data?.message || "Failed to enable 2FA");
    }
  };

  const handleDisable2FA = async () => {
    if (!password && !code && !recoveryCode) {
      showErrorToast(
        "Please enter your password, code, or recovery code to disable 2FA",
      );
      return;
    }

    try {
      await disable2FA({
        password: password || undefined,
        code: code || undefined,
        recoveryCode: recoveryCode || undefined,
      }).unwrap();
      showSuccessToast("Two-Factor Authentication disabled successfully!");
      setStep("intro");
      setPassword("");
      setCode("");
      setRecoveryCode("");
    } catch (err: any) {
      showErrorToast(err?.data?.message || "Failed to disable 2FA");
    }
  };

  if (isProfileLoading) {
    return (
      <ScreenContainer style={styles.container} withPadding={true}>
        <BackHeader title="2FA Security" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={styles.container} withPadding={true}>
      {/* View: Introduction to setup 2FA */}
      {step === "intro" && (
        <>
          <BackHeader title="Authenticator 2FA" />
          <View style={styles.introContent}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="shield-checkmark-outline"
                size={80}
                color={Colors.primary}
              />
            </View>
            <BaseText variant="bold" color="#FFFFFF" style={styles.introTitle}>
              Enable Two-Factor Authentication
            </BaseText>
            <BaseText color="#8594A6" style={styles.introDescription}>
              Protect your account and transactions with an extra layer of
              security. Once enabled, you&apos;ll need to enter a 6-digit
              verification code generated by your authenticator app (like Google
              Authenticator or Duo Mobile) when logging in.
            </BaseText>
            <BaseButton
              title="Set up 2FA"
              onPress={handleStartSetup}
              isLoading={isSettingUp}
              style={styles.actionButton}
            />
          </View>
        </>
      )}

      {/* View: Setup QR Code & Secret */}
      {step === "setup_qr" && (
        <>
          <BackHeader title="Scan QR Code" />
          <BaseText color="#8594A6" style={styles.subtitle}>
            Scan the QR code below or enter the secret key manually in your
            authenticator app.
          </BaseText>

          {/* Scannable QR Code */}
          <View style={styles.qrContainer}>
            <View style={styles.qrCodeBox}>
              {setupData?.otpauthUri ? (
                <QRCode
                  value={setupData.otpauthUri}
                  size={150}
                  backgroundColor="#FFFFFF"
                  color="#000000"
                />
              ) : null}
            </View>
          </View>

          {/* Secret Key Display */}
          <View style={styles.secretContainer}>
            <BaseText size="xs" color="#8594A6">
              Secret Key
            </BaseText>
            <View style={styles.secretRow}>
              <BaseText
                variant="bold"
                size="md"
                color="#FFFFFF"
                style={styles.secretText}
              >
                {setupData?.secret}
              </BaseText>
              <TouchableOpacity
                onPress={handleCopySecret}
                style={styles.copyButton}
              >
                <Ionicons
                  name="copy-outline"
                  size={20}
                  color={Colors.primary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Code Input */}
          <View style={styles.inputGroup}>
            <BaseText variant="bold" color="#FFFFFF" style={styles.label}>
              Authenticator Code
            </BaseText>
            <BaseInput
              placeholder="123456"
              keyboardType="numeric"
              maxLength={6}
              value={code}
              onChangeText={setCode}
              containerStyle={styles.authInput}
              style={{ color: "#FFFFFF", fontSize: 18, textAlign: "center" }}
            />
          </View>

          <BaseButton
            title="Enable 2FA"
            onPress={handleEnable2FA}
            isLoading={isEnabling}
            style={styles.actionButton}
          />
        </>
      )}

      {/* View: Success & Recovery Codes */}
      {step === "success_recovery" && (
        <>
          <BackHeader title="Save Recovery Codes" />
          <View style={styles.successContent}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="checkmark-circle-outline"
                size={80}
                color="#5ED5A8"
              />
            </View>
            <BaseText
              variant="bold"
              color="#FFFFFF"
              style={styles.successTitle}
            >
              2FA Enabled Successfully!
            </BaseText>

            <View style={styles.warningBox}>
              <Ionicons name="warning-outline" size={20} color="#FFD166" />
              <BaseText size="sm" color="#FFD166" style={styles.warningText}>
                Keep these recovery codes secure. If you lose your authenticator
                app, these codes are the only way to log back in. Each code can
                only be used once.
              </BaseText>
            </View>

            {/* Recovery Codes list */}
            <View style={styles.codesContainer}>
              <View style={styles.codesGrid}>
                {recoveryCodes.map((codeStr, idx) => (
                  <View key={idx} style={styles.codeItem}>
                    <BaseText variant="bold" color="#FFFFFF">
                      {codeStr}
                    </BaseText>
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity
              onPress={handleCopyRecoveryCodes}
              style={styles.copyCodesLink}
            >
              <Ionicons
                name="copy-outline"
                size={16}
                color={Colors.primary}
                style={{ marginRight: 6 }}
              />
              <BaseText color={Colors.primary} variant="bold">
                Copy all codes
              </BaseText>
            </TouchableOpacity>

            <BaseButton
              title="Done"
              onPress={() => router.back()}
              style={styles.actionButton}
            />
          </View>
        </>
      )}

      {/* View: Active State info */}
      {step === "active" && (
        <>
          <BackHeader title="2FA Protection" />
          <View style={styles.activeContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="shield-checkmark" size={90} color="#5ED5A8" />
            </View>
            <BaseText variant="bold" color="#FFFFFF" style={styles.activeTitle}>
              Two-Factor Authentication is On
            </BaseText>
            <BaseText color="#8594A6" style={styles.activeDescription}>
              Your account is fully protected. A 6-digit verification code from
              your authenticator app is required during login.
            </BaseText>
            <BaseButton
              title="Disable 2FA"
              onPress={() => setStep("disable_form")}
              style={[
                styles.actionButton,
                { backgroundColor: "rgba(255, 90, 90, 0.1)" },
              ]}
              textStyle={{ color: Colors.error }}
            />
          </View>
        </>
      )}

      {/* View: Disable Form */}
      {step === "disable_form" && (
        <>
          <BackHeader title="Disable 2FA" />
          <BaseText color="#8594A6" style={styles.subtitle}>
            Enter your credentials to disable Two-Factor Authentication.
          </BaseText>

          <View style={{ gap: 20, marginBottom: 32 }}>
            {/* Password */}
            <View style={styles.inputGroup}>
              <BaseText variant="bold" color="#FFFFFF" style={styles.label}>
                Account Password
              </BaseText>
              <BaseInput
                placeholder="Enter password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                containerStyle={styles.authInput}
                style={{ color: "#FFFFFF" }}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off" : "eye"}
                      size={20}
                      color="#8594A6"
                    />
                  </TouchableOpacity>
                }
              />
            </View>

            {/* Authenticator Code */}
            <View style={styles.inputGroup}>
              <BaseText variant="bold" color="#FFFFFF" style={styles.label}>
                Authenticator Code
              </BaseText>
              <BaseInput
                placeholder="123456"
                keyboardType="numeric"
                maxLength={6}
                value={code}
                onChangeText={setCode}
                containerStyle={styles.authInput}
                style={{ color: "#FFFFFF", fontSize: 18, textAlign: "center" }}
              />
            </View>

            {/* Or Recovery Code */}
            <View style={styles.inputGroup}>
              <BaseText variant="bold" color="#FFFFFF" style={styles.label}>
                Or Recovery Code
              </BaseText>
              <BaseInput
                placeholder="A1B2C-D3E4F"
                value={recoveryCode}
                onChangeText={setRecoveryCode}
                containerStyle={styles.authInput}
                style={{ color: "#FFFFFF", textAlign: "center" }}
              />
            </View>
          </View>

          <BaseButton
            title="Confirm Disable"
            onPress={handleDisable2FA}
            isLoading={isDisabling}
            style={[styles.actionButton, { marginBottom: 12 }]}
          />

          <TouchableOpacity
            onPress={() => setStep("active")}
            style={styles.cancelLink}
          >
            <BaseText color="#8594A6" variant="bold">
              Cancel
            </BaseText>
          </TouchableOpacity>
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 32,
    lineHeight: 20,
  },
  introContent: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",
    paddingHorizontal: 10,
    marginTop: 40,
  },
  introTitle: {
    fontSize: 22,
    marginTop: 24,
    marginBottom: 12,
    textAlign: "center",
  },
  introDescription: {
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 40,
  },
  iconContainer: {
    alignItems: "center",
  },
  qrContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  qrCodeBox: {
    width: 180,
    height: 180,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  secretContainer: {
    backgroundColor: "#141820",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    marginBottom: 24,
  },
  secretRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  secretText: {
    letterSpacing: 1,
    flex: 1,
    marginRight: 12,
  },
  copyButton: {
    padding: 4,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
  },
  authInput: {
    backgroundColor: "#141820",
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  actionButton: {
    width: "100%",
    marginTop: 12,
    marginBottom: 40,
  },
  successContent: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },
  successTitle: {
    fontSize: 22,
    marginTop: 20,
    marginBottom: 24,
    textAlign: "center",
  },
  warningBox: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 209, 102, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 209, 102, 0.2)",
    padding: 14,
    borderRadius: 12,
    gap: 10,
    marginBottom: 24,
    alignItems: "flex-start",
  },
  warningText: {
    flex: 1,
    lineHeight: 18,
  },
  codesContainer: {
    width: "100%",
    backgroundColor: "#141820",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    padding: 20,
    marginBottom: 20,
  },
  codesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
  },
  codeItem: {
    width: "48%",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  copyCodesLink: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  activeContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    marginTop: 40,
  },
  activeTitle: {
    fontSize: 22,
    marginTop: 24,
    marginBottom: 12,
    textAlign: "center",
  },
  activeDescription: {
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 40,
  },
  cancelLink: {
    alignItems: "center",
    paddingVertical: 8,
    marginBottom: 40,
  },
});
