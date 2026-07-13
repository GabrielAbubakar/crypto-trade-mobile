import { BaseText, ScreenContainer, Skeleton } from "@/components/ui";
import { Colors } from "@/core/constants";
import type { ITransactionItem } from "@/core/types";
import { useGetWalletBalancesQuery, useGetWalletTransactionsQuery } from "@/features/wallet/api/walletApi";
import { WalletAssetRow, WalletTransactionRow } from "@/features/wallet/components";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

export const AssetRowSkeleton: React.FC = () => {
  return (
    <View style={styles.assetRow}>
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
  );
};

type WalletBalanceResponse = ReturnType<typeof useGetWalletBalancesQuery>["data"];

interface WalletsHeaderProps {
  router: ReturnType<typeof useRouter>;
  balanceVisible: boolean;
  isFetchingBalances: boolean;
  walletBalance: WalletBalanceResponse;
  toggleBalance: () => void;
}

const WalletsHeader: React.FC<WalletsHeaderProps> = React.memo(({
  router,
  balanceVisible,
  isFetchingBalances,
  walletBalance,
  toggleBalance,
}) => {
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
      <View style={styles.sectionHeader}>
        <BaseText variant="bold" style={styles.sectionTitle}>
          Assets
        </BaseText>
      </View>

      {/* Render Asset rows */}
      <View style={styles.assetsList}>
        {isFetchingBalances
          ? Array.from({ length: 3 }).map((_, index) => (
              <AssetRowSkeleton key={`skeleton-asset-${index}`} />
            ))
          : walletBalance?.wallet.balances.map((balance: any, index: number) => (
              <WalletAssetRow
                key={balance.assetSymbol || index}
                assetSymbol={balance.assetSymbol}
                available={balance.available}
                balanceVisible={balanceVisible}
              />
            ))}
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
});

WalletsHeader.displayName = "WalletsHeader";

const SKELETON_TRANSACTIONS = [
  { id: "skeleton-0" },
  { id: "skeleton-1" },
] as unknown as ITransactionItem[];

export default function WalletsScreen() {
  const router = useRouter();
  const [balanceVisible, setBalanceVisible] = useState(true);

  const {
    data: walletBalance,
    isFetching: isFetchingBalances,
    refetch: refetchBalances,
  } = useGetWalletBalancesQuery();

  const {
    data: walletTransactions,
    isFetching: isFetchingTransactions,
    refetch: refetchTransactions,
  } = useGetWalletTransactionsQuery();

  const toggleBalance = useCallback(() => {
    setBalanceVisible((prev) => !prev);
  }, []);

  const handleRefresh = useCallback(() => {
    refetchBalances();
    refetchTransactions();
  }, [refetchBalances, refetchTransactions]);

  const renderTransactionItem = useCallback(({ item }: { item: ITransactionItem }) => {
    if (item.id.startsWith("skeleton-")) {
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

    return <WalletTransactionRow transaction={item} />;
  }, []);

  const recentTxData = useMemo(() => {
    return walletTransactions?.data
      ? walletTransactions.data.slice(0, 3)
      : [];
  }, [walletTransactions?.data]);

  const listData = useMemo(() => {
    if (isFetchingTransactions) {
      return SKELETON_TRANSACTIONS;
    }
    return recentTxData;
  }, [isFetchingTransactions, recentTxData]);

  return (
    <ScreenContainer withPadding={false} style={styles.container}>
      <FlatList
        data={listData}
        keyExtractor={(item) => item.id}
        renderItem={renderTransactionItem}
        ListHeaderComponent={
          <WalletsHeader
            router={router}
            balanceVisible={balanceVisible}
            isFetchingBalances={isFetchingBalances}
            walletBalance={walletBalance}
            toggleBalance={toggleBalance}
          />
        }
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

  emptyTransactions: {
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyText: {
    color: "#777777",
    fontSize: 14,
  },
});
