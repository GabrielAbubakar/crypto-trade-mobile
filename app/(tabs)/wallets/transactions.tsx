import { BackHeader, BaseText, ScreenContainer, Skeleton, WalletTransactionRow } from "@/components";
import { Colors } from "@/constants";
import { useGetWalletTransactionsQuery } from "@/store";
import type { ITransactionItem } from "@/types";
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

  const renderTransactionItem = ({ item }: { item: ITransactionItem }) => {
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

    return <WalletTransactionRow transaction={item} />;
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
            ? (Array.from({ length: 5 }).map((_, index) => ({
                id: `skeleton-${index}`,
              })) as unknown as ITransactionItem[])
            : filteredTransactions
        }
        keyExtractor={(item) => item.id}
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
