import React from "react";
import { StyleSheet, View } from "react-native";
import { BaseButton, BaseText } from "@/components/ui";
import { Colors, FontFamily } from "@/constants";
import type { IVerification } from "@/types";

interface KycNotStartedProps {
  verification?: IVerification;
  onStartVerification: () => void;
}

export function KycNotStarted({ verification, onStartVerification }: KycNotStartedProps) {
  return (
    <View style={styles.contentCard}>
      <View style={styles.badgeContainer}>
        <BaseText style={styles.badgeText}>
          Level {verification?.level}
        </BaseText>
      </View>
      <BaseText variant="bold" style={styles.mainTitle}>
        {verification?.label} account
      </BaseText>
      <BaseText style={styles.subtitle}>
        Browse markets now. Verify to trade, withdraw, and raise sandbox
        deposit limits.
      </BaseText>

      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <BaseText style={styles.infoLabel}>Trade limit</BaseText>
        <BaseText style={styles.lockedValue}>
          {verification?.limits.tradePerTransactionUsd}
        </BaseText>
      </View>
      <View style={styles.infoRow}>
        <BaseText style={styles.infoLabel}>Withdrawal limit</BaseText>
        <BaseText style={styles.lockedValue}>
          {verification?.limits.withdrawalPerTransactionUsd}
        </BaseText>
      </View>
      <View style={styles.infoRow}>
        <BaseText style={styles.infoLabel}>Sandbox deposit</BaseText>
        <BaseText style={styles.infoValue}>
          {verification?.limits.depositPerTransactionUsd.toLocaleString(
            "en-US",
            {
              style: "currency",
              currency: "USD",
            },
          )}
        </BaseText>
      </View>

      <BaseButton
        title="Start verification"
        onPress={onStartVerification}
        style={styles.actionButton}
      />

      <BaseText style={styles.bottomText}>
        You can continue browsing markets without verification.
      </BaseText>
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
  badgeContainer: {
    backgroundColor: "rgba(94, 213, 168, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    color: Colors.primary,
    fontSize: 12,
    fontFamily: FontFamily.bold,
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
  lockedValue: {
    fontSize: 14,
    fontFamily: FontFamily.bold,
    color: Colors.error,
  },
  actionButton: {
    width: "100%",
    marginTop: 24,
  },
  bottomText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 20,
  },
});
