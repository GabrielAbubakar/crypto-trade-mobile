import NotificationIcon from "@/assets/icons/main/notification.svg";
import QrIcon from "@/assets/icons/main/scanner.svg";
import SearchIcon from "@/assets/icons/main/search.svg";
import type { HeaderButtonProps } from "@/components";
import {
  BaseText,
  BaseTouchableOpacity,
  CoinCard,
  CoinCardSkeleton,
  ScreenContainer,
  UserHeader,
} from "@/components";
import {
  useGetProfileQuery,
  useGetTrendingAssetsQuery,
  useGetWalletBalancesQuery,
} from "@/store";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";

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
  const {
    data: trendingData,
    isFetching: trendingIsLoading,
    refetch: refetchTrending,
  } = useGetTrendingAssetsQuery(undefined);
  const {
    data: user,
    refetch: refetchUser,
    isLoading: userIsLoading,
  } = useGetProfileQuery();
  const {
    data: walletData,
    refetch: refetchWallet,
    isLoading: walletIsLoading,
  } = useGetWalletBalancesQuery();

  // console.log(walletData);

  function handleRefresh() {
    refetchTrending();
    refetchUser();
    refetchWallet();
  }

  // useEffect(() => {
  //   if (trendingData) {
  //     console.log("Trending Assets:", trendingData);
  //     console.log("Market Assets:", marketData);
  //   }
  // }, [trendingData, marketData]);

  return (
    <ScreenContainer withPadding={false}>
      <UserHeader userButtons={headerButtons} />

      {/* Main light background containing actions and listings */}
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={trendingIsLoading || userIsLoading || walletIsLoading}
            onRefresh={handleRefresh}
          />
        }
        contentContainerStyle={styles.lightBackgroundContent}
        style={styles.lightBackground}
      >
        <View style={styles.main}>
          <View style={styles.headerContainer}>
            <BaseText variant="bold" size="3xl">
              Hello, {user?.fullName}
            </BaseText>

            {/* <Button onPress={() => router.push("/kyc")} title="Complete KYC" /> */}

            {!user?.verification?.canTrade && (
              <BaseText color="#8594A6">
                Your portfolio is growing. Complete verification to unlock
                trading and withdrawals.
              </BaseText>
            )}
          </View>

          {/* Intro Card with balance */}
          <View style={styles.introCard}>
            <BaseText size="xs" variant="medium" style={styles.introBadge}>
              {walletData?.verification.label} level
            </BaseText>
            <BaseText size="3xl" variant="bold">
              {walletData?.portfolioValue.toLocaleString("en-US", {
                style: "currency",
                currency: walletData?.portfolioCurrency,
              })}
            </BaseText>
            <BaseText size="sm" color="#8594A6" style={styles.portfolioLabel}>
              Portfolio Balance
            </BaseText>
          </View>

          {/* Begin 2FA */}
          {!user?.verification?.canTrade && (
            <View style={styles.verify}>
              <View style={styles.warningCircle}>
                <BaseText variant="bold" size="xxl" color="#E5A93C">
                  !
                </BaseText>
              </View>
              <View style={styles.verifyTextContainer}>
                <BaseText variant="bold" size="lg" color="#FFFFFF">
                  Verify to trade
                </BaseText>
                <BaseText
                  size="sm"
                  color="#8594A6"
                  style={styles.verifySubtitle}
                >
                  Trading and withdrawals are locked until your identity is
                  approved.
                </BaseText>
              </View>
              <BaseTouchableOpacity
                onPress={() => router.push("/kyc")}
                style={styles.startButton}
              >
                <BaseText variant="bold" size="md" color="#5ED5A8">
                  Start
                </BaseText>
              </BaseTouchableOpacity>
            </View>
          )}
        </View>

        {/* Top Coins Section */}
        <View style={styles.sectionContainer}>
          <BaseText variant="bold" size="lg" style={styles.sectionTitle}>
            Trending Assets
          </BaseText>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
            style={styles.scrollView}
          >
            {trendingIsLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <CoinCardSkeleton key={`skeleton-${index}`} />
                ))
              : trendingData?.data.map((coin) => (
                  <CoinCard key={coin.id} {...coin} />
                ))}
          </ScrollView>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  lightBackground: {
    flex: 1,
  },
  lightBackgroundContent: {
    paddingTop: 24,
    paddingBottom: 100,
  },
  sectionContainer: {
    marginBottom: 28,
  },
  sectionTitle: {
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
  },
  main: {
    marginHorizontal: 20,
  },
  headerContainer: {
    marginBottom: 26,
  },
  introCard: {
    backgroundColor: "#083D2B",
    padding: 22,
    paddingVertical: 32,
    borderRadius: 20,
    marginBottom: 30,
  },
  introBadge: {
    backgroundColor: "#1B1F27",
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 10,
  },
  portfolioLabel: {
    marginTop: 10,
  },
  verify: {
    backgroundColor: "#141820",
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  warningCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(229, 169, 60, 0.15)",
    alignItems: "center",
    alignSelf: "flex-start",
    justifyContent: "center",
  },
  verifyTextContainer: {
    flex: 1,
    flexShrink: 1,
    gap: 4,
  },
  verifySubtitle: {
    lineHeight: 18,
    flexShrink: 1,
  },
  startButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
});
