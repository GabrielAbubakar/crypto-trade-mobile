import {
  BackHeader,
  BaseButton,
  BaseText,
  BaseTouchableOpacity,
  ScreenContainer,
} from "@/components";
import { MarketCoinRow } from "@/components/markets/MarketCoinRow";
import { MarketCoinRowSkeleton } from "@/components/markets/MarketCoinRowSkeleton";
import { Colors } from "@/constants";
import { useGetWatchlistQuery } from "@/store";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";

function EmptyComponent() {
  return <BaseText>Your watchlist is empty</BaseText>;
}

const SKELETON_DATA = Array.from({ length: 3 }).map((_, index) => ({ id: index.toString() }));

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

  const renderFooter = useCallback(() => (
    <View>
      <View style={styles.addMoreContainer}>
        <BaseText size="lg" variant="bold" style={styles.addMoreTitle}>
          Want to watch more?
        </BaseText>
        <BaseText style={styles.addMoreDesc}>
          Tap the explore button to search and follow assets you like.
        </BaseText>
      </View>
      <BaseButton
        onPress={() => router.replace("/markets")}
        style={styles.exploreButton}
        title="Explore markets"
        variant="primary"
      />
    </View>
  ), [router]);

  return (
    <ScreenContainer withPadding={true} style={styles.container}>
      <BackHeader
        title="Watchlist"
        subtitle="Assets you follow with row sparklines."
      />

      {/* List content */}
      <View style={{ position: "relative", flex: 1 }}>
        <FlatList
          data={
            isLoading
              ? SKELETON_DATA
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
    paddingBottom: 30,
  },
  addMoreContainer: {
    backgroundColor: "#141820",
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    marginBottom: 100,
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
