import { BackHeader, BaseText, ScreenContainer, Skeleton } from "@/components/ui";
import { Colors } from "@/core/constants";
import { showSuccessToast } from "@/core/utils";
import { useGetDepositAddressDetailsQuery } from "@/features/wallet/api/walletApi";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Clipboard, StyleSheet, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function DepositDetailsScreen() {
  const router = useRouter();
  const { symbol } = useLocalSearchParams<{ symbol: string }>();

  // Fetch the address details from RTK query
  const { data: addressDetails, isFetching } = useGetDepositAddressDetailsQuery(
    symbol,
    { skip: !symbol },
  );

  // console.log("Address details:", addressDetails);

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

        {/* Scannable QR Code */}
        <View style={styles.qrContainer}>
          <View style={styles.qrCodeBox}>
            {addressDetails?.qrPayload ? (
              <QRCode
                value={addressDetails.qrPayload}
                size={150}
                backgroundColor="#FFFFFF"
                color="#000000"
              />
            ) : null}
          </View>
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
    paddingBottom: 100,
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
  qrContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  qrCodeBox: {
    width: 180,
    height: 180,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
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
