import { BaseButton, BaseText, ScreenContainer } from "@/components";
import { Colors } from "@/constants";
import {
  useAddToWatchlistMutation,
  useGetAssetCandlesQuery,
  useGetAssetDetailsQuery,
  useGetProfileQuery,
  useRemoveFromWatchlistMutation,
} from "@/store";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SvgUri } from "react-native-svg";

import { formatCompact, showErrorToast, showSuccessToast } from "@/utils";
import { CandlestickChart } from "react-native-wagmi-charts";

const { width: screenWidth } = Dimensions.get("window");

const INTERVALS = [
  { label: "1m", value: "1m" as const },
  { label: "5m", value: "5m" as const },
  { label: "15m", value: "15m" as const },
  { label: "1H", value: "1h" as const },
  { label: "1D", value: "1d" as const },
];

export default function CoinDetailsScreen() {
  const router = useRouter();

  // 1. Get the dynamic parameter from the URL using useLocalSearchParams
  // Since the folder is named [id], the parameter is accessed as `id`
  const { id } = useLocalSearchParams<{ id: string }>();

  // Interval state matching values in API: 1m, 5m, 15m, 1h, 1d
  const [activeInterval, setActiveInterval] = React.useState<
    "1m" | "5m" | "15m" | "1h" | "1d"
  >("1h");

  // Track exact container width to prevent chart overflow
  const [chartWidth, setChartWidth] = React.useState(screenWidth - 72);

  // 2. Pass the dynamic id to your query to fetch the specific coin's data
  const {
    data: coin,
    isLoading,
    refetch,
  } = useGetAssetDetailsQuery(id, {
    skip: !id,
    pollingInterval: 15000,
  });

  // Fetch actual candles dynamically based on the selected interval
  const {
    data: candlesResponse,
    isLoading: isCandlesLoading,
    refetch: refetchCandles,
  } = useGetAssetCandlesQuery(
    { symbol: id || "", interval: activeInterval, limit: 50 },
    {
      skip: !id,
      pollingInterval: 15000,
    },
  );

  // Watchlist integration
  const { data: profile } = useGetProfileQuery();
  const [addToWatchlist, { isLoading: isAdding }] = useAddToWatchlistMutation();
  const [removeFromWatchlist, { isLoading: isRemoving }] =
    useRemoveFromWatchlistMutation();

  const watchlist = profile?.watchlist ?? [];
  const symbol = coin?.symbol || id || "";
  const isInWatchlist = symbol ? watchlist.includes(symbol) : false;

  const handleWatchlistToggle = useCallback(async () => {
    if (!symbol) return;
    try {
      if (isInWatchlist) {
        await removeFromWatchlist(symbol).unwrap();
        showSuccessToast(`${symbol} removed from watchlist`);
      } else {
        await addToWatchlist(symbol).unwrap();
        showSuccessToast(`${symbol} added to watchlist`);
      }
    } catch (error: any) {
      showErrorToast(error?.data?.message || "Failed to update watchlist");
    }
  }, [symbol, isInWatchlist, addToWatchlist, removeFromWatchlist]);

  const handleRefresh = useCallback(async () => {
    refetch();
    refetchCandles();
  }, [refetch, refetchCandles]);

  const candlestickData = useMemo(() => {
    if (!candlesResponse?.data) return [];
    return candlesResponse.data.map((point) => ({
      timestamp: new Date(point.time).getTime(),
      open: point.openUsd,
      high: point.highUsd,
      low: point.lowUsd,
      close: point.closeUsd,
    }));
  }, [candlesResponse?.data]);

  if (isLoading || !coin) {
    return (
      <ScreenContainer
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </ScreenContainer>
    );
  }

  const resolvedUrl = coin?.iconUrl?.startsWith("http")
    ? coin?.iconUrl
    : process.env.EXPO_PUBLIC_API_URL
      ? `${process.env.EXPO_PUBLIC_API_URL}${coin?.iconUrl}`
      : coin?.iconUrl;

  // Calculate if trend is positive for coloring
  const isPositive = coin.change24h > 0;
  const trendColor = isPositive ? "#5CD6A5" : Colors.error;

  return (
    <ScreenContainer
      scrollable
      withPadding={false}
      style={styles.container}
      onRefresh={handleRefresh}
    >
      {/* Header */}
      <View style={styles.header}>
        <BaseText variant="bold" style={styles.headerTitle}>
          {coin.name}
        </BaseText>
        <View style={{ flexDirection: "row", gap: 5 }}>
          <BaseText color={Colors.textSecondary}>{coin.symbol}</BaseText>
          <BaseText color={Colors.textSecondary}>·</BaseText>
          <BaseText color={Colors.textSecondary}>{coin.network}</BaseText>
        </View>
      </View>

      <View style={styles.content}>
        {/* Coin Symbol & Price */}
        <View style={styles.priceHeader}>
          <View style={styles.iconContainer}>
            <SvgUri width={"100%"} height={"100%"} uri={resolvedUrl} />
          </View>
          <View style={styles.priceRow}>
            <BaseText variant="bold" style={styles.price}>
              {coin.priceUsd.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </BaseText>
            <BaseText size="sm" variant="bold" style={{ color: trendColor }}>
              {isPositive ? "+" : ""}
              {coin.change24h.toFixed(2)}% 24h
            </BaseText>
          </View>
        </View>

        {/* Chart Section */}
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <View>
              <BaseText
                size="sm"
                variant="bold"
                style={{ color: Colors.textSecondary }}
              >
                {coin.symbol} / USD
              </BaseText>
              <BaseText size="xs" style={{ color: Colors.textSecondary }}>
                {INTERVALS.find((i) => i.value === activeInterval)?.label}{" "}
                interval
              </BaseText>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <BaseText
                size="sm"
                variant="bold"
                style={{ color: Colors.white }}
              >
                {coin.priceUsd.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </BaseText>
              <BaseText size="xs" style={{ color: trendColor }}>
                {isPositive ? "+" : ""}
                {coin.change24h.toFixed(2)}%
              </BaseText>
            </View>
          </View>
          {isCandlesLoading && candlestickData.length === 0 ? (
            <View
              style={[
                styles.chartWrapper,
                { justifyContent: "center", alignItems: "center" },
              ]}
            >
              <ActivityIndicator color={Colors.primary} size="small" />
            </View>
          ) : candlestickData.length > 0 ? (
            <View
              style={styles.chartWrapper}
              onLayout={(e) => setChartWidth(e.nativeEvent.layout.width)}
            >
              <CandlestickChart.Provider data={candlestickData}>
                <CandlestickChart height={120} width={chartWidth}>
                  <CandlestickChart.Candles
                    positiveColor="#5ED6A5"
                    negativeColor={Colors.error}
                  />
                  <CandlestickChart.Crosshair />
                </CandlestickChart>
              </CandlestickChart.Provider>
            </View>
          ) : (
            <View style={styles.mockChart} />
          )}
          <View style={styles.timeTabs}>
            {INTERVALS.map((t) => {
              const isActive = activeInterval === t.value;
              return (
                <TouchableOpacity
                  key={t.value}
                  activeOpacity={0.8}
                  style={[styles.timeTab, isActive && styles.timeTabActive]}
                  onPress={() => setActiveInterval(t.value)}
                >
                  <BaseText
                    size="xs"
                    style={[
                      styles.timeTabText,
                      isActive && styles.timeTabTextActive,
                    ]}
                  >
                    {t.label}
                  </BaseText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Action Buttons */}

        <View style={{ marginBottom: 20, gap: 10 }}>
          <BaseButton
            title="Buy"
            onPress={() =>
              router.push(`/markets/${coin.symbol}/orderbook` as any)
            }
          />

          <BaseButton
            title={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            variant="outline"
            isLoading={isAdding || isRemoving}
            onPress={handleWatchlistToggle}
          />
        </View>

        <View style={styles.secondaryActions}>
          <TouchableOpacity activeOpacity={0.8} style={styles.actionBtn}>
            <BaseText variant="medium" style={styles.actionBtnText}>
              Sell
            </BaseText>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} style={styles.actionBtn}>
            <BaseText variant="medium" style={styles.actionBtnText}>
              Swap
            </BaseText>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.actionBtn}
            onPress={() => router.push(`/markets/${coin.symbol}/alert` as any)}
          >
            <BaseText variant="bold" style={styles.actionBtnText}>
              Alert
            </BaseText>
          </TouchableOpacity>
        </View>

        {/* Market Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCell}>
            <BaseText size="xs" style={styles.statLabel}>
              Market cap
            </BaseText>
            <BaseText size="md" variant="bold" style={styles.statValue}>
              {formatCompact(coin.stats.marketCapUsd, true, 2)}
            </BaseText>
          </View>
          <View style={styles.statCell}>
            <BaseText size="xs" style={styles.statLabel}>
              24h volume
            </BaseText>
            <BaseText size="md" variant="bold" style={styles.statValue}>
              {formatCompact(coin.stats.volume24hUsd, true, 1)}
            </BaseText>
          </View>
          <View style={styles.statCell}>
            <BaseText size="xs" style={styles.statLabel}>
              24h high
            </BaseText>
            <BaseText size="md" variant="bold" style={styles.statValue}>
              $
              {coin.stats.high24hUsd
                ? Math.floor(coin.stats.high24hUsd).toLocaleString()
                : "--"}
            </BaseText>
          </View>
          <View style={styles.statCell}>
            <BaseText size="xs" style={styles.statLabel}>
              Circulating
            </BaseText>
            <BaseText size="md" variant="bold" style={styles.statValue}>
              {formatCompact(coin.stats.circulatingSupply, false, 1)}{" "}
              {coin.symbol}
            </BaseText>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondary,
    paddingBottom: 80,
  },
  header: {
    paddingHorizontal: 20,
    marginTop: 40,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 24,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  content: {
    paddingHorizontal: 20,
    marginTop: 5,
    paddingBottom: 40,
  },
  priceHeader: {
    marginBottom: 14,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  price: {
    color: Colors.white,
    fontSize: 36,
  },
  chartContainer: {
    backgroundColor: Colors.cardBgAlt,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    marginBottom: 24,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  mockChart: {
    height: 120,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  chartWrapper: {
    height: 120,
    marginBottom: 16,
  },
  timeTabs: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  timeTabActive: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  timeTabText: {
    color: Colors.textSecondary,
  },
  timeTabTextActive: {
    color: Colors.white,
    fontWeight: "bold",
  },
  buyBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  buyBtnText: {
    color: Colors.secondary,
  },
  secondaryActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 15,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: "#1B1F27",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  actionBtnText: {
    color: Colors.white,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
  },
  statCell: {
    width: "48%",
    backgroundColor: "#1B1F27",
    borderRadius: 16,
    padding: 16,
    height: 86,
    justifyContent: "space-between",
  },
  statLabel: {
    color: Colors.textSecondary,
  },
  statValue: {
    color: Colors.white,
    textAlign: "right",
  },
});
