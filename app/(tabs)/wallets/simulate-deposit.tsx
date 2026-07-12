import { BackHeader, BaseInput, BaseText, ScreenContainer } from "@/components";
import { Colors } from "@/constants";
import { useSimulateDepositMutation } from "@/store";
import { showErrorToast, showSuccessToast } from "@/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function SimulateDepositScreen() {
  const router = useRouter();
  const { symbol } = useLocalSearchParams<{ symbol: string }>();
  const assetSymbol = symbol;

  const [amount, setAmount] = useState<string>("");
  const [settlementDelaySeconds, setSettlementDelaySeconds] =
    useState<number>(10);
  const [simulateDeposit, { isLoading }] = useSimulateDepositMutation();

  const handleCreateDeposit = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      showErrorToast("Please enter a valid deposit amount.");
      return;
    }

    try {
      const response = await simulateDeposit({
        amount: numAmount,
        symbol: assetSymbol,
        settlementDelaySeconds,
      }).unwrap();

      if (response && response.transaction) {
        showSuccessToast("Deposit simulation initiated!");
        // Navigate to the transaction list screen
        router.push("/(tabs)/wallets/transactions");
      } else {
        showErrorToast("Failed to simulate deposit.");
      }
    } catch (err: any) {
      showErrorToast(
        err?.data?.message || "An error occurred during simulation.",
      );
    }
  };

  return (
    <ScreenContainer scrollable={false} style={styles.container}>
      <View style={styles.content}>
        <BackHeader title="Simulate deposit" />
        <BaseText style={styles.subtitle}>
          Create a pending {assetSymbol} deposit for testing polling and
          receipts.
        </BaseText>

        <View style={styles.formContainer}>
          {/* Asset Symbol input */}
          <View style={styles.inputGroup}>
            <BaseText style={styles.label}>Asset</BaseText>
            <BaseInput
              value={assetSymbol}
              editable={false}
              containerStyle={styles.disabledInput}
              style={{ color: "#777777" }}
            />
          </View>

          {/* Amount input */}
          <View style={styles.inputGroup}>
            <BaseText style={styles.label}>Amount</BaseText>
            <BaseInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              containerStyle={styles.activeInput}
              style={{ color: "#FFFFFF" }}
              placeholder="0.00"
            />
          </View>

          {/* Settlement Delay input */}
          <View style={styles.inputGroup}>
            <BaseText style={styles.label}>Settlement delay</BaseText>
            <BaseInput
              value={settlementDelaySeconds.toLocaleString()}
              editable={false}
              containerStyle={styles.disabledInput}
              style={{ color: "#777777" }}
            />
          </View>

          {/* Deposit Preview card */}
          <View style={styles.previewCard}>
            <BaseText variant="bold" style={styles.previewTitle}>
              Deposit preview
            </BaseText>
            <BaseText variant="bold" style={styles.previewAmount}>
              +{amount ? parseFloat(amount).toFixed(2) : "0.00"} {assetSymbol}
            </BaseText>
            <BaseText style={styles.previewDescription}>
              Status starts as pending, then completes automatically.
            </BaseText>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleCreateDeposit}
          disabled={isLoading}
          style={styles.submitBtn}
        >
          <BaseText variant="bold" style={styles.submitBtnText}>
            {isLoading ? "Creating..." : "Create sandbox deposit"}
          </BaseText>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondary,
    flex: 1,
  },
  content: {
    // flex: 1,
    marginTop: 20,
  },
  subtitle: {
    color: "#777777",
    fontSize: 14,
    marginTop: -8,
    marginBottom: 24,
  },
  formContainer: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    color: "#777777",
    fontSize: 12,
    marginLeft: 4,
  },
  disabledInput: {
    backgroundColor: "#161C22",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  activeInput: {
    backgroundColor: "#141820",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  previewCard: {
    backgroundColor: "rgba(94, 213, 168, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(94, 213, 168, 0.15)",
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
  },
  previewTitle: {
    color: "#777777",
    fontSize: 12,
    marginBottom: 8,
  },
  previewAmount: {
    color: Colors.primary,
    fontSize: 20,
    marginBottom: 4,
  },
  previewDescription: {
    color: "#777777",
    fontSize: 12,
    lineHeight: 16,
  },
  footer: {
    paddingBottom: 40,
    marginTop: 30,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnText: {
    color: Colors.secondary,
    fontSize: 16,
  },
});
