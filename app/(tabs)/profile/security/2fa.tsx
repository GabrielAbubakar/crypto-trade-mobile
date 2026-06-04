import { BackHeader, BaseButton, ScreenContainer } from "@/components";
import { BaseText } from "@/components/ui/BaseText";
import { Colors } from "@/constants";
import { showSuccessToast, showErrorToast } from "@/utils";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, TextInput, View, TouchableOpacity, Clipboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TwoFactorScreen() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const secretKey = "JBSW Y3DP EHPK 3PXP";

  const handleCopy = () => {
    Clipboard.setString(secretKey);
    showSuccessToast("Secret key copied to clipboard!");
  };

  const handleEnable2FA = async () => {
    if (!code || code.length !== 6) {
      showErrorToast("Please enter a valid 6-digit authenticator code");
      return;
    }

    setIsSubmitting(true);
    // Mock enable 2FA timeout
    setTimeout(() => {
      setIsSubmitting(false);
      showSuccessToast("Two-Factor Authentication (2FA) enabled successfully!");
      router.back();
    }, 1200);
  };

  return (
    <ScreenContainer style={styles.container} withPadding={true}>
      <BackHeader title="Set up 2FA" />

      <BaseText color="#8594A6" style={styles.subtitle}>
        Scan the code, then enter your authenticator code.
      </BaseText>

      {/* Styled Mock QR Code */}
      <View style={styles.qrContainer}>
        <View style={styles.qrCodeBox}>
          {/* A grid of dots replicating a mini QR code */}
          <View style={styles.qrGrid}>
            {Array.from({ length: 25 }).map((_, i) => {
              const isFilled = (i % 2 === 0 && i % 3 !== 0) || i === 0 || i === 4 || i === 20 || i === 24;
              return (
                <View
                  key={i}
                  style={[
                    styles.qrDot,
                    { backgroundColor: isFilled ? "#FFFFFF" : "transparent" },
                  ]}
                />
              );
            })}
          </View>
        </View>
      </View>

      {/* Secret Key Display */}
      <View style={styles.secretContainer}>
        <BaseText size="xs" color="#8594A6">
          Secret
        </BaseText>
        <View style={styles.secretRow}>
          <BaseText variant="bold" size="md" color="#FFFFFF" style={styles.secretText}>
            {secretKey}
          </BaseText>
          <TouchableOpacity onPress={handleCopy} style={styles.copyButton}>
            <Ionicons name="copy-outline" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Code Input */}
      <View style={styles.inputGroup}>
        <BaseText variant="bold" color="#FFFFFF" style={styles.label}>
          Authenticator code
        </BaseText>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          maxLength={6}
          value={code}
          onChangeText={setCode}
          placeholder="123456"
          placeholderTextColor="#4E586E"
        />
      </View>

      <BaseButton
        title="Enable 2FA"
        onPress={handleEnable2FA}
        isLoading={isSubmitting}
        style={styles.actionButton}
      />
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
  qrContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  qrCodeBox: {
    width: 140,
    height: 140,
    backgroundColor: "#141820",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  qrGrid: {
    width: 80,
    height: 80,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignContent: "space-between",
  },
  qrDot: {
    width: 12,
    height: 12,
    borderRadius: 3,
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
    fontFamily: "Courier", // Monospace feel
    letterSpacing: 1,
  },
  copyButton: {
    padding: 4,
  },
  inputGroup: {
    gap: 8,
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
  },
  input: {
    backgroundColor: "#141820",
    borderRadius: 16,
    padding: 16,
    color: "#FFFFFF",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    textAlign: "center",
    letterSpacing: 4,
    fontWeight: "bold",
  },
  actionButton: {
    width: "100%",
    marginBottom: 40,
  },
});
