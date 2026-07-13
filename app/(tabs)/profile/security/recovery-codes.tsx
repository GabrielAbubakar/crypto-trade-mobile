import { BackHeader, BaseButton, BaseInput, ScreenContainer } from "@/components/ui";
import { BaseText } from "@/components/ui/BaseText";
import { Colors } from "@/core/constants";
import { useAppDispatch, useAppSelector } from "@/core/store/hooks";
import { clearRecoveryCodes, useRegenerate2FARecoveryCodesMutation } from "@/core/store/store";
import { showErrorToast, showSuccessToast } from "@/core/utils";
import { useGetProfileQuery } from "@/features/profile/api/profileApi";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

type Step = "view" | "regenerate";

export default function RecoveryCodesScreen() {
  const router = useRouter();
  const { data: profile, isLoading: isProfileLoading } = useGetProfileQuery();
  const { codes: codesParam } = useLocalSearchParams<{ codes?: string }>();

  const dispatch = useAppDispatch();
  const reduxCodes = useAppSelector((state) => state.temp.recoveryCodes);

  const [codes, setCodes] = useState<string[]>([]);
  const [step, setStep] = useState<Step>("view");

  // Regenerate Form Inputs
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [regenerate2FARecoveryCodes, { isLoading: isRegenerating }] =
    useRegenerate2FARecoveryCodesMutation();

  useEffect(() => {
    if (reduxCodes && reduxCodes.length > 0) {
      setCodes(reduxCodes);
      dispatch(clearRecoveryCodes());
    } else if (codesParam) {
      try {
        setCodes(JSON.parse(codesParam));
      } catch (e) {
        setCodes(codesParam.split(","));
      }
    }
  }, [reduxCodes, codesParam]);

  const handleRegeneratePress = () => {
    setPassword("");
    setCode("");
    setStep("regenerate");
  };

  const handleConfirmRegenerate = async () => {
    if (!password) {
      showErrorToast("Please enter your account password");
      return;
    }
    if (!code || code.length !== 6) {
      showErrorToast("Please enter a valid 6-digit authenticator code");
      return;
    }

    try {
      const res = await regenerate2FARecoveryCodes({ password, code }).unwrap();
      setCodes(res.recoveryCodes || []);
      setStep("view");
      showSuccessToast("Backup recovery codes regenerated successfully!");
    } catch (err: any) {
      showErrorToast(err?.data?.message || "Failed to regenerate recovery codes");
    }
  };

  const handleCopyAll = async () => {
    await Clipboard.setStringAsync(codes.join("\n"));
    showSuccessToast("All recovery codes copied to clipboard!");
  };

  if (isProfileLoading) {
    return (
      <ScreenContainer style={styles.container} withPadding={true}>
        <BackHeader title="Recovery codes" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  if (profile && !profile.twoFactorEnabled) {
    return (
      <ScreenContainer style={styles.container} withPadding={true}>
        <BackHeader title="Recovery codes" />
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons
              name="shield-outline"
              size={80}
              color={Colors.error}
            />
          </View>
          <BaseText variant="bold" color="#FFFFFF" style={styles.emptyTitle}>
            2FA Required
          </BaseText>
          <BaseText color="#8594A6" style={styles.emptyDescription}>
            You must enable Two-Factor Authentication (2FA) before accessing or
            regenerating your backup recovery codes.
          </BaseText>
          <BaseButton
            title="Set up 2FA"
            onPress={() => router.push("/profile/security/2fa")}
            style={styles.actionButton}
          />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      style={styles.container}
      withPadding={true}
      avoidKeyboard={true}
    >
      {step === "view" && codes.length > 0 && (
        <>
          <BackHeader title="Recovery codes" />

          <BaseText color="#8594A6" style={styles.subtitle}>
            Save these once. Each code can only be used one time.
          </BaseText>

          {/* Warning Box */}
          <View style={styles.warningBox}>
            <Ionicons name="warning-outline" size={20} color="#FFD166" />
            <BaseText size="sm" color="#FFD166" style={styles.warningText}>
              Keep these recovery codes secure. If you lose your authenticator
              app, these codes are the only way to log back in. Each code can
              only be used once.
            </BaseText>
          </View>

          {/* Grid of Codes */}
          <View style={styles.grid}>
            {codes.map((codeStr, index) => (
              <View key={index} style={styles.codeCard}>
                <BaseText variant="bold" color="#FFFFFF" style={styles.codeText}>
                  {codeStr}
                </BaseText>
              </View>
            ))}
          </View>

          <View style={styles.buttonContainer}>
            <BaseButton
              title="Copy codes"
              onPress={handleCopyAll}
              style={styles.copyButton}
            />
            <BaseButton
              title="Regenerate codes"
              variant="secondary"
              onPress={handleRegeneratePress}
              style={styles.regenerateButton}
            />
          </View>
        </>
      )}

      {step === "view" && codes.length === 0 && (
        <>
          <BackHeader title="Recovery codes" />
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Ionicons
                name="shield-checkmark-outline"
                size={80}
                color={Colors.primary}
              />
            </View>
            <BaseText variant="bold" color="#FFFFFF" style={styles.emptyTitle}>
              Codes already generated
            </BaseText>
            <BaseText color="#8594A6" style={styles.emptyDescription}>
              For your security, backup recovery codes can only be shown
              immediately after creation or regeneration. If you did not save
              them, you can regenerate a new set.
            </BaseText>
            <BaseButton
              title="Regenerate recovery codes"
              onPress={handleRegeneratePress}
              style={styles.actionButton}
            />
          </View>
        </>
      )}

      {step === "regenerate" && (
        <>
          <BackHeader title="Regenerate codes" onBack={() => setStep("view")} />

          <BaseText color="#8594A6" style={styles.subtitle}>
            Enter your credentials to regenerate your backup recovery codes.
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
          </View>

          <BaseButton
            title="Confirm Regenerate"
            onPress={handleConfirmRegenerate}
            isLoading={isRegenerating}
            style={[styles.actionButton, { marginBottom: 12 }]}
          />

          <TouchableOpacity
            onPress={() => setStep("view")}
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
  subtitle: {
    marginTop: 8,
    marginBottom: 32,
    lineHeight: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 40,
  },
  codeCard: {
    width: "47%",
    backgroundColor: "#141820",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  codeText: {
    fontSize: 15,
    letterSpacing: 0.5,
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 40,
  },
  copyButton: {
    width: "100%",
  },
  regenerateButton: {
    width: "100%",
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
  cancelLink: {
    alignItems: "center",
    paddingVertical: 8,
    marginBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 40,
  },
  emptyIconContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    marginBottom: 12,
    textAlign: "center",
  },
  emptyDescription: {
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
