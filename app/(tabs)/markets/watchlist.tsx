import { BaseText, BaseTouchableOpacity, ScreenContainer } from "@/components";
import { MarketCoinRow } from "@/components/markets/MarketCoinRow";
import { MarketCoinRowSkeleton } from "@/components/markets/MarketCoinRowSkeleton";
import { Colors } from "@/constants";
import { useGetWatchlistQuery } from "@/store";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

function EmptyComponent() {
  return <BaseText>Your watchlist is empty</BaseText>;
}

export default function WatchlistScreen() {
  const router = useRouter();

  // For now, we'll just mock the watchlist by grabbing a few specific assets from the main API
  // In a real app, this would use a specific watchlist endpoint.
  const {
    data: marketData,
    isLoading,
    isFetching,
    refetch,
  } = useGetWatchlistQuery({ include: "sparkline" });

  console.log(marketData);

  const renderCoinItem = ({ item }: { item: any }) =>
    isLoading ? (
      <MarketCoinRowSkeleton key={item.id} />
    ) : (
      <BaseTouchableOpacity
        key={item.id}
        onPress={() => router.push(`/markets/${item.symbol}` as any)}
      >
        <MarketCoinRow {...item} />
      </BaseTouchableOpacity>
    );

  const renderFooter = () => (
    <View style={styles.addMoreContainer}>
      <BaseText size="lg" variant="bold" style={styles.addMoreTitle}>
        Add more assets
      </BaseText>
      <BaseText style={styles.addMoreDesc}>
        Use the market list to add coins to your watchlist.
      </BaseText>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.exploreButton}
        onPress={() => router.replace("/markets")}
      >
        <BaseText variant="bold" style={styles.exploreButtonText}>
          Explore markets
        </BaseText>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenContainer withPadding={false} style={styles.container}>
      <View style={styles.header}>
        <BaseText size="3xl" variant="bold" style={styles.title}>
          Watchlist
        </BaseText>
        <BaseText size="md" style={styles.subtitle}>
          Assets you follow with row sparklines.
        </BaseText>
      </View>

      {/* List content */}
      <View style={{ position: "relative", flex: 1 }}>
        <FlatList
          data={
            isLoading
              ? Array.from({ length: 3 }).map((_, index) => ({ id: index }))
              : marketData
          }
          keyExtractor={(item) => item.id}
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
          ListFooterComponent={renderFooter}
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
    marginBottom: 30,
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
    paddingBottom: 30,
  },
  addMoreContainer: {
    backgroundColor: "#141820",
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
  },
  addMoreTitle: {
    color: Colors.white,
    marginBottom: 8,
  },
  addMoreDesc: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 24,
    lineHeight: 20,
  },
  exploreButton: {
    backgroundColor: "#4EE19B",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  exploreButtonText: {
    color: Colors.secondary,
    fontSize: 16,
  },
});
