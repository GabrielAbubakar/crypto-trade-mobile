import { Colors } from "@/constants";
import { formatCurrency } from "@/utils";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {
  BackHeader,
  BaseButton,
  BaseInput,
  BaseText,
  ItemBgContainer,
} from "../../ui";


interface WithdrawFormStepProps {
  balanceData: any;
  profileData: any;
  form: any;
  selectedSymbol: string;
  selectedBalance: number;
  network: string;
  setNetwork: (network: string) => void;
  onSelectAssetPress: () => void;
  onBack: () => void;
}

export function WithdrawFormStep({
  balanceData,
  profileData,
  form,
  selectedSymbol,
  selectedBalance,
  network,
  setNetwork,
  onSelectAssetPress,
  onBack,
}: WithdrawFormStepProps) {
  return (
    <>
      <View style={styles.header}>
        <BackHeader title="Withdraw" onBack={onBack} />
        <BaseText style={styles.headerSubtitle}>
          Withdrawals require verification.
        </BaseText>
      </View>

      {balanceData?.verification.canWithdraw === false && (
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
            Your verification is not completed. You can not withdraw until it is
            completed.
          </BaseText>
        </ItemBgContainer>
      )}

      <View style={styles.formContent}>
        {/* Asset Display */}
        <View style={styles.inputGroup}>
          <BaseText style={styles.label}>Asset</BaseText>
          <TouchableOpacity activeOpacity={0.7} onPress={onSelectAssetPress}>
            <View pointerEvents="none">
              <BaseInput
                value={`${selectedSymbol} · Available ${selectedBalance.toLocaleString(
                  "en-US",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6,
                  },
                )}`}
                editable={false}
                containerStyle={styles.activeInput}
                style={{ color: "#FFFFFF" }}
                rightIcon={
                  <Feather name="chevron-down" size={20} color="#777777" />
                }
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Amount Input */}
        <View style={styles.inputGroup}>
          <BaseText style={styles.label}>Amount</BaseText>
          <form.Field
            name="amount"
            validators={{
              onChange: ({ value }: { value: string }) => {
                const num = parseFloat(value);
                if (isNaN(num) || num <= 0) {
                  return "Please enter a valid amount.";
                }
                if (num > selectedBalance) {
                  return `Insufficient balance. Available: ${selectedBalance.toLocaleString(
                    "en-US",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    },
                  )} ${selectedSymbol}`;
                }
                return undefined;
              },
            }}
          >
            {(field: any) => (
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
              onChange: ({ value }: { value: string }) => {
                if (!value || !value.trim()) {
                  return "Please enter a destination address.";
                }
                return undefined;
              },
            }}
          >
            {(field: any) => (
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
            onChangeText={setNetwork}
            containerStyle={styles.activeInput}
            style={{ color: "#FFFFFF" }}
            placeholder="Enter network"
          />
        </View>

        {/* Verified limit label */}
        <View style={styles.limitInfo}>
          <BaseText variant="bold" style={styles.limitTitle}>
            Verified limit
          </BaseText>
          <BaseText style={styles.limitDescription}>
            {formatCurrency(
              profileData?.verification.limits.withdrawalPerTransactionUsd!,
              {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              },
            )}{" "}
            per request ·{" "}
            {formatCurrency(
              profileData?.verification.limits.dailyWithdrawalUsd!,
              {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              },
            )}{" "}
            daily
          </BaseText>
        </View>
      </View>

      <View style={styles.footer}>
        <BaseButton
          title="Preview withdrawal"
          disabled={!profileData?.verification.canWithdraw}
          onPress={() => form.handleSubmit()}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 20,
    marginBottom: 20,
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
  footer: {
    paddingBottom: 40,
    marginTop: 10,
  },
});
