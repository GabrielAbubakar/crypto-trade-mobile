import { BaseButton, BaseText, ScreenContainer, ScreenHeader, Skeleton } from "@/shared/ui";
import { Colors } from "@/shared/constants";
import { useGetAssetCandlesQuery } from "@/features/trading";
import { useGetProfileQuery } from "@/features/profile";
import { useGetAssetDetailsQuery } from "@/features/trading/api/marketApi";
import { useRouter } from "expo-router";
import React from "react";
import {
    ActivityIndicator,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { CandlestickChart } from "react-native-wagmi-charts";

const { width: screenWidth } = Dimensions.get("window");

const INTERVALS = [
  { label: "1m", value: "1m" as const },
  { label: "5m", value: "5m" as const },
  { label: "15m", value: "15m" as const },
  { label: "1H", value: "1h" as const },
  { label: "1D", value: "1d" as const },
];

export default function TradingScreen() {
  const router = useRouter();
  const [activeInterval, setActiveInterval] = React.useState<
    "1m" | "5m" | "15m" | "1h" | "1d"
  >("1h");
  const [chartWidth, setChartWidth] = React.useState(screenWidth - 72);

  const { data: btcDetails, isLoading } = useGetAssetDetailsQuery("BTC", {
    pollingInterval: 15000,
  });
  const { data: user, isLoading: userLoading } = useGetProfileQuery();

  const { data: candlesResponse, isLoading: isCandlesLoading } =
    useGetAssetCandlesQuery(
      { symbol: "BTC", interval: activeInterval, limit: 50 },
      { pollingInterval: 15000 },
    );

  const candlestickData = React.useMemo(() => {
    if (!candlesResponse?.data) return [];
    return candlesResponse.data.map((point) => ({
      timestamp: new Date(point.time).getTime(),
      open: point.openUsd,
      high: point.highUsd,
      low: point.lowUsd,
      close: point.closeUsd,
    }));
  }, [candlesResponse?.data]);

  const handleNavigate = (type: "buy" | "sell" | "swap") => {
    router.push({
      pathname: "/(tabs)/trades/operation",
      params: { type },
    });
  };

  const formattedPrice = btcDetails?.priceUsd
    ? btcDetails.priceUsd.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      })
    : "$64,200.50";

  const changePct = btcDetails?.change24h ?? 2.1;
  const isPositive = changePct >= 0;

  return (
    <ScreenContainer withPadding={true} scrollable style={styles.container}>
      <ScreenHeader
        title="Trade"
        subtitle="Buy, sell, or swap with quotes that expire before execution."
        style={{ marginTop: 20 }}
      />

      {/* Chart Card */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <View>
            <BaseText style={styles.pairLabel} variant="bold">
              BTC / USDT
            </BaseText>
            <BaseText style={styles.priceValue} variant="bold">
              {isLoading ? "Loading..." : formattedPrice}
            </BaseText>
          </View>
          {!isLoading && (
            <View
              style={[
                styles.changeBadge,
                { backgroundColor: isPositive ? "#23362F" : "#362323" },
              ]}
            >
              <BaseText
                variant="bold"
                style={[
                  styles.changeText,
                  { color: isPositive ? Colors.primary : Colors.error },
                ]}
              >
                {isPositive
                  ? `+${changePct.toFixed(1)}%`
                  : `${changePct.toFixed(1)}%`}
              </BaseText>
            </View>
          )}
        </View>

        {isCandlesLoading && candlestickData.length === 0 ? (
          <View
            style={[
              styles.chartLoader,
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
          <View style={styles.chartLoader}>
            <ActivityIndicator size="small" color={Colors.primary} />
          </View>
        )}

        <View style={styles.timeframes}>
          {INTERVALS.map((t) => {
            const isActive = activeInterval === t.value;
            return (
              <TouchableOpacity
                key={t.value}
                activeOpacity={0.8}
                style={[
                  styles.timeframePill,
                  isActive && styles.timeframeActive,
                ]}
                onPress={() => setActiveInterval(t.value)}
              >
                <BaseText
                  style={[
                    styles.timeframeText,
                    isActive && styles.timeframeTextActive,
                  ]}
                >
                  {t.label}
                </BaseText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {userLoading ? (
        <View style={styles.actionList}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={[styles.actionItem, { opacity: 0.6 }]}>
              <View style={styles.leftCol}>
                <Skeleton
                  width={44}
                  height={44}
                  borderRadius={22}
                  style={{ marginRight: 16 }}
                />
                <View style={styles.infoCol}>
                  <Skeleton
                    width={120}
                    height={16}
                    borderRadius={8}
                    style={{ marginBottom: 8 }}
                  />
                  <Skeleton width={180} height={12} borderRadius={6} />
                </View>
              </View>
              <Skeleton width={60} height={28} borderRadius={14} />
            </View>
          ))}
        </View>
      ) : user?.verification.canTrade ? (
        <View style={styles.actionList}>
          {/* Buy Option */}
          <TouchableOpacity
            style={styles.actionItem}
            activeOpacity={0.8}
            onPress={() => handleNavigate("buy")}
          >
            <View style={styles.leftCol}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: "rgba(94, 213, 168, 0.1)" },
                ]}
              >
                <View
                  style={[
                    styles.iconInner,
                    { backgroundColor: Colors.primary },
                  ]}
                />
              </View>
              <View style={styles.infoCol}>
                <BaseText variant="bold" style={styles.actionTitle}>
                  Buy crypto
                </BaseText>
                <BaseText style={styles.actionSubtitle}>
                  Pay USDT and receive BTC
                </BaseText>
              </View>
            </View>
            <View
              style={[
                styles.badgePill,
                { backgroundColor: "rgba(94, 213, 168, 0.15)" },
              ]}
            >
              <BaseText
                variant="bold"
                style={[styles.badgePillText, { color: Colors.primary }]}
              >
                Buy
              </BaseText>
            </View>
          </TouchableOpacity>

          {/* Sell Option */}
          <TouchableOpacity
            style={styles.actionItem}
            activeOpacity={0.8}
            onPress={() => handleNavigate("sell")}
          >
            <View style={styles.leftCol}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: "rgba(255, 77, 77, 0.1)" },
                ]}
              >
                <View
                  style={[styles.iconInner, { backgroundColor: Colors.error }]}
                />
              </View>
              <View style={styles.infoCol}>
                <BaseText variant="bold" style={styles.actionTitle}>
                  Sell crypto
                </BaseText>
                <BaseText style={styles.actionSubtitle}>
                  Sell ETH or BTC back to USDT
                </BaseText>
              </View>
            </View>
            <View
              style={[
                styles.badgePill,
                { backgroundColor: "rgba(255, 77, 77, 0.15)" },
              ]}
            >
              <BaseText
                variant="bold"
                style={[styles.badgePillText, { color: Colors.error }]}
              >
                Sell
              </BaseText>
            </View>
          </TouchableOpacity>

          {/* Swap Option */}
          <TouchableOpacity
            style={styles.actionItem}
            activeOpacity={0.8}
            onPress={() => handleNavigate("swap")}
          >
            <View style={styles.leftCol}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: "rgba(94, 213, 168, 0.1)" },
                ]}
              >
                <View
                  style={[styles.iconInner, { backgroundColor: "#5ED5A8" }]}
                />
              </View>
              <View style={styles.infoCol}>
                <BaseText variant="bold" style={styles.actionTitle}>
                  Swap assets
                </BaseText>
                <BaseText style={styles.actionSubtitle}>
                  Convert between supported coins
                </BaseText>
              </View>
            </View>
            <View
              style={[
                styles.badgePill,
                { backgroundColor: "rgba(94, 213, 168, 0.15)" },
              ]}
            >
              <BaseText
                variant="bold"
                style={[styles.badgePillText, { color: Colors.primary }]}
              >
                Swap
              </BaseText>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.lockedContainer}>
          <View style={styles.lockedCard}>
            <View style={styles.lockedBadge}>
              <BaseText variant="bold" style={styles.lockedBadgeText}>
                Locked
              </BaseText>
            </View>
            <BaseText style={styles.lockedDescription}>
              Complete KYC before you can request buy, sell, or swap quotes.
            </BaseText>
            <View style={styles.limitRow}>
              <BaseText style={styles.limitLabel}>Trade limit</BaseText>
              <BaseText variant="bold" style={styles.limitValue}>
                $0
              </BaseText>
            </View>
          </View>
          <BaseButton
            title="Verify identity"
            onPress={() => router.push("/kyc")}
            style={styles.verifyBtn}
            textStyle={{ color: Colors.secondary }}
          />
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondary,
    flex: 1,
    paddingBottom: 100,
  },
  chartCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    padding: 20,
    marginTop: 20,
    marginBottom: 28,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  pairLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 28,
    color: Colors.white,
  },
  changeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  changeText: {
    fontSize: 12,
  },
  chartWrapper: {
    height: 120,
    marginVertical: 12,
  },
  chartLoader: {
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  timeframes: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
    paddingTop: 16,
  },
  timeframePill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timeframeActive: {
    backgroundColor: "#161C22",
  },
  timeframeText: {
    fontSize: 12,
    color: "#777777",
  },
  timeframeTextActive: {
    color: Colors.white,
  },
  actionList: {
    gap: 16,
  },
  actionItem: {
    backgroundColor: Colors.cardBgAlt,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.04)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
  },
  leftCol: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  iconInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  infoCol: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    color: Colors.white,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  badgePill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  badgePillText: {
    fontSize: 12,
  },
  lockedContainer: {
    marginTop: 10,
    width: "100%",
  },
  lockedCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
  },
  lockedBadge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255, 77, 77, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  lockedBadgeText: {
    color: Colors.error,
    fontSize: 16,
  },
  lockedDescription: {
    color: Colors.textSecondary,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  limitRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
    paddingTop: 18,
  },
  limitLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  limitValue: {
    color: Colors.error,
    fontSize: 14,
  },
  verifyBtn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    marginTop: 8,
  },
});
