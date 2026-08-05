import { useAssetIconUrl } from '@/shared/hooks/useAssetIconUrl';
import React from "react";
import { StyleSheet, View } from "react-native";
import { SvgUri } from "react-native-svg";
import { BaseText } from '@/shared/ui';

interface WalletAssetRowProps {
  assetSymbol: string;
  available: number;
  balanceVisible: boolean;
}

export const WalletAssetRow: React.FC<WalletAssetRowProps> = React.memo(({
  assetSymbol,
  available,
  balanceVisible,
}) => {
  const { iconUrl: resolvedUrl } = useAssetIconUrl(assetSymbol);

  return (
    <View style={styles.assetRow}>
      <View style={styles.assetLeft}>
        <View style={[styles.assetIcon]}>
          {resolvedUrl && (
            <SvgUri width={"100%"} height={"100%"} uri={resolvedUrl} />
          )}
        </View>
        <View style={styles.assetNameStack}>
          <BaseText variant="bold" style={styles.assetName}>
            {assetSymbol}
          </BaseText>
          <BaseText style={styles.assetSymbolText}>{assetSymbol}</BaseText>
        </View>
      </View>
      <View style={styles.assetRight}>
        <BaseText variant="bold" style={styles.assetValueText}>
          {balanceVisible
            ? available.toLocaleString("en-US", {
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
});

WalletAssetRow.displayName = "WalletAssetRow";

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
