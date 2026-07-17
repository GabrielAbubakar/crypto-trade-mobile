import Background from "@/assets/images/auth-background.png";
import { BaseButton, BaseInput, BaseText, ScreenContainer } from "@/shared/ui";
import { Colors } from "@/shared/constants";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials, useVerify2FAMutation } from "@/store/store";
import { showToast } from "@/shared/utils";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

export default function RecoveryScreen() {
  const dispatch = useAppDispatch();
  const { challengeId } = useLocalSearchParams<{
    challengeId: string;
  }>();

  const [verify2FA, { isLoading: isVerifying }] = useVerify2FAMutation();
  const [recoveryCode, setRecoveryCode] = useState("");
  const [error, setError] = useState("");

  const handleContinue = async () => {
    if (!recoveryCode.trim()) {
      setError("Please enter your recovery code");
      return;
    }
    setError("");

    try {
      const res = await verify2FA({
        challengeId,
        recoveryCode: recoveryCode.trim(),
      }).unwrap();

      if (res && "accessToken" in res) {
        showToast("success", "Signed in successfully.");
        dispatch(
          setCredentials({
            user: res.user,
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
          }),
        );
        router.replace("/(tabs)/home");
      }
    } catch (err: any) {
      setError(err?.data?.message || "Verification failed");
      showToast("error", err?.data?.message || "Verification failed");
    }
  };

  return (
    <ScreenContainer
      scrollable={false}
      withPadding={true}
      avoidKeyboard={false}
      style={styles.container}
    >
      <Image
        source={Background}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "120%",
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
      >
        <View style={{ flex: 1 }}>
          {/* Back Button Header */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
            <BaseText variant="bold" style={styles.backButtonText}>
              2FA Verification
            </BaseText>
          </TouchableOpacity>

          <View style={styles.content}>
            <BaseText variant="bold" style={styles.title}>
              Recovery Code
            </BaseText>
            <BaseText style={styles.subtitle}>
              Enter your 2FA recovery code to log in. This will bypass the
              authenticator code.
            </BaseText>

            {/* Recovery Code Input */}
            <View style={styles.inputGroup}>
              <BaseText variant="bold" color="#FFFFFF" style={styles.label}>
                Recovery Code
              </BaseText>
              <BaseInput
                placeholder="A1B2C-D3E4F"
                value={recoveryCode}
                onChangeText={(text) => {
                  setRecoveryCode(text);
                  if (error) setError("");
                }}
                containerStyle={styles.authInput}
                style={{ color: "#FFFFFF", textAlign: "center" }}
                autoCapitalize="characters"
                autoCorrect={false}
              />
            </View>

            {error ? (
              <BaseText style={styles.errorText}>{error}</BaseText>
            ) : null}
          </View>

          <BaseButton
            title="Verify & Sign In"
            onPress={handleContinue}
            isLoading={isVerifying}
            style={styles.submitButton}
          />
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
    paddingTop: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  backButtonText: {
    color: Colors.white,
    fontSize: 16,
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    color: Colors.white,
    marginBottom: 10,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#A7AFB7",
    lineHeight: 20,
    marginBottom: 40,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  authInput: {
    backgroundColor: "#161C22",
    height: 56,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#252E38",
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    textAlign: "center",
    marginTop: 15,
  },
  submitButton: {
    height: 56,
    borderRadius: 15,
    marginBottom: 30,
  },
});
