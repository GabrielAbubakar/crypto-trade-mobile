import { BaseButton, BaseText } from "@/shared/ui";
import { Colors, FontFamily } from "@/shared/constants";
import type { IVerification } from "@/shared/types";
import { formatCurrency } from "@/shared/utils";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

interface KycApprovedProps {
  verification?: IVerification;
  onStartTrading: () => void;
}

export function KycApproved({ verification, onStartTrading }: KycApprovedProps) {
  return (
    <View style={styles.contentCard}>
      <View
        style={[
          styles.statusIconContainer,
          { borderColor: Colors.primary },
        ]}
      >
        <Ionicons name="checkmark" size={40} color={Colors.primary} />
      </View>

      <BaseText variant="bold" style={styles.mainTitle}>
        Level 2 unlocked
      </BaseText>

      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <BaseText style={styles.infoLabel}>Trade per quote</BaseText>
        <BaseText style={styles.infoValue}>
          {formatCurrency(
            verification?.limits.tradePerTransactionUsd,
          )}
        </BaseText>
      </View>
      <View style={styles.infoRow}>
        <BaseText style={styles.infoLabel}>Withdrawal request</BaseText>
        <BaseText style={styles.infoValue}>
          {formatCurrency(
            verification?.limits.withdrawalPerTransactionUsd,
          )}
        </BaseText>
      </View>
      <View style={styles.infoRow}>
        <BaseText style={styles.infoLabel}>Daily withdrawal</BaseText>
        <BaseText style={styles.infoValue}>
          {formatCurrency(
            verification?.limits.dailyWithdrawalUsd,
          )}
        </BaseText>
      </View>

      <BaseButton
        title="Start trading"
        onPress={onStartTrading}
        style={styles.actionButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contentCard: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
  },
  statusIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 12,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    marginVertical: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 14,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: FontFamily.bold,
  },
  actionButton: {
    width: "100%",
    marginTop: 24,
  },
});
