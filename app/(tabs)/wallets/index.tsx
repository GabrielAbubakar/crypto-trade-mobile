import { BaseText, ScreenContainer, WalletAssetRow } from "@/components";
import { Colors, initialAssetsData } from "@/constants";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function WalletsScreen() {
  const [balanceVisible, setBalanceVisible] = useState(true);

  const toggleBalance = () => {
    setBalanceVisible((prev) => !prev);
  };

  return (
    <ScreenContainer withPadding={false} scrollable style={styles.container}>
      {/* Balance Section */}
      <View style={styles.balanceContainer}>
        <View style={styles.balanceHeader}>
          <View>
            <BaseText style={styles.balanceLabel}>Current Balance</BaseText>
            <BaseText variant="bold" style={styles.balanceAmount}>
              {balanceVisible ? "40,059.83" : "••••••"}
            </BaseText>
            <BaseText style={styles.balanceSubtext}>
              {balanceVisible ? "$468,554.23" : "$ ••••••••"}
            </BaseText>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={toggleBalance}
            style={styles.eyeButton}
          >
            <Feather
              name={balanceVisible ? "eye-off" : "eye"}
              size={22}
              color="rgba(255, 255, 255, 0.4)"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Action Buttons (Deposit, Withdraw, Transfer) */}
      <View style={styles.actionsRow}>
        <TouchableOpacity activeOpacity={0.8} style={styles.actionBtnActive}>
          <BaseText style={styles.actionBtnTextActive}>
            Deposit
          </BaseText>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8} style={styles.actionBtnInactive}>
          <BaseText style={styles.actionBtnTextInactive}>
            Withdraw
          </BaseText>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8} style={styles.actionBtnInactive}>
          <BaseText style={styles.actionBtnTextInactive}>
            Transfer
          </BaseText>
        </TouchableOpacity>
      </View>

      {/* Crypto Assets List */}
      <View style={styles.assetsContainer}>
        {initialAssetsData.map((asset) => (
          <WalletAssetRow
            key={asset.id}
            asset={asset}
            balanceVisible={balanceVisible}
          />
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondary,
  },
  balanceContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 24,
  },
  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceLabel: {
    color: "#777777",
    fontSize: 14,
    marginBottom: 8,
  },
  balanceAmount: {
    color: "#FFFFFF",
    fontSize: 32,
    marginBottom: 4,
  },
  balanceSubtext: {
    color: "#777777",
    fontSize: 14,
  },
  eyeButton: {
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 12,
  },
  actionsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 28,
  },
  actionBtnActive: {
    flex: 1,
    height: 48,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnInactive: {
    flex: 1,
    height: 48,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnTextActive: {
    color: Colors.secondary,
    fontSize: 14,
  },
  actionBtnTextInactive: {
    color: "#777777",
    fontSize: 14,
  },
  assetsContainer: {
    paddingHorizontal: 20,
    gap: 20,
    paddingBottom: 140, // Space for floating bottom tab
  },
});
