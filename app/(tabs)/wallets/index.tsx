import {
  BaseText,
  ScreenContainer,
  Skeleton,
  WalletTransactionRow,
  WalletTransactionRowSkeleton,
} from "@/components";
import { Colors } from "@/constants";
import {
  useGetWalletBalancesQuery,
  useGetWalletTransactionsQuery,
} from "@/store";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

function EmptyComponent() {
  return (
    <View style={styles.emptyContainer}>
      <BaseText variant="bold" style={styles.emptyTitle}>
        No transactions yet
      </BaseText>
      <BaseText style={styles.emptySubtitle}>
        Your transaction history will show up here once you make deposits or
        withdrawals.
      </BaseText>
    </View>
  );
}

export default function WalletsScreen() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [activeAction, setActiveAction] = useState<
    "deposit" | "withdraw" | "transfer"
  >("deposit");

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

  const toggleBalance = () => {
    setBalanceVisible((prev) => !prev);
  };

  const handleActionPress = (action: "deposit" | "withdraw" | "transfer") => {
    setActiveAction(action);
  };

  function renderFunction({ item }: { item: any }) {
    return isFetchingTransactions ? (
      <WalletTransactionRowSkeleton />
    ) : (
      <WalletTransactionRow transaction={item as any} />
    );
  }

  return (
    <ScreenContainer withPadding={false} style={styles.container}>
      {/* Balance Section */}
      <View style={styles.balanceContainer}>
        <View style={styles.balanceHeader}>
          <View>
            <BaseText style={styles.balanceLabel}>Current Balance</BaseText>
            {isFetchingBalances ? (
              <>
                <Skeleton
                  width={100}
                  height={15}
                  borderRadius={0}
                  style={{ marginBottom: 10 }}
                />
                <Skeleton width={70} height={10} borderRadius={0} />
              </>
            ) : (
              <>
                <BaseText variant="bold" style={styles.balanceAmount}>
                  {walletBalance?.portfolioValue.toLocaleString("en-US", {
                    style: "currency",
                    currency: walletBalance?.portfolioCurrency,
                    maximumFractionDigits: 0,
                  })}
                </BaseText>
                <BaseText style={styles.balanceSubtext}>
                  {walletBalance?.portfolioValueUsd.toLocaleString("en-US")}
                </BaseText>
              </>
            )}
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
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleActionPress("deposit")}
          style={
            activeAction === "deposit"
              ? styles.actionBtnActive
              : styles.actionBtnInactive
          }
        >
          <BaseText
            style={
              activeAction === "deposit"
                ? styles.actionBtnTextActive
                : styles.actionBtnTextInactive
            }
          >
            Deposit
          </BaseText>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleActionPress("withdraw")}
          style={
            activeAction === "withdraw"
              ? styles.actionBtnActive
              : styles.actionBtnInactive
          }
        >
          <BaseText
            style={
              activeAction === "withdraw"
                ? styles.actionBtnTextActive
                : styles.actionBtnTextInactive
            }
          >
            Withdraw
          </BaseText>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleActionPress("transfer")}
          style={
            activeAction === "transfer"
              ? styles.actionBtnActive
              : styles.actionBtnInactive
          }
        >
          <BaseText
            style={
              activeAction === "transfer"
                ? styles.actionBtnTextActive
                : styles.actionBtnTextInactive
            }
          >
            Transfer
          </BaseText>
        </TouchableOpacity>
      </View>

      <FlatList
        data={
          isFetchingTransactions
            ? Array.from({ length: 5 }).map((_, index) => ({
                id: `skeleton-${index}`,
              }))
            : walletTransactions?.data
        }
        keyExtractor={(item) => item.id}
        renderItem={renderFunction}
        ListEmptyComponent={EmptyComponent}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isFetchingBalances || isFetchingTransactions}
            onRefresh={() => {
              refetchBalances();
              refetchTransactions();
            }}
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
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 140, // Space for floating bottom tab
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    color: "#777777",
    fontSize: 14,
    textAlign: "center",
  },
});
