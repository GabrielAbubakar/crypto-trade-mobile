import { BackHeader, BaseText, ScreenContainer, Skeleton } from "@/components";
import { Colors } from "@/constants";
import { useGetWalletTransactionsQuery } from "@/store";
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

type TxFilter = "all" | "deposit" | "withdrawal";

export default function TransactionsScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<TxFilter>("all");

  const apiParams = React.useMemo(() => {
    return {
      type: filter === "all" ? undefined : filter,
    };
  }, [filter]);

  const {
    data: transactionsData,
    isFetching,
    refetch,
  } = useGetWalletTransactionsQuery(apiParams);

  const handleRefresh = () => {
    refetch();
  };

  const filteredTransactions = transactionsData?.data ?? [];

  const renderFilterButton = (label: string, value: TxFilter) => {
    const isActive = filter === value;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setFilter(value)}
        style={[
          styles.filterBtn,
          isActive ? styles.filterBtnActive : styles.filterBtnInactive,
        ]}
      >
        <BaseText
          variant="medium"
          style={[
            styles.filterText,
            isActive ? styles.filterTextActive : styles.filterTextInactive,
          ]}
        >
          {label}
        </BaseText>
      </TouchableOpacity>
    );
  };

  const renderTransactionItem = ({ item }: { item: any }) => {
    if (isFetching) {
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
    const dateStr = new Date(item.timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

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
          <BaseText style={styles.transactionTime}>{dateStr}</BaseText>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <BackHeader title="Transactions" />
      <BaseText style={styles.subtitle}>
        Deposits, withdrawals, buys, sells, and swaps.
      </BaseText>

      {/* Filter Row */}
      <View style={styles.filterRow}>
        {renderFilterButton("All", "all")}
        {renderFilterButton("Deposits", "deposit")}
        {renderFilterButton("Withdrawals", "withdrawal")}
      </View>
    </View>
  );

  return (
    <ScreenContainer withPadding={false} style={styles.container}>
      <FlatList
        data={
          isFetching
            ? Array.from({ length: 5 }).map((_, index) => ({
                id: `skeleton-${index}`,
              }))
            : filteredTransactions
        }
        keyExtractor={(item: any) => item.id}
        renderItem={renderTransactionItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather
              name="list"
              size={32}
              color="#777777"
              style={{ marginBottom: 12 }}
            />
            <BaseText style={styles.emptyText}>No transactions found</BaseText>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
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
    backgroundColor: Colors.secondary,
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  subtitle: {
    color: "#777777",
    fontSize: 14,
    marginTop: -8,
    marginBottom: 20,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  filterBtnActive: {
    backgroundColor: "rgba(94, 213, 168, 0.15)",
  },
  filterBtnInactive: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
  },
  filterText: {
    fontSize: 13,
  },
  filterTextActive: {
    color: Colors.primary,
  },
  filterTextInactive: {
    color: "#777777",
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100,
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
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "#777777",
    fontSize: 14,
  },
});
