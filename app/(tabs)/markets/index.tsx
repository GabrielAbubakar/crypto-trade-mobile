import {
  BaseInput,
  BaseText,
  BaseTouchableOpacity,
  ScreenContainer,
  ScreenHeader,
} from "@/components";
import { MarketCoinRow } from "@/components/markets/MarketCoinRow";
import { MarketCoinRowSkeleton } from "@/components/markets/MarketCoinRowSkeleton";
import { Colors, MARKET_TABS } from "@/constants";
import { useGetMarketAssetsQuery } from "@/store";
import type { IGetMarketAssetsRequest } from "@/types";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

function EmptyComponent({ searchQuery }: { searchQuery?: string }) {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconWrapper}>
        <Feather name="search" size={32} color="#777777" />
      </View>
      <BaseText size="lg" variant="bold" style={styles.emptyTitle}>
        No assets found
      </BaseText>
      <BaseText size="sm" style={styles.emptySubtitle}>
        {searchQuery
          ? `We couldn't find any results for "${searchQuery}". Try searching for another asset.`
          : "There are no assets available at the moment."}
      </BaseText>
    </View>
  );
}

const SKELETON_DATA = Array.from({ length: 5 }).map((_, index) => ({ id: index.toString() }));

export default function MarketsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [queryParams, setQueryParams] = useState<IGetMarketAssetsRequest>({
    include: "sparkline",
  });

  const { data: trendingData, isLoading } = useGetMarketAssetsQuery(
    queryParams,
    { pollingInterval: 5000 },
  );

  useEffect(() => {
    setQueryParams((prev) => ({
      ...prev,
      q: searchQuery || undefined,
    }));
  }, [searchQuery]);

  const handleTabPress = (tabName: string) => {
    if (tabName === "Gainers") {
      router.push("/markets/trending");
    } else if (tabName === "Watchlist") {
      router.push("/markets/watchlist");
    }
  };

  const renderCoinItem = useCallback(({ item }: { item: any }) => {
    return isLoading ? (
      <MarketCoinRowSkeleton key={item.id} />
    ) : (
      <BaseTouchableOpacity
        key={item.id}
        onPress={() => router.push(`/markets/${item.symbol}` as any)}
      >
        <MarketCoinRow {...item} />
      </BaseTouchableOpacity>
    );
  }, [isLoading, router]);

  return (
    <ScreenContainer withPadding={false} style={styles.container}>
      <View style={styles.header}>
        <ScreenHeader
          title="Markets"
          subtitle="Search assets, view live prices, and open a coin detail screen."
          style={{ marginTop: 0, marginBottom: 0 }}
        />

        <BaseInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={{ backgroundColor: "#141820" }}
          placeholder="Search coin or symbol"
        />
      </View>

      {/* Tabs Row */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabsBackground}>
          {MARKET_TABS.map((tab) => {
            const isActive = tab === "All";
            return (
              <TouchableOpacity
                key={tab}
                activeOpacity={0.8}
                onPress={() => handleTabPress(tab)}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
              >
                <BaseText
                  style={[styles.tabText, isActive && styles.tabTextActive]}
                >
                  {tab}
                </BaseText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* List content */}
      <View style={{ position: "relative", flex: 1 }}>
        <FlatList
          data={
            isLoading
              ? SKELETON_DATA
              : trendingData?.data
          }
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<EmptyComponent searchQuery={searchQuery} />}
          ItemSeparatorComponent={() => (
            <View
              style={{
                width: "100%",
                height: 6,
                backgroundColor: "transparent",
              }}
            />
          )}
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
    gap: 10,
  },
  title: {
    color: Colors.white,
  },
  subtitle: {
    color: Colors.textSecondary,
  },
  tabsContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 20,
  },
  tabsBackground: {
    flexDirection: "row",
    backgroundColor: "#161C22",
    borderRadius: 14,
    padding: 4,
    justifyContent: "space-between",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: "#1B232A",
  },
  tabText: {
    color: "#777777",
    fontSize: 14,
  },
  tabTextActive: {
    color: "#C1C7CD",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100, // ensure content isn't hidden behind the bottom tab bar
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#161C22",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    color: Colors.white,
    marginBottom: 8,
  },
  emptySubtitle: {
    color: "#777777",
    textAlign: "center",
    lineHeight: 20,
  },
});
