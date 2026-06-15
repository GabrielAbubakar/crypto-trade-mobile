import { BackHeader, BaseText, ScreenContainer, Skeleton } from "@/components";
import { Colors } from "@/constants";
import { useGetTransactionDetailsQuery } from "@/store";
import { capitalize } from "@/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";

export default function TransactionDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Fetch specific transaction details from RTK query
  const { data: transaction, isFetching } = useGetTransactionDetailsQuery(
    id || "",
    { skip: !id },
  );

  const handleBackToWallet = () => {
    router.replace("/(tabs)/wallets");
  };

  const isDeposit = transaction?.type === "deposit";
  const isWithdrawal = transaction?.type === "withdrawal";
  const isCompleted = transaction?.status === "completed";

  const statusColor = isCompleted
    ? Colors.primary
    : transaction?.status === "pending"
      ? Colors.warning
      : Colors.error;

  const amountPrefix = isDeposit ? "+" : isWithdrawal ? "-" : "";

  const displayAsset = transaction
    ? transaction.type === "withdrawal"
      ? transaction.fromAsset
      : transaction.toAsset
    : "";
  const displayAmount = transaction
    ? transaction.type === "withdrawal"
      ? transaction.fromAmount
      : transaction.toAmount
    : 0;

  // Helper date formatting
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "--";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Mock exchange rate logic
  const getExchangeRate = (symbol?: string) => {
    if (!symbol) return "$1.00";
    switch (symbol.toUpperCase()) {
      case "USDT":
        return "$1.00";
      case "BTC":
        return "$64,200.50";
      case "ETH":
        return "$3,420.00";
      default:
        return "$1.00";
    }
  };

  return (
    <ScreenContainer scrollable style={styles.container}>
      <View style={styles.content}>
        <BackHeader title="Transaction details" />
        <BaseText style={styles.subtitle}>
          A single ledger entry with status and reference.
        </BaseText>

        {isFetching ? (
          <View style={styles.loaderContainer}>
            <Skeleton
              width={screenWidth - 40}
              height={120}
              borderRadius={24}
              style={{ marginBottom: 24 }}
            />
            <Skeleton width={screenWidth - 40} height={260} borderRadius={24} />
          </View>
        ) : transaction ? (
          <>
            {/* Top transaction status summary */}
            <View style={styles.summaryCard}>
              <BaseText style={styles.summaryLabel}>
                {isDeposit
                  ? `Sandbox ${displayAsset} deposit`
                  : isWithdrawal
                    ? `Sandbox ${displayAsset} withdrawal`
                    : `Transfer ${displayAsset}`}
              </BaseText>
              <BaseText
                variant="bold"
                style={[
                  styles.summaryAmount,
                  { color: isWithdrawal ? Colors.error : Colors.primary },
                ]}
              >
                {amountPrefix}
                {Number(displayAmount).toLocaleString(undefined, {
                  maximumFractionDigits: 6,
                })}{" "}
                {displayAsset}
              </BaseText>
              <BaseText
                variant="bold"
                style={[styles.summaryStatus, { color: statusColor }]}
              >
                {capitalize(transaction.status)}
              </BaseText>
            </View>

            {/* Transaction details list */}
            <View style={styles.detailsCard}>
              <View style={styles.detailRow}>
                <BaseText style={styles.detailLabel}>Reference</BaseText>
                <BaseText variant="bold" style={styles.detailValue}>
                  {transaction.reference || transaction.id}
                </BaseText>
              </View>
              <View style={styles.detailRow}>
                <BaseText style={styles.detailLabel}>Asset</BaseText>
                <BaseText variant="bold" style={styles.detailValue}>
                  {displayAsset}
                </BaseText>
              </View>
              <View style={styles.detailRow}>
                <BaseText style={styles.detailLabel}>Network</BaseText>
                <BaseText variant="bold" style={styles.detailValue}>
                  {displayAsset === "BTC"
                    ? "Testnet"
                    : displayAsset === "ETH"
                      ? "Sepolia"
                      : "TRC20"}
                </BaseText>
              </View>
              <View style={styles.detailRow}>
                <BaseText style={styles.detailLabel}>Rate</BaseText>
                <BaseText variant="bold" style={styles.detailValue}>
                  {getExchangeRate(displayAsset)}
                </BaseText>
              </View>
              <View style={styles.detailRow}>
                <BaseText style={styles.detailLabel}>Created</BaseText>
                <BaseText variant="bold" style={styles.detailValue}>
                  {formatDate(transaction.createdAt)}
                </BaseText>
              </View>
              <View
                style={[
                  styles.detailRow,
                  { borderBottomWidth: 0, paddingBottom: 0 },
                ]}
              >
                <BaseText style={styles.detailLabel}>Completed</BaseText>
                <BaseText variant="bold" style={styles.detailValue}>
                  {isCompleted
                    ? formatDate(
                        transaction.completedAt || transaction.createdAt,
                      )
                    : "Pending"}
                </BaseText>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.errorCard}>
            <BaseText style={styles.errorText}>
              Transaction details not found.
            </BaseText>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleBackToWallet}
          style={styles.backBtn}
        >
          <BaseText variant="bold" style={styles.backBtnText}>
            Back to wallet
          </BaseText>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondary,
    flex: 1,
    paddingBottom: 100,
  },
  content: {
    // flex: 1,
    marginTop: 20,
    marginBottom: 30,
  },
  subtitle: {
    color: "#777777",
    fontSize: 14,
    marginTop: -8,
    marginBottom: 24,
  },
  loaderContainer: {
    // flex: 1,
  },
  summaryCard: {
    backgroundColor: "#14231F",
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.03)",
  },
  summaryLabel: {
    color: "#777777",
    fontSize: 14,
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 32,
    marginBottom: 8,
  },
  summaryStatus: {
    fontSize: 12,
    letterSpacing: 1,
  },
  detailsCard: {
    backgroundColor: "#161C22",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.03)",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // borderBottomWidth: 1,
    // borderColor: "rgba(255, 255, 255, 0.05)",
    paddingBottom: 14,
    marginBottom: 14,
  },
  detailLabel: {
    color: "#777777",
    fontSize: 14,
  },
  detailValue: {
    color: Colors.white,
    fontSize: 14,
  },
  errorCard: {
    backgroundColor: "#161C22",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
  },
  footer: {
    // paddingBottom: 40,
  },
  backBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnText: {
    color: Colors.secondary,
    fontSize: 16,
  },
});
