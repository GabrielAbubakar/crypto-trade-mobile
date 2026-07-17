import { BaseButton, BaseText } from "@/shared/ui";
import { Colors, FontFamily } from "@/shared/constants";
import type { IVerification } from "@/shared/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

interface KycRejectedProps {
  verification?: IVerification;
  onResubmit: () => void;
}

export function KycRejected({ verification, onResubmit }: KycRejectedProps) {
  return (
    <View style={styles.contentCard}>
      <View
        style={[
          styles.statusIconContainer,
          { borderColor: Colors.error },
        ]}
      >
        <Ionicons name="close" size={40} color={Colors.error} />
      </View>

      <BaseText variant="bold" style={styles.mainTitle}>
        Try again
      </BaseText>

      <View style={styles.reasonCard}>
        <BaseText style={styles.reasonTitle}>Reason</BaseText>
        <BaseText style={styles.reasonText}>
          Document photo was blurry. Upload a clearer image with all
          corners visible.
        </BaseText>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <BaseText style={styles.infoLabel}>Current level</BaseText>
        <BaseText style={styles.infoValue}>
          {verification?.status}
        </BaseText>
      </View>

      <BaseButton
        title="Resubmit documents"
        variant="cancel"
        onPress={onResubmit}
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
  reasonCard: {
    backgroundColor: "rgba(255, 77, 77, 0.08)",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 77, 77, 0.2)",
    width: "100%",
    marginTop: 10,
  },
  reasonTitle: {
    fontSize: 14,
    color: Colors.error,
    fontFamily: FontFamily.bold,
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
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
