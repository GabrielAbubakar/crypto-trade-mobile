import { Colors } from "@/shared/constants";
import type { IMarketAsset } from "@/shared/types";
import React from "react";
import { StyleSheet, View } from "react-native";
import { BaseText } from '@/shared/ui';

export const CoinCard: React.FC<IMarketAsset> = ({ symbol, change24h }) => {
  return (
    <View style={styles.coinCard}>
      <BaseText style={styles.symbol}>{symbol}</BaseText>
      <BaseText variant="bold" style={styles.change}>
        {change24h >= 0 ? "+" : ""}
        {change24h.toFixed(1)}%
      </BaseText>
    </View>
  );
};

const styles = StyleSheet.create({
  coinCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  symbol: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  change: {
    color: Colors.white,
    fontSize: 16,
  },
});
