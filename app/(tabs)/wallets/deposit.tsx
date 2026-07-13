import { BackHeader, BaseText, ScreenContainer } from "@/components/ui";
import { Colors } from "@/core/constants";
import { useAssetIconUrl } from "@/core/hooks";
import type { IWalletDepositAddress } from "@/core/types";
import { useGetWalletBalancesQuery } from "@/features/wallet/api/walletApi";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SvgUri } from "react-native-svg";

interface AssetOptionCardProps {
  asset: IWalletDepositAddress;
  isSelected: boolean;
  onPress: () => void;
}

function AssetOptionCard({ asset, isSelected, onPress }: AssetOptionCardProps) {
  const { iconUrl: resolvedUrl } = useAssetIconUrl(asset.assetSymbol);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.optionCard, isSelected && styles.optionCardSelected]}
    >
      <View style={styles.optionLeft}>
        <View style={styles.iconContainer}>
          {resolvedUrl && (
            <SvgUri width={"100%"} height={"100%"} uri={resolvedUrl} />
          )}
        </View>
        <View style={styles.assetDetails}>
          <BaseText variant="bold" style={styles.assetName}>
            {asset.network}
          </BaseText>
          <BaseText style={styles.assetNetwork}>
            {asset.assetSymbol} · {asset.network}
          </BaseText>
        </View>
      </View>
      <View style={styles.optionRight}>
        {/* <BaseText variant="bold" style={styles.assetPrice}>
          {asset.}
        </BaseText> */}
        {/* <BaseText
          style={[
            styles.assetStatus,
            isSelected
              ? { color: Colors.primary }
              : { color: "#777777" },
          ]}
        >
          {asset.}
        </BaseText> */}
      </View>
    </TouchableOpacity>
  );
}

export default function DepositSelectScreen() {
  const router = useRouter();
  const { data: assets } = useGetWalletBalancesQuery();
  const [selectedAsset, setSelectedAsset] = useState<string>(
    assets?.wallet.depositAddresses?.[0].assetSymbol || "",
  );

  const handleContinue = () => {
    router.push({
      pathname: "/(tabs)/wallets/deposit-details",
      params: { symbol: selectedAsset },
    });
  };

  return (
    <ScreenContainer scrollable={true} style={styles.container}>
      <View style={styles.content}>
        <BackHeader title="Deposit" />
        <BaseText style={styles.subtitle}>
          Choose the asset you want to fund in sandbox mode.
        </BaseText>

        <View style={styles.listContainer}>
          {assets?.wallet.depositAddresses.map((asset) => (
            <AssetOptionCard
              key={asset.assetSymbol}
              asset={asset}
              isSelected={selectedAsset === asset.assetSymbol}
              onPress={() => setSelectedAsset(asset.assetSymbol)}
            />
          ))}
        </View>

        {/* Sandbox explanation box */}
        <View style={styles.sandboxBox}>
          <BaseText variant="bold" style={styles.sandboxTitle}>
            Sandbox only
          </BaseText>
          <BaseText style={styles.sandboxDescription}>
            Deposits create demo ledger entries for class exercises. Do not send
            real funds.
          </BaseText>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleContinue}
          style={styles.continueBtn}
        >
          <BaseText variant="bold" style={styles.continueBtnText}>
            Continue with {selectedAsset}
          </BaseText>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondary,
    paddingBottom: 60,
  },
  content: {
    marginTop: 20,
  },
  subtitle: {
    color: "#777777",
    fontSize: 14,
    marginTop: -8,
    marginBottom: 24,
  },
  listContainer: {
    gap: 12,
    marginBottom: 28,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#161C22",
    borderRadius: 16,
    padding: 16,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  optionCardSelected: {
    borderColor: Colors.primary,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  assetDetails: {
    justifyContent: "center",
  },
  assetName: {
    color: Colors.white,
    fontSize: 16,
    marginBottom: 2,
  },
  assetNetwork: {
    color: "#777777",
    fontSize: 12,
  },
  optionRight: {
    alignItems: "flex-end",
  },
  assetPrice: {
    color: Colors.white,
    fontSize: 16,
    marginBottom: 2,
  },
  assetStatus: {
    fontSize: 12,
  },
  sandboxBox: {
    backgroundColor: "rgba(255,255,255,0.02)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
    marginBottom: 20,
  },
  sandboxTitle: {
    color: Colors.white,
    fontSize: 14,
    marginBottom: 4,
  },
  sandboxDescription: {
    color: "#777777",
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    paddingBottom: 40,
  },
  continueBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  continueBtnText: {
    color: Colors.secondary,
    fontSize: 16,
  },
});
