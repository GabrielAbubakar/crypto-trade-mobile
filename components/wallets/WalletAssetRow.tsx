import React from "react";
import { StyleSheet, View } from "react-native";
import { BaseText } from "../ui";
import type { WalletAsset } from "@/constants";

interface WalletAssetRowProps {
  asset: WalletAsset;
  balanceVisible: boolean;
}

export const WalletAssetRow: React.FC<WalletAssetRowProps> = ({
  asset,
  balanceVisible,
}) => {
  return (
    <View style={styles.assetRow}>
      {/* Left Col: Icon and Name/Ticker */}
      <View style={styles.leftCol}>
        <View style={styles.iconContainer}>
          <asset.Icon width={32} height={32} />
        </View>
        <View style={styles.nameStack}>
          <BaseText variant="bold" style={styles.assetName}>
            {asset.name}
          </BaseText>
          <BaseText style={styles.assetTicker}>{asset.ticker}</BaseText>
        </View>
      </View>

      {/* Right Col: Balance Amount & Value in USD */}
      <View style={styles.rightCol}>
        <BaseText variant="bold" style={styles.assetAmount}>
          {balanceVisible ? asset.amount : "••••••"}
        </BaseText>
        <BaseText style={styles.assetValue}>
          {balanceVisible ? asset.valueUsd : "••••••"}
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
    paddingVertical: 4,
  },
  leftCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  nameStack: {
    justifyContent: "center",
  },
  assetName: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 2,
  },
  assetTicker: {
    color: "#777777",
    fontSize: 12,
  },
  rightCol: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  assetAmount: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 2,
  },
  assetValue: {
    color: "#777777",
    fontSize: 12,
  },
});
