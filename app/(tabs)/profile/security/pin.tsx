import { BackHeader, BaseButton, ScreenContainer } from "@/components";
import { BaseText } from "@/components/ui/BaseText";
import { Colors } from "@/constants";
import { useUpdateTransactionPinMutation } from "@/store";
import { showSuccessToast, showErrorToast } from "@/utils";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

export default function TransactionPinScreen() {
  const router = useRouter();
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [updatePin, { isLoading }] = useUpdateTransactionPinMutation();

  const handleUpdatePin = async () => {
    if (!currentPin || !newPin || !confirmPin) {
      showErrorToast("All fields are required");
      return;
    }

    if (newPin.length !== 4 || confirmPin.length !== 4 || currentPin.length !== 4) {
      showErrorToast("PIN must be exactly 4 digits");
      return;
    }

    if (newPin !== confirmPin) {
      showErrorToast("New PIN and Confirm PIN do not match");
      return;
    }

    try {
      await updatePin({ pin: newPin }).unwrap();
      showSuccessToast("Transaction PIN updated successfully");
      router.back();
    } catch (err: any) {
      showErrorToast(err?.data?.message || "Failed to update transaction PIN");
    }
  };

  return (
    <ScreenContainer style={styles.container} withPadding={true}>
      <BackHeader title="Transaction PIN" />

      <BaseText color="#8594A6" style={styles.subtitle}>
        Update the PIN used for trade and withdrawal confirmations.
      </BaseText>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <BaseText variant="bold" color="#FFFFFF" style={styles.label}>
            Current PIN
          </BaseText>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
            value={currentPin}
            onChangeText={setCurrentPin}
            placeholder="••••"
            placeholderTextColor="#4E586E"
          />
        </View>

        <View style={styles.inputGroup}>
          <BaseText variant="bold" color="#FFFFFF" style={styles.label}>
            New PIN
          </BaseText>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
            value={newPin}
            onChangeText={setNewPin}
            placeholder="••••"
            placeholderTextColor="#4E586E"
          />
        </View>

        <View style={styles.inputGroup}>
          <BaseText variant="bold" color="#FFFFFF" style={styles.label}>
            Confirm PIN
          </BaseText>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
            value={confirmPin}
            onChangeText={setConfirmPin}
            placeholder="••••"
            placeholderTextColor="#4E586E"
          />
        </View>
      </View>

      {/* PIN Rules */}
      <View style={styles.rulesBox}>
        <BaseText variant="bold" color="#8594A6" style={styles.rulesTitle}>
          PIN rules
        </BaseText>
        <BaseText size="sm" color="#8594A6" style={styles.rulesText}>
          Use four digits. Avoid repeated or obvious numbers.
        </BaseText>
      </View>

      <BaseButton
        title="Update PIN"
        onPress={handleUpdatePin}
        isLoading={isLoading}
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
    marginBottom: 24,
    lineHeight: 20,
  },
  form: {
    gap: 20,
    marginBottom: 30,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
  },
  input: {
    backgroundColor: "#141820",
    borderRadius: 16,
    padding: 16,
    color: "#FFFFFF",
    fontSize: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  rulesBox: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.04)",
    marginBottom: 32,
  },
  rulesTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  rulesText: {
    lineHeight: 18,
  },
  actionButton: {
    width: "100%",
    marginBottom: 40,
  },
});
