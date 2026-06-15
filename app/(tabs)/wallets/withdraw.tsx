import {
  BackHeader,
  BaseInput,
  BaseText,
  ItemBgContainer,
  ScreenContainer,
} from "@/components";
import { Colors } from "@/constants";
import { useGetWalletBalancesQuery, useWithdrawMutation } from "@/store";
import { showErrorToast, showSuccessToast } from "@/utils";
import { Feather } from "@expo/vector-icons";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import type { TextInput } from "react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type WithdrawStep = "form" | "confirm" | "submitted";

export default function WithdrawScreen() {
  const router = useRouter();
  const [step, setStep] = useState<WithdrawStep>("form");

  // Form State
  const [network, setNetwork] = useState<string>("TRC20 sandbox network");
  const [pin, setPin] = useState<string>("");

  // API Integration
  const { data: balanceData } = useGetWalletBalancesQuery();
  const [withdraw, { isLoading: isSubmitting }] = useWithdrawMutation();
  const [txId, setTxId] = useState<string>("wd_8392");

  const usdtBalance =
    balanceData?.wallet.balances.find(
      (b) => b.assetSymbol.toUpperCase() === "USDT",
    )?.available ?? 1000.0;

  const pinRef = useRef<TextInput>(null);

  // TanStack Form Setup
  const form = useForm({
    defaultValues: {
      amount: "100.00",
      address: "TXYZk81s72hBsbda8K21",
    },
    onSubmit: async () => {
      setStep("confirm");
    },
  });

  // Focus PIN input when step changes to confirm
  useEffect(() => {
    if (step === "confirm") {
      setTimeout(() => pinRef.current?.focus(), 100);
    }
  }, [step]);

  const handleSubmitWithdrawal = useCallback(async () => {
    if (pin.length < 4) {
      showErrorToast("Please enter your 4-digit PIN.");
      return;
    }

    try {
      const response = await withdraw({
        amount: parseFloat(form.state.values.amount),
        symbol: "USDT",
        address: form.state.values.address,
        network: "TRC20",
      }).unwrap();

      if (response.success) {
        setTxId(
          response.transactionId ||
            `wd_${Math.floor(1000 + Math.random() * 9000)}`,
        );
        showSuccessToast("Withdrawal request submitted!");
        setStep("submitted");
      } else {
        showErrorToast(response.message || "Withdrawal failed.");
      }
    } catch (err: any) {
      showErrorToast(
        err?.data?.message || "An error occurred during withdrawal.",
      );
    }
  }, [pin, withdraw, form]);

  // Trigger submission when PIN is complete
  useEffect(() => {
    if (pin.length === 4 && step === "confirm") {
      handleSubmitWithdrawal();
    }
  }, [pin, step, handleSubmitWithdrawal]);

  const handleBack = () => {
    if (step === "confirm") {
      setStep("form");
      setPin("");
    } else if (step === "submitted") {
      router.replace("/(tabs)/wallets");
    } else {
      router.back();
    }
  };

  // Custom Step Header
  const renderHeader = (title: string, subtitle: string) => (
    <View style={styles.header}>
      <BackHeader title={title} />

      <BaseText style={styles.headerSubtitle}>{subtitle}</BaseText>
    </View>
  );

  return (
    <ScreenContainer
      avoidKeyboard={true}
      scrollable={true}
      keyboardVerticalOffset={40}
      style={styles.container}
    >
      {/* <View style={{ flex: 1 }}> */}
      {step === "form" && (
        <>
          {renderHeader(
            "Withdraw",
            "Withdrawals require verification and transaction PIN.",
          )}

          {balanceData?.verification.canTrade === false && (
            <ItemBgContainer
              style={{ marginBottom: 26 }}
              paddingHorizontal={22}
              paddingVertical={28}
            >
              <BaseText
                color={Colors.error}
                size="lg"
                variant="bold"
                style={{ marginBottom: 10 }}
              >
                Withdrawal unavailable
              </BaseText>
              <BaseText size="sm" color={Colors.textSecondary}>
                Your verification is not completed. You can not withdraw until
                it is completed.
              </BaseText>
            </ItemBgContainer>
          )}

          <View style={styles.formContent}>
            {/* Asset Display */}
            <View style={styles.inputGroup}>
              <BaseText style={styles.label}>Asset</BaseText>
              <BaseInput
                value={`USDT · Available ${usdtBalance.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
                editable={false}
                containerStyle={styles.disabledInput}
                style={{ color: "#777777" }}
              />
            </View>

            {/* Amount Input */}
            <View style={styles.inputGroup}>
              <BaseText style={styles.label}>Amount</BaseText>
              <form.Field
                name="amount"
                validators={{
                  onChange: ({ value }) => {
                    const num = parseFloat(value);
                    if (isNaN(num) || num <= 0) {
                      return "Please enter a valid amount.";
                    }
                    if (num > usdtBalance) {
                      return `Insufficient balance. Available: ${usdtBalance} USDT`;
                    }
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <BaseInput
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    keyboardType="numeric"
                    containerStyle={styles.activeInput}
                    style={{ color: "#FFFFFF" }}
                    placeholder="0.00"
                    error={
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0
                        ? field.state.meta.errors
                            .map((err: any) =>
                              typeof err === "string" ? err : err.message,
                            )
                            .join(", ")
                        : undefined
                    }
                  />
                )}
              </form.Field>
            </View>

            {/* Destination Address Input */}
            <View style={styles.inputGroup}>
              <BaseText style={styles.label}>Destination address</BaseText>
              <form.Field
                name="address"
                validators={{
                  onChange: ({ value }) => {
                    if (!value || !value.trim()) {
                      return "Please enter a destination address.";
                    }
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <BaseInput
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    containerStyle={styles.activeInput}
                    style={{ color: "#FFFFFF" }}
                    placeholder="Enter address"
                    error={
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0
                        ? field.state.meta.errors
                            .map((err: any) =>
                              typeof err === "string" ? err : err.message,
                            )
                            .join(", ")
                        : undefined
                    }
                  />
                )}
              </form.Field>
            </View>

            {/* Network Select */}
            <View style={styles.inputGroup}>
              <BaseText style={styles.label}>Network</BaseText>
              <BaseInput
                value={network}
                editable={false}
                containerStyle={styles.disabledInput}
                style={{ color: "#777777" }}
              />
            </View>

            {/* Verified limit label */}
            {/* <View style={styles.limitInfo}>
                <BaseText variant="bold" style={styles.limitTitle}>
                  Verified limit
                </BaseText>
                <BaseText style={styles.limitDescription}>
                  $2,500 per request · $10,000 daily
                </BaseText>
              </View> */}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => form.handleSubmit()}
              style={styles.actionBtn}
            >
              <BaseText variant="bold" style={styles.actionBtnText}>
                Preview withdrawal
              </BaseText>
            </TouchableOpacity>
          </View>
        </>
      )}

      {step === "confirm" && (
        <>
          {renderHeader(
            "Confirm withdrawal",
            "Review every detail before submitting.",
          )}

          <View style={styles.formContent}>
            <View style={styles.summaryContainer}>
              <BaseText variant="bold" style={styles.summaryAmount}>
                {parseFloat(form.state.values.amount).toFixed(2)} USDT
              </BaseText>
            </View>

            {/* Details table */}
            <View style={styles.detailsTable}>
              <View style={styles.detailsRow}>
                <BaseText style={styles.detailsLabel}>Asset</BaseText>
                <BaseText variant="bold" style={styles.detailsValue}>
                  USDT
                </BaseText>
              </View>
              <View style={styles.detailsRow}>
                <BaseText style={styles.detailsLabel}>Network</BaseText>
                <BaseText variant="bold" style={styles.detailsValue}>
                  TRC20
                </BaseText>
              </View>
              <View style={styles.detailsRow}>
                <BaseText style={styles.detailsLabel}>Address</BaseText>
                <BaseText variant="bold" style={styles.detailsValue}>
                  {form.state.values.address.length > 15
                    ? `${form.state.values.address.slice(0, 8)}...${form.state.values.address.slice(-6)}`
                    : form.state.values.address}
                </BaseText>
              </View>
              <View style={styles.detailsRow}>
                <BaseText style={styles.detailsLabel}>Fee</BaseText>
                <BaseText variant="bold" style={styles.detailsValue}>
                  1.00 USDT
                </BaseText>
              </View>
              <View
                style={[
                  styles.detailsRow,
                  { borderBottomWidth: 0, paddingBottom: 0 },
                ]}
              >
                <BaseText style={styles.detailsLabel}>You receive</BaseText>
                <BaseText
                  variant="bold"
                  style={[styles.detailsValue, { color: Colors.primary }]}
                >
                  {(parseFloat(form.state.values.amount) - 1.0).toFixed(2)} USDT
                </BaseText>
              </View>
            </View>

            {/* Pin Code Input Block */}
            <View style={styles.pinSection}>
              <BaseInput
                containerStyle={{ backgroundColor: Colors.cardBg }}
                placeholder="Transaction PIN"
              />
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSubmitWithdrawal}
              disabled={isSubmitting || pin.length < 4}
              style={[
                styles.actionBtn,
                (isSubmitting || pin.length < 4) && styles.disabledBtn,
              ]}
            >
              <BaseText variant="bold" style={styles.actionBtnText}>
                {isSubmitting ? "Submitting..." : "Submit withdrawal"}
              </BaseText>
            </TouchableOpacity>
          </View>
        </>
      )}

      {step === "submitted" && (
        <>
          {renderHeader(
            "Withdrawal submitted",
            "Finance review can approve or reject this request.",
          )}

          <View style={styles.formContent}>
            {/* Checkmark Indicator */}
            <View style={styles.successContainer}>
              <View style={styles.successCircle}>
                <Feather name="check" size={48} color={Colors.primary} />
              </View>
            </View>

            {/* Status table */}
            <View style={styles.detailsTable}>
              <View style={styles.detailsRow}>
                <BaseText style={styles.detailsLabel}>Status</BaseText>
                <BaseText variant="bold" style={{ color: Colors.warning }}>
                  Pending review
                </BaseText>
              </View>
              <View style={styles.detailsRow}>
                <BaseText style={styles.detailsLabel}>Amount</BaseText>
                <BaseText variant="bold" style={styles.detailsValue}>
                  {parseFloat(form.state.values.amount).toFixed(2)} USDT
                </BaseText>
              </View>
              <View style={styles.detailsRow}>
                <BaseText style={styles.detailsLabel}>Fee</BaseText>
                <BaseText variant="bold" style={styles.detailsValue}>
                  1.00 USDT
                </BaseText>
              </View>
              <View style={styles.detailsRow}>
                <BaseText style={styles.detailsLabel}>Reference</BaseText>
                <BaseText variant="bold" style={styles.detailsValue}>
                  {txId}
                </BaseText>
              </View>
              <View
                style={[
                  styles.detailsRow,
                  { borderBottomWidth: 0, paddingBottom: 0 },
                ]}
              >
                <BaseText style={styles.detailsLabel}>Created</BaseText>
                <BaseText variant="bold" style={styles.detailsValue}>
                  {new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </BaseText>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/wallets/transaction/[id]",
                  params: { id: txId },
                })
              }
              style={styles.actionBtn}
            >
              <BaseText variant="bold" style={styles.actionBtnText}>
                View transaction
              </BaseText>
            </TouchableOpacity>
          </View>
        </>
      )}
      {/* </View> */}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondary,
    flex: 1,
    paddingBottom: 50,
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
  },
  backButton: {
    paddingVertical: 4,
    marginBottom: 12,
    alignSelf: "flex-start",
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 24,
    marginBottom: 4,
  },
  headerSubtitle: {
    color: "#777777",
    fontSize: 14,
  },
  formContent: {
    gap: 16,
    marginBottom: 20,
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
  limitInfo: {
    backgroundColor: "rgba(255,255,255,0.02)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
    marginTop: 8,
  },
  limitTitle: {
    color: Colors.white,
    fontSize: 14,
    marginBottom: 4,
  },
  limitDescription: {
    color: "#777777",
    fontSize: 13,
  },
  summaryContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  summaryAmount: {
    color: Colors.white,
    fontSize: 36,
  },
  detailsTable: {
    backgroundColor: "#141820",
    borderRadius: 20,
    padding: 20,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 14,
    marginBottom: 14,
  },
  detailsLabel: {
    color: "#777777",
    fontSize: 14,
  },
  detailsValue: {
    color: Colors.white,
    fontSize: 14,
  },
  pinSection: {
    alignItems: "center",
    marginTop: 10,
  },
  pinLabel: {
    color: "#777777",
    fontSize: 14,
    marginBottom: 16,
  },
  pinDotsRow: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "center",
    padding: 10,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    backgroundColor: "transparent",
  },
  pinDotFilled: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  hiddenInput: {
    position: "absolute",
    width: 0,
    height: 0,
    opacity: 0,
  },
  successContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  successCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(94, 213, 168, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  footer: {
    paddingBottom: 40,
    marginTop: 10,
  },
  actionBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnText: {
    color: Colors.secondary,
    fontSize: 16,
  },
  disabledBtn: {
    opacity: 0.5,
  },
});
