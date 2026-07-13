import { BaseButton, BaseText } from "@/components/ui";
import { Colors, FontFamily } from "@/core/constants";
import type { IVerification } from "@/core/types";
import { formatCurrency } from "@/core/utils";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

interface KycPendingProps {
  verification?: IVerification;
  onBackToHome: () => void;
}

export function KycPending({ verification, onBackToHome }: KycPendingProps) {
  return (
    <View style={styles.contentCard}>
      <View
        style={[styles.statusIconContainer, { borderColor: "#D4AF37" }]}
      >
        <Ionicons name="ellipsis-horizontal" size={40} color="#D4AF37" />
      </View>

      <BaseText variant="bold" style={styles.mainTitle}>
        {verification?.label}
      </BaseText>
      <BaseText style={styles.subtitle}>
        You can browse markets while we review your documents. Trading and
        withdrawals stay locked.
      </BaseText>

      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <BaseText style={styles.infoLabel}>Current level</BaseText>
        <BaseText style={styles.infoValue}>
          {verification?.level}
        </BaseText>
      </View>
      <View style={styles.infoRow}>
        <BaseText style={styles.infoLabel}>Sandbox deposit</BaseText>
        <BaseText style={styles.infoValue}>
          {formatCurrency(
            verification?.limits.depositPerTransactionUsd,
          )}
        </BaseText>
      </View>

      <BaseButton
        title="Back to home"
        variant="primary"
        onPress={onBackToHome}
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
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
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
