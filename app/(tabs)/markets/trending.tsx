import { BaseText, BaseTouchableOpacity, ScreenContainer } from "@/components";
import { MarketCoinRow } from "@/components/markets/MarketCoinRow";
import { MarketCoinRowSkeleton } from "@/components/markets/MarketCoinRowSkeleton";
import { Sparkline } from "@/components/ui/Sparkline";
import { Colors } from "@/constants";
import { useGetTrendingAssetsQuery } from "@/store";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";

function EmptyComponent() {
  return <BaseText>No trending data available</BaseText>;
}

export default function TrendingScreen() {
  const router = useRouter();

  const {
    data: trendingData,
    isLoading,
    isFetching,
    refetch,
  } = useGetTrendingAssetsQuery(
    { include: "sparkline" },
    { pollingInterval: 15000 },
  );

  const renderCoinItem = ({ item }: { item: any }) =>
    isFetching ? (
      <MarketCoinRowSkeleton key={item.id} />
    ) : (
      <BaseTouchableOpacity
        onPress={() => router.push(`/markets/${item.symbol}` as any)}
      >
        <MarketCoinRow key={item.id} {...item} />
      </BaseTouchableOpacity>
    );

  const renderHeader = () => (
    <View style={styles.listHeader}>
      {/* Top Gainer Banner */}
      <View style={styles.topGainerBanner}>
        <View style={styles.topGainerLeft}>
          <BaseText style={styles.topGainerLabel}>TOP GAINER - 24H</BaseText>
          <BaseText size="3xl" variant="bold" style={styles.topGainerName}>
            {trendingData?.data[0].name}
          </BaseText>
          <BaseText style={styles.topGainerDesc}>Highest 24h move</BaseText>
          <View style={styles.viewAssetButton}>
            <BaseTouchableOpacity
              onPress={() => router.push(`/markets/${trendingData?.data[0].symbol}` as any)}
            >
              <BaseText style={styles.viewAssetText}>View asset</BaseText>
            </BaseTouchableOpacity>
          </View>
        </View>
        <View style={styles.topGainerRight}>
          <BaseText size="xl" variant="bold" style={styles.topGainerPrice}>
            {trendingData?.data[0].priceUsd.toLocaleString("en-US", {
              currency: "USD",
              style: "currency",
            })}
          </BaseText>
          <BaseText
            variant="bold"
            style={styles.topGainerChange}
            color={
              (trendingData?.data[0].change24h as number) > 0
                ? Colors.success
                : Colors.error
            }
          >
            {(trendingData?.data[0].change24h as number) > 0
              ? `+${trendingData?.data[0].change24h}`
              : trendingData?.data[0].change24h}
          </BaseText>
          <View style={{ marginTop: 10 }}>
            {/* Mock chart for the banner */}
            <Sparkline
              color={
                (trendingData?.data[0].change24h as number) > 0
                  ? Colors.success
                  : Colors.error
              }
              data={trendingData?.data[0].sparkline}
              height={60}
              width={150}
            />
          </View>
        </View>
      </View>

      {/* Market Pulse */}
      <View style={styles.marketPulseContainer}>
        <View style={styles.marketPulseHeader}>
          <View>
            <BaseText size="lg" variant="bold" style={{ color: Colors.white }}>
              Market pulse
            </BaseText>
            <BaseText style={{ color: Colors.textSecondary, fontSize: 13 }}>
              Simulated live feed
            </BaseText>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <BaseText size="md" variant="bold" style={{ color: Colors.white }}>
              +2.8% avg
            </BaseText>
            <BaseText style={{ color: "#20D472", fontSize: 13 }}>
              Refreshing
            </BaseText>
          </View>
        </View>

        {/* Mock large chart for market pulse */}
        <View style={styles.pulseChartContainer}>
          <Sparkline
            data={[
              { time: "1", priceUsd: 100 },
              { time: "2", priceUsd: 102 },
              { time: "3", priceUsd: 101 },
              { time: "4", priceUsd: 105 },
              { time: "5", priceUsd: 104 },
              { time: "6", priceUsd: 108 },
              { time: "7", priceUsd: 110 },
            ]}
            color="#20D472"
            width={320}
            height={60}
          />
        </View>

        {/* Pulse time tabs */}
        <View style={styles.pulseTabs}>
          {["1H", "1D", "1W", "1M", "1Y"].map((t) => (
            <View
              key={t}
              style={[styles.pulseTab, t === "1D" && styles.pulseTabActive]}
            >
              <BaseText
                style={[
                  styles.pulseTabText,
                  t === "1D" && styles.pulseTabTextActive,
                ]}
              >
                {t}
              </BaseText>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <ScreenContainer withPadding={false} style={styles.container}>
      <View style={styles.header}>
        <BaseText size="3xl" variant="bold" style={styles.title}>
          Trending
        </BaseText>
        <BaseText size="md" style={styles.subtitle}>
          Top moving assets from the simulated market feed.
        </BaseText>
      </View>

      {/* List content */}
      <View style={{ position: "relative", flex: 1 }}>
        <FlatList
          data={
            isFetching
              ? Array.from({ length: 5 }).map((_, index) => ({ id: index }))
              : trendingData?.data
          }
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={EmptyComponent}
          ItemSeparatorComponent={() => (
            <View
              style={{
                width: "100%",
                height: 6,
                backgroundColor: "transparent",
              }}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={() => refetch()} />
          }
          renderItem={renderCoinItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
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
    marginBottom: 20,
    gap: 10,
  },
  title: {
    color: Colors.white,
  },
  subtitle: {
    color: Colors.textSecondary,
  },

  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  listHeader: {
    marginBottom: 20,
    gap: 16,
  },
  topGainerBanner: {
    backgroundColor: "#0D4F36",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  topGainerLeft: {
    flex: 0.7,
  },
  topGainerLabel: {
    color: "#9AF2CB",
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 8,
  },
  topGainerName: {
    color: Colors.white,
    marginBottom: 4,
  },
  topGainerDesc: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginBottom: 16,
  },
  viewAssetButton: {
    backgroundColor: "#20D47220",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  viewAssetText: {
    color: "#20D472",
    fontSize: 12,
    fontWeight: "600",
  },
  topGainerRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  topGainerPrice: {
    color: Colors.white,
  },
  topGainerChange: {
    color: "#20D472",
    fontSize: 14,
  },
  marketPulseContainer: {
    backgroundColor: "#141820",
    borderRadius: 16,
    padding: 20,
  },
  marketPulseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  pulseChartContainer: {
    height: 60,
    marginBottom: 20,
    alignItems: "center",
  },
  pulseTabs: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pulseTab: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  pulseTabActive: {
    backgroundColor: "#163625",
  },
  pulseTabText: {
    color: "#777777",
    fontSize: 12,
    fontWeight: "600",
  },
  pulseTabTextActive: {
    color: "#20D472",
  },
});
