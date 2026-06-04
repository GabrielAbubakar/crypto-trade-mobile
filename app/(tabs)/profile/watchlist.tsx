import { BackHeader, ProfileOptionCard, ScreenContainer } from "@/components";
import { BaseText } from "@/components/ui/BaseText";
import { Colors } from "@/constants";
import { useGetProfileQuery } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";

export default function WatchlistScreen() {
  const { data: profile, isLoading } = useGetProfileQuery();

  const watchlist = profile?.watchlist ?? [];

  return (
    <ScreenContainer style={styles.container} withPadding={true}>
      <BackHeader title="Watchlist" />

      <BaseText color="#8594A6" style={styles.subtitle}>
        Your favored assets for quick price tracking.
      </BaseText>

      {isLoading ? (
        <BaseText color="#FFFFFF" style={styles.loadingText}>
          Loading watchlist...
        </BaseText>
      ) : watchlist.length > 0 ? (
        <ScrollView contentContainerStyle={styles.scrollList}>
          {watchlist.map((symbol) => (
            <ProfileOptionCard
              key={symbol}
              title={symbol}
              description={`Favorite asset`}
              icon={<Ionicons name="star" size={20} color="#FFD166" />}
              iconBgColor="rgba(255, 209, 102, 0.12)"
              rightElement={<View />} // hides chevron
            />
          ))}
        </ScrollView>
      ) : (
        /* Empty State */
        <View style={styles.emptyContainer}>
          <Ionicons name="star-outline" size={60} color="#8594A6" style={styles.emptyIcon} />
          <BaseText variant="bold" color="#FFFFFF" style={styles.emptyTitle}>
            Empty Watchlist
          </BaseText>
          <BaseText size="sm" color="#8594A6" style={styles.emptyText}>
            Add coins to your favorites to see them here.
          </BaseText>
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondary,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 20,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 40,
  },
  scrollList: {
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 60,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  emptyText: {
    textAlign: "center",
    lineHeight: 22,
  },
});
