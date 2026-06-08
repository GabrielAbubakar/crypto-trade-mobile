import { BackHeader, BaseText, ScreenContainer } from "@/components";
import { Colors } from "@/constants";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface AssetOption {
  symbol: string;
  name: string;
  network: string;
  price: string;
  status: string;
  iconLetter: string;
  iconBg: string;
  iconColor: string;
}

export default function DepositSelectScreen() {
  const router = useRouter();
  const [selectedAsset, setSelectedAsset] = useState<string>("USDT");

  const assets: AssetOption[] = [
    {
      symbol: "USDT",
      name: "Tether",
      network: "TRC20",
      price: "$1.00",
      status: "Recommended",
      iconLetter: "U",
      iconBg: "rgba(94, 213, 168, 0.15)",
      iconColor: Colors.primary,
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      network: "Testnet",
      price: "$64,200.50",
      status: "Available",
      iconLetter: "B",
      iconBg: "rgba(255, 178, 54, 0.15)",
      iconColor: Colors.warning,
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      network: "Sepolia",
      price: "$3,420.00",
      status: "Available",
      iconLetter: "E",
      iconBg: "rgba(56, 97, 251, 0.15)",
      iconColor: Colors.info,
    },
  ];

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
          {assets.map((asset) => {
            const isSelected = selectedAsset === asset.symbol;
            return (
              <TouchableOpacity
                key={asset.symbol}
                activeOpacity={0.8}
                onPress={() => setSelectedAsset(asset.symbol)}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                ]}
              >
                <View style={styles.optionLeft}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: asset.iconBg },
                    ]}
                  >
                    <BaseText
                      variant="bold"
                      style={{ color: asset.iconColor, fontSize: 16 }}
                    >
                      {asset.iconLetter}
                    </BaseText>
                  </View>
                  <View style={styles.assetDetails}>
                    <BaseText variant="bold" style={styles.assetName}>
                      {asset.name}
                    </BaseText>
                    <BaseText style={styles.assetNetwork}>
                      {asset.symbol} · {asset.network}
                    </BaseText>
                  </View>
                </View>
                <View style={styles.optionRight}>
                  <BaseText variant="bold" style={styles.assetPrice}>
                    {asset.price}
                  </BaseText>
                  <BaseText
                    style={[
                      styles.assetStatus,
                      isSelected
                        ? { color: Colors.primary }
                        : { color: "#777777" },
                    ]}
                  >
                    {asset.status}
                  </BaseText>
                </View>
              </TouchableOpacity>
            );
          })}
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
    marginBottom: 100,
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
