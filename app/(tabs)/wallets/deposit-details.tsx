import { BackHeader, BaseText, ScreenContainer, Skeleton } from "@/components";
import { Colors } from "@/constants";
import { useGetDepositAddressDetailsQuery } from "@/store";
import { showSuccessToast } from "@/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Clipboard, StyleSheet, TouchableOpacity, View } from "react-native";
import Svg, { Rect } from "react-native-svg";

export default function DepositDetailsScreen() {
  const router = useRouter();
  const { symbol } = useLocalSearchParams<{ symbol: string }>();

  // Fetch the address details from RTK query
  const { data: addressDetails, isFetching } = useGetDepositAddressDetailsQuery(
    symbol || "USDT",
    { skip: !symbol },
  );

  const handleCopyAddress = () => {
    if (addressDetails?.address) {
      Clipboard.setString(addressDetails.address);
      showSuccessToast("Address copied to clipboard!");
    }
  };

  const handleSimulate = () => {
    router.push({
      pathname: "/(tabs)/wallets/simulate-deposit",
      params: { symbol: symbol || "USDT" },
    });
  };

  // Helper to draw a modern stylized mock QR code matrix
  const renderQRCode = () => {
    return (
      <Svg width={140} height={140} viewBox="0 0 140 140">
        {/* Top Left corner marker */}
        <Rect x={0} y={0} width={40} height={40} fill="#FFFFFF" rx={8} />
        <Rect x={8} y={8} width={24} height={24} fill="#161C22" rx={4} />
        <Rect x={14} y={14} width={12} height={12} fill="#FFFFFF" rx={2} />

        {/* Top Right corner marker */}
        <Rect x={100} y={0} width={40} height={40} fill="#FFFFFF" rx={8} />
        <Rect x={108} y={8} width={24} height={24} fill="#161C22" rx={4} />
        <Rect x={114} y={14} width={12} height={12} fill="#FFFFFF" rx={2} />

        {/* Bottom Left corner marker */}
        <Rect x={0} y={100} width={40} height={40} fill="#FFFFFF" rx={8} />
        <Rect x={8} y={108} width={24} height={24} fill="#161C22" rx={4} />
        <Rect x={14} y={114} width={12} height={12} fill="#FFFFFF" rx={2} />

        {/* Dynamic block pattern to make it look like a real QR code */}
        <Rect x={50} y={10} width={16} height={16} fill="#FFFFFF" rx={3} />
        <Rect x={75} y={0} width={16} height={16} fill="#FFFFFF" rx={3} />
        <Rect x={50} y={35} width={30} height={16} fill="#FFFFFF" rx={3} />
        <Rect x={90} y={50} width={16} height={16} fill="#FFFFFF" rx={3} />

        <Rect x={0} y={50} width={30} height={16} fill="#FFFFFF" rx={3} />
        <Rect x={38} y={60} width={16} height={30} fill="#FFFFFF" rx={3} />
        <Rect x={65} y={65} width={16} height={16} fill="#FFFFFF" rx={3} />
        <Rect x={60} y={90} width={30} height={16} fill="#FFFFFF" rx={3} />
        <Rect x={110} y={65} width={30} height={16} fill="#FFFFFF" rx={3} />
        <Rect x={120} y={90} width={16} height={30} fill="#FFFFFF" rx={3} />

        <Rect x={50} y={115} width={16} height={16} fill="#FFFFFF" rx={3} />
        <Rect x={75} y={120} width={30} height={16} fill="#FFFFFF" rx={3} />
      </Svg>
    );
  };

  const formattedAddress = addressDetails?.address
    ? `${addressDetails.address.slice(0, 8)}...${addressDetails.address.slice(-6)}`
    : "TXYZ...9F12";

  return (
    <ScreenContainer scrollable={true} style={styles.container}>
      <View style={styles.content}>
        <BackHeader title={`${symbol || "USDT"} deposit`} />
        <BaseText style={styles.subtitle}>
          Copy the demo address or scan the QR code.
        </BaseText>

        {/* QR Code Container */}
        <View style={styles.qrCard}>
          <View style={styles.qrWrapper}>{renderQRCode()}</View>
        </View>

        {/* Network info */}
        <View style={styles.detailsCard}>
          <View style={styles.detailItem}>
            <BaseText style={styles.detailLabel}>Network</BaseText>
            {isFetching ? (
              <Skeleton width={150} height={18} borderRadius={4} />
            ) : (
              <BaseText variant="bold" style={styles.detailValue}>
                {addressDetails?.network || `${symbol} sandbox network`}
              </BaseText>
            )}
          </View>
          <View
            style={[
              styles.detailItem,
              { borderBottomWidth: 0, paddingBottom: 0 },
            ]}
          >
            <BaseText style={styles.detailLabel}>Deposit address</BaseText>
            {isFetching ? (
              <Skeleton width={180} height={18} borderRadius={4} />
            ) : (
              <BaseText variant="bold" style={styles.detailValue}>
                {formattedAddress}
              </BaseText>
            )}
          </View>
        </View>

        {/* Action Buttons Row */}
        <View style={styles.btnRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleCopyAddress}
            style={styles.copyBtn}
          >
            <BaseText variant="bold" style={styles.copyBtnText}>
              Copy address
            </BaseText>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSimulate}
            style={styles.simulateBtn}
          >
            <BaseText variant="bold" style={styles.simulateBtnText}>
              Simulate deposit
            </BaseText>
          </TouchableOpacity>
        </View>

        {/* Important notice */}
        <View style={styles.warningBox}>
          <BaseText variant="bold" style={styles.warningTitle}>
            Important
          </BaseText>
          <BaseText style={styles.warningDescription}>
            Only use the sandbox simulator in class. This address is not real
            custody.
          </BaseText>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  content: {
    // flex: 1,
    marginTop: 20,
  },
  subtitle: {
    color: "#777777",
    fontSize: 14,
    marginTop: -8,
    marginBottom: 24,
  },
  qrCard: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#161C22",
    borderRadius: 24,
    paddingVertical: 36,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.03)",
  },
  qrWrapper: {
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
  },
  detailsCard: {
    backgroundColor: "#161C22",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.03)",
  },
  detailItem: {
    borderBottomWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    paddingBottom: 16,
    marginBottom: 16,
  },
  detailLabel: {
    color: "#777777",
    fontSize: 12,
    marginBottom: 6,
  },
  detailValue: {
    color: Colors.white,
    fontSize: 16,
  },
  btnRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  copyBtn: {
    flex: 1,
    height: 52,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  copyBtnText: {
    color: Colors.secondary,
    fontSize: 15,
  },
  simulateBtn: {
    flex: 1,
    height: 52,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  simulateBtnText: {
    color: Colors.white,
    fontSize: 15,
  },
  warningBox: {
    backgroundColor: "rgba(255, 178, 54, 0.08)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 178, 54, 0.15)",
  },
  warningTitle: {
    color: Colors.warning,
    fontSize: 14,
    marginBottom: 4,
  },
  warningDescription: {
    color: Colors.warning,
    opacity: 0.8,
    fontSize: 13,
    lineHeight: 18,
  },
});
