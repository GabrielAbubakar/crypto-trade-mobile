import { BaseText, ScreenContainer, Skeleton } from "@/components";
import { Colors } from "@/constants";
import {
  useGetWalletBalancesQuery,
  useGetWalletTransactionsQuery,
} from "@/store";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function WalletsScreen() {
  const router = useRouter();
  const [balanceVisible, setBalanceVisible] = useState(true);

  const {
    data: walletBalance,
    isFetching: isFetchingBalances,
    refetch: refetchBalances,
  } = useGetWalletBalancesQuery();

  // console.log("walletBalance", walletBalance);

  const {
    data: walletTransactions,
    isFetching: isFetchingTransactions,
    refetch: refetchTransactions,
  } = useGetWalletTransactionsQuery();

  const toggleBalance = () => {
    setBalanceVisible((prev) => !prev);
  };

  const handleRefresh = () => {
    refetchBalances();
    refetchTransactions();
  };

  // Static/calculated mapping for display values matching Screen 1 UI
  const getAssetDetails = (symbol: string, balance: number) => {
    switch (symbol.toUpperCase()) {
      case "USDT":
        return {
          name: "Tether",
          sub: "USDT",
          iconLetter: "U",
          iconBg: "rgba(94, 213, 168, 0.15)",
          iconColor: Colors.primary,
          valueUsd: balance * 2.45, // Demo rate
        };
      case "BTC":
        return {
          name: "Bitcoin",
          sub: "BTC",
          iconLetter: "B",
          iconBg: "rgba(255, 178, 54, 0.15)",
          iconColor: Colors.warning,
          valueUsd: balance * 64200.5, // Demo rate
        };
      case "ETH":
        return {
          name: "Ethereum",
          sub: "ETH",
          iconLetter: "E",
          iconBg: "rgba(56, 97, 251, 0.15)",
          iconColor: Colors.info,
          valueUsd: balance * 3420.0, // Demo rate
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

  const renderHeader = () => {
    return (
      <View>
        {/* Screen Header */}
        <View style={styles.header}>
          <View>
            <BaseText variant="bold" style={styles.headerTitle}>
              Wallet
            </BaseText>
            <BaseText style={styles.headerSubtitle}>
              Aggregated in USD from active asset balances.
            </BaseText>
          </View>
        </View>

        {/* Total portfolio value card */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push("/(tabs)/wallets/portfolio-history")}
          style={styles.portfolioCard}
        >
          <View>
            <BaseText style={styles.portfolioLabel}>
              Total portfolio value
            </BaseText>
            {isFetchingBalances ? (
              <Skeleton
                width={180}
                height={38}
                borderRadius={8}
                style={{ marginVertical: 6 }}
              />
            ) : (
              <BaseText variant="bold" style={styles.portfolioAmount}>
                {balanceVisible
                  ? walletBalance?.portfolioValue.toLocaleString("en-US", {
                      style: "currency",
                      currency: walletBalance?.portfolioCurrency || "USD",
                    })
                  : "••••••••"}
              </BaseText>
            )}
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={toggleBalance}
            style={styles.eyeButton}
          >
            <Feather
              name={balanceVisible ? "eye-off" : "eye"}
              size={20}
              color="rgba(255, 255, 255, 0.5)"
            />
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/(tabs)/wallets/deposit")}
            style={styles.actionBtn}
          >
            <BaseText variant="bold" style={styles.actionBtnText}>
              Deposit
            </BaseText>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/(tabs)/wallets/withdraw")}
            style={styles.actionBtn}
          >
            <BaseText variant="bold" style={styles.actionBtnText}>
              Withdraw
            </BaseText>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/(tabs)/trades")}
            style={styles.actionBtn}
          >
            <BaseText variant="bold" style={styles.actionBtnText}>
              Trade
            </BaseText>
          </TouchableOpacity>
        </View>

        {/* Asset Balances Section */}
        {/* <View style={styles.sectionHeader}>
          <BaseText variant="bold" style={styles.sectionTitle}>
            Assets
          </BaseText>
        </View> */}

        {/* Render Asset rows */}
        <View style={styles.assetsList}>
          {isFetchingBalances
            ? Array.from({ length: 3 }).map((_, index) => (
                <View key={`skeleton-asset-${index}`} style={styles.assetRow}>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 12,
                      alignItems: "center",
                    }}
                  >
                    <Skeleton width={40} height={40} borderRadius={20} />
                    <View style={{ gap: 4 }}>
                      <Skeleton width={80} height={16} borderRadius={4} />
                      <Skeleton width={40} height={12} borderRadius={4} />
                    </View>
                  </View>
                  <View style={{ gap: 4, alignItems: "flex-end" }}>
                    <Skeleton width={70} height={16} borderRadius={4} />
                    <Skeleton width={50} height={12} borderRadius={4} />
                  </View>
                </View>
              ))
            : walletBalance?.wallet.balances.map((balance, index) => {
                const details = getAssetDetails(
                  balance.assetSymbol,
                  balance.available,
                );
                return (
                  <View
                    key={balance.assetSymbol || index}
                    style={styles.assetRow}
                  >
                    <View style={styles.assetLeft}>
                      <View
                        style={[
                          styles.assetIcon,
                          { backgroundColor: details.iconBg },
                        ]}
                      >
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
                        <BaseText style={styles.assetSymbolText}>
                          {details.sub}
                        </BaseText>
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
                          ? `${balance.available.toLocaleString("en-US", {
                              maximumFractionDigits: 6,
                            })} ${balance.assetSymbol}`
                          : "••••••"}
                      </BaseText>
                    </View>
                  </View>
                );
              })}
        </View>

        {/* Recent Transactions Section Header */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push("/(tabs)/wallets/transactions")}
          style={styles.sectionHeaderClickable}
        >
          <BaseText variant="bold" style={styles.sectionTitle}>
            Recent transactions
          </BaseText>
          <Feather
            name="chevron-right"
            size={20}
            color="rgba(255, 255, 255, 0.4)"
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderTransactionItem = ({ item }: { item: any }) => {
    if (isFetchingTransactions) {
      return (
        <View style={styles.transactionSkeletonRow}>
          <Skeleton width={40} height={40} borderRadius={20} />
          <View style={{ flex: 1, gap: 4, marginLeft: 12 }}>
            <Skeleton width={120} height={16} borderRadius={4} />
            <Skeleton width={70} height={12} borderRadius={4} />
          </View>
          <Skeleton width={60} height={16} borderRadius={4} />
        </View>
      );
    }

    let iconName: any = "arrow-down-left";
    let iconColor = Colors.primary;
    let amountPrefix = "+";

    if (item.type === "withdrawal") {
      iconName = "arrow-up-right";
      iconColor = Colors.error;
      amountPrefix = "-";
    } else if (item.type === "transfer") {
      iconName = "repeat";
      iconColor = Colors.info;
      amountPrefix = "";
    }

    const isCompleted = item.status === "completed";

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          router.push({
            pathname: "/(tabs)/wallets/transaction/[id]",
            params: { id: item.id },
          })
        }
        style={styles.transactionRow}
      >
        <View style={styles.transactionLeft}>
          <View
            style={[
              styles.transactionIcon,
              { backgroundColor: `${iconColor}15` },
            ]}
          >
            <Feather name={iconName} size={16} color={iconColor} />
          </View>
          <View style={styles.transactionNameStack}>
            <BaseText variant="bold" style={styles.transactionTitle}>
              {item.type === "deposit"
                ? "Sandbox deposit"
                : item.type === "withdrawal"
                  ? "USDT withdrawal"
                  : "Transfer"}
            </BaseText>
            <BaseText style={styles.transactionSubtitle}>
              {isCompleted ? "Completed" : "Pending"}
            </BaseText>
          </View>
        </View>
        <View style={styles.transactionRight}>
          <BaseText
            variant="bold"
            style={[
              styles.transactionAmount,
              {
                color:
                  item.type === "withdrawal" ? Colors.error : Colors.primary,
              },
            ]}
          >
            {amountPrefix}
            {Number(item.amount).toLocaleString(undefined, {
              maximumFractionDigits: 6,
            })}{" "}
            {item.symbol}
          </BaseText>
          <BaseText style={styles.transactionTime}>Today</BaseText>
        </View>
      </TouchableOpacity>
    );
  };

  const recentTxData = walletTransactions?.data
    ? walletTransactions.data.slice(0, 3)
    : [];

  return (
    <ScreenContainer withPadding={false} style={styles.container}>
      <FlatList
        data={
          isFetchingTransactions
            ? Array.from({ length: 2 }).map((_, index) => ({
                id: `skeleton-${index}`,
              }))
            : recentTxData
        }
        keyExtractor={(item) => item.id}
        renderItem={renderTransactionItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyTransactions}>
            <BaseText style={styles.emptyText}>No recent transactions</BaseText>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isFetchingBalances || isFetchingTransactions}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 32,
    marginBottom: 4,
  },
  headerSubtitle: {
    color: "#777777",
    fontSize: 14,
  },
  portfolioCard: {
    backgroundColor: "#14231F",
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  portfolioLabel: {
    color: "#777777",
    fontSize: 14,
    marginBottom: 4,
  },
  portfolioAmount: {
    color: Colors.white,
    fontSize: 32,
    marginVertical: 4,
  },
  portfolioChange: {
    color: Colors.primary,
    fontSize: 14,
  },
  eyeButton: {
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 12,
  },
  actionsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 24,
    marginBottom: 30,
  },
  actionBtn: {
    flex: 1,
    height: 48,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnText: {
    color: Colors.white,
    fontSize: 14,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionHeaderClickable: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 16,
  },
  sectionTitle: {
    color: Colors.white,
    fontSize: 18,
  },
  assetsList: {
    backgroundColor: "#161C22",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.03)",
  },
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
    color: Colors.white,
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
    color: Colors.white,
    fontSize: 16,
    marginBottom: 2,
  },
  assetAmountText: {
    color: "#777777",
    fontSize: 12,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 130, // Space for custom bottom tab
  },
  transactionSkeletonRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#161C22",
    borderRadius: 16,
    marginHorizontal: 20,
  },
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#161C22",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.03)",
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  transactionNameStack: {
    justifyContent: "center",
  },
  transactionTitle: {
    color: Colors.white,
    fontSize: 14,
    marginBottom: 2,
  },
  transactionSubtitle: {
    color: "#777777",
    fontSize: 12,
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontSize: 14,
    marginBottom: 2,
  },
  transactionTime: {
    color: "#777777",
    fontSize: 12,
  },
  emptyTransactions: {
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyText: {
    color: "#777777",
    fontSize: 14,
  },
});
