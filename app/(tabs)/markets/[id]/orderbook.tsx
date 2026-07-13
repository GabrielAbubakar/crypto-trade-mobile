import { BaseText, ScreenContainer } from "@/components/ui";
import { Colors } from "@/core/constants";
import { useGetOrderBookQuery } from "@/core/store/store";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

const OrderBookRow = React.memo(({ bid, ask }: { bid: any; ask: any }) => {
  return (
    <View style={styles.gridRow}>
      {/* Bids Column */}
      <View style={styles.bidCell}>
        <BaseText style={[styles.priceText, { color: Colors.success }]}>
          {bid.priceUsd.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </BaseText>
        <BaseText style={styles.amountText}>{bid.amount.toFixed(4)}</BaseText>
      </View>

      {/* Asks Column */}
      {ask && (
        <View style={styles.askCell}>
          <BaseText style={[styles.priceText, { color: Colors.error }]}>
            {ask.priceUsd.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </BaseText>
          <BaseText style={styles.amountText}>{ask.amount.toFixed(4)}</BaseText>
        </View>
      )}
    </View>
  );
});

OrderBookRow.displayName = "OrderBookRow";

export default function OrderBookScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const symbol = id?.toUpperCase() || "";

  const { data: response, isLoading } = useGetOrderBookQuery(
    { symbol: id, levels: 10 },
    { skip: !id, pollingInterval: 5000 },
  );

  const orderBook = response?.data;

  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      const ask = orderBook?.asks?.[index];
      return <OrderBookRow bid={item} ask={ask} />;
    },
    [orderBook?.asks],
  );

  const keyExtractor = useCallback((item: any, index: number) => index.toString(), []);

  const ListHeaderComponent = useMemo(() => {
    return (
      <View>
        {/* Header */}
        <View style={styles.header}>
          <BaseText size="3xl" variant="bold" style={styles.headerTitle}>
            {symbol} order book
          </BaseText>
          <BaseText style={styles.headerSubtitle}>
            Bid and ask levels for the trade screen.
          </BaseText>
        </View>

        {/* Segmented Control */}
        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tabBtn, styles.tabBtnActive]}>
            <BaseText size="sm" style={[styles.tabText, styles.tabTextActive]}>
              Order book
            </BaseText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabBtn}
            onPress={() => router.replace(`/markets/${id}/trades` as any)}
          >
            <BaseText size="sm" style={styles.tabText}>
              Trades
            </BaseText>
          </TouchableOpacity>
        </View>

        {/* Summary Cards */}
        {orderBook && (
          <View style={styles.summaryContainer}>
            <View style={styles.summaryCard}>
              <BaseText style={styles.summaryLabel}>Mid price</BaseText>
              <BaseText variant="bold" style={styles.summaryValue}>
                {orderBook.midPriceUsd.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </BaseText>
            </View>
            <View style={styles.summaryCard}>
              <BaseText style={styles.summaryLabel}>Spread</BaseText>
              <BaseText variant="bold" style={styles.summaryValue}>
                {orderBook.spreadUsd.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </BaseText>
            </View>
          </View>
        )}

        {/* Table Headers */}
        <View style={styles.gridHeaderRow}>
          <View style={styles.columnLeft}>
            <BaseText
              variant="bold"
              style={[styles.columnTitle, { color: Colors.success }]}
            >
              Bids
            </BaseText>
          </View>
          <View style={styles.columnRight}>
            <BaseText
              variant="bold"
              style={[styles.columnTitle, { color: Colors.error }]}
            >
              Asks
            </BaseText>
          </View>
        </View>
      </View>
    );
  }, [symbol, id, orderBook, router]);

  if (isLoading && !orderBook) {
    return (
      <ScreenContainer style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orderBook?.bids || []}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeaderComponent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        initialNumToRender={15}
        maxToRenderPerBatch={15}
        windowSize={5}
      />

      {/* Sticky Bottom CTA */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity style={styles.tradeBtn}>
          <BaseText variant="bold" style={styles.tradeBtnText}>
            Trade {symbol}
          </BaseText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
    paddingBottom: 100,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 120, // Leave room for absolute CTA
  },
  header: {
    marginBottom: 24,
    marginTop: 20,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 28,
    marginBottom: 8,
  },
  headerSubtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  tabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#161C22",
  },
  tabBtnActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.secondary,
  },
  summaryContainer: {
    gap: 12,
    marginBottom: 32,
  },
  summaryCard: {
    backgroundColor: "#161C22",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    color: Colors.textSecondary,
  },
  summaryValue: {
    color: Colors.white,
    fontSize: 16,
  },
  gridContainer: {
    flex: 1,
  },
  gridHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  columnLeft: {
    flex: 1,
    paddingRight: 8,
  },
  columnRight: {
    flex: 1,
    paddingLeft: 8,
  },
  columnTitle: {
    fontSize: 16,
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  bidCell: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 16,
  },
  askCell: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 16,
  },
  priceText: {
    fontSize: 13,
  },
  amountText: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  ctaContainer: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
  },
  tradeBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },
  tradeBtnText: {
    color: Colors.secondary,
    fontSize: 16,
  },
});
