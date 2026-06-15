import { Colors } from "@/constants";
import React from "react";
import { StyleSheet, View } from "react-native";
import { BaseText } from "../ui";

interface WalletAssetRowProps {
  assetSymbol: string;
  available: number;
  balanceVisible: boolean;
}

export const WalletAssetRow: React.FC<WalletAssetRowProps> = ({
  assetSymbol,
  available,
  balanceVisible,
}) => {
  const getAssetDetails = (symbol: string, balance: number) => {
    switch (symbol.toUpperCase()) {
      case "USDT":
        return {
          name: "Tether",
          sub: "USDT",
          iconLetter: "U",
          iconBg: "rgba(94, 213, 168, 0.15)",
          iconColor: Colors.primary,
          valueUsd: balance * 2.45,
        };
      case "BTC":
        return {
          name: "Bitcoin",
          sub: "BTC",
          iconLetter: "B",
          iconBg: "rgba(255, 178, 54, 0.15)",
          iconColor: Colors.warning,
          valueUsd: balance * 64200.5,
        };
      case "ETH":
        return {
          name: "Ethereum",
          sub: "ETH",
          iconLetter: "E",
          iconBg: "rgba(56, 97, 251, 0.15)",
          iconColor: Colors.info,
          valueUsd: balance * 3420.0,
        };
      default:
        return {
          name: symbol,
          sub: symbol,
          iconLetter: symbol.charAt(0),
          iconBg: "rgba(255, 255, 255, 0.1)",
          iconColor: "#FFFFFF",
          valueUsd: balance * 1.0,
        };
    }
  };

  const details = getAssetDetails(assetSymbol, available);

  return (
    <View style={styles.assetRow}>
      <View style={styles.assetLeft}>
        <View style={[styles.assetIcon, { backgroundColor: details.iconBg }]}>
          <BaseText
            variant="bold"
            style={{ color: details.iconColor, fontSize: 16 }}
          >
            {details.iconLetter}
          </BaseText>
        </View>
        <View style={styles.assetNameStack}>
          <BaseText variant="bold" style={styles.assetName}>
            {details.name}
          </BaseText>
          <BaseText style={styles.assetSymbolText}>{details.sub}</BaseText>
        </View>
      </View>
      <View style={styles.assetRight}>
        <BaseText variant="bold" style={styles.assetValueText}>
          {balanceVisible
            ? details.valueUsd.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })
            : "••••••"}
        </BaseText>
        <BaseText style={styles.assetAmountText}>
          {balanceVisible
            ? `${available.toLocaleString("en-US", {
                maximumFractionDigits: 6,
              })} ${assetSymbol}`
            : "••••••"}
        </BaseText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  assetRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  assetLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  assetIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  assetNameStack: {
    justifyContent: "center",
  },
  assetName: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 2,
  },
  assetSymbolText: {
    color: "#777777",
    fontSize: 12,
  },
  assetRight: {
    alignItems: "flex-end",
  },
  assetValueText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 2,
  },
  assetAmountText: {
    color: "#777777",
    fontSize: 12,
  },
});
