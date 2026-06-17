import { BaseText } from "@/components/ui/BaseText";
import { Colors, FontFamily } from "@/constants";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

interface TradeDetailsCardProps {
  isBalanceLoading: boolean;
  isPricesLoading: boolean;
  currentAvailable: number;
  fromAsset: string;
  estimatedRateText: string;
  activeTab: "buy" | "sell" | "swap";
}

export const TradeDetailsCard: React.FC<TradeDetailsCardProps> = ({
  isBalanceLoading,
  isPricesLoading,
  currentAvailable,
  fromAsset,
  estimatedRateText,
  activeTab,
}) => {
  return (
    <View style={styles.detailsCard}>
      <View style={styles.detailsRow}>
        <BaseText style={styles.detailLabel}>Available</BaseText>
        {isBalanceLoading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <BaseText style={styles.detailValue}>
            {currentAvailable.toFixed(4)} {fromAsset}
          </BaseText>
        )}
      </View>

      <View style={styles.detailsRow}>
        <BaseText style={styles.detailLabel}>Estimated rate</BaseText>
        {isPricesLoading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <BaseText style={styles.detailValue}>{estimatedRateText}</BaseText>
        )}
      </View>

      <View style={styles.detailsRow}>
        <BaseText style={styles.detailLabel}>
          {activeTab === "swap" ? "Quote expires" : "Verification limit"}
        </BaseText>
        <BaseText style={[styles.detailValue, { color: Colors.primary }]}>
          {activeTab === "swap" ? "30 seconds" : "$5,000"}
        </BaseText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  detailsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.04)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 24,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.04)",
  },
  detailLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: 13,
    color: Colors.white,
    fontFamily: FontFamily.bold,
  },
});
