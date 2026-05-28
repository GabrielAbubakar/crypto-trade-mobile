import NotificationIcon from "@/assets/icons/main/notification.svg";
import QrIcon from "@/assets/icons/main/scanner.svg";
import SearchIcon from "@/assets/icons/main/search.svg";
import type { HeaderButtonProps } from "@/components";
import {
  ActionMenu,
  BaseText,
  CoinCard,
  CoinCardSkeleton,
  GridMenu,
  ScreenContainer,
  UserHeader,
} from "@/components";
import { useGetMarketAssetsQuery, useGetTrendingAssetsQuery } from "@/store";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const headerButtons: HeaderButtonProps[] = [
  {
    link: "/home/search",
    icon: SearchIcon,
  },
  {
    link: "/home/qr-scan",
    icon: QrIcon,
  },
  {
    link: "/home/notifications",
    icon: NotificationIcon,
  },
];

export default function HomeScreen() {
  const { data: trendingData, isLoading: trendingIsLoading } =
    useGetTrendingAssetsQuery();
  const { data: marketData, isLoading: marketIsLoading } =
    useGetMarketAssetsQuery();

  // useEffect(() => {
  //   if (trendingData) {
  //     console.log("Trending Assets:", trendingData);
  //     console.log("Market Assets:", marketData);
  //   }
  // }, [trendingData, marketData]);

  return (
    <ScreenContainer withPadding={false} scrollable>
      <UserHeader userButtons={headerButtons} />

      <GridMenu />

      {/* Main light background containing actions and listings */}
      <View style={styles.lightBackground}>
        {/* Action Menu (P2P & Card buttons) */}
        <ActionMenu />

        {/* Recent Coins Section */}
        <View style={styles.sectionContainer}>
          <BaseText variant="bold" style={styles.sectionTitle}>
            Recent Coin
          </BaseText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
            style={styles.scrollView}
          >
            {trendingIsLoading || marketIsLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <CoinCardSkeleton key={`skeleton-${index}`} />
                ))
              : marketData?.data.map((coin) => (
                  <CoinCard key={coin.id} {...coin} />
                ))}
          </ScrollView>
        </View>

        {/* Top Coins Section */}
        <View style={styles.sectionContainer}>
          <BaseText variant="bold" style={styles.sectionTitle}>
            Top Coins
          </BaseText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
            style={styles.scrollView}
          >
            {trendingIsLoading || marketIsLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <CoinCardSkeleton key={`skeleton-${index}`} />
                ))
              : trendingData?.data.map((coin) => (
                  <CoinCard key={coin.id} {...coin} />
                ))}
          </ScrollView>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  lightBackground: {
    backgroundColor: "#FFFFFF",
    flex: 1,
    paddingTop: 24,
    paddingBottom: 150, // Space for the floating bottom tab bar
  },
  sectionContainer: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#1B232A",
    marginBottom: 16,
    marginLeft: 20,
  },
  scrollView: {
    overflow: "visible",
  },
  horizontalScrollContent: {
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 8,
    // paddingBottom: 24,  // Extra bottom padding so the large card shadow doesn't get cut off
  },
});
