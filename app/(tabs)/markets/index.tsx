import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { ScreenContainer, BaseText, UserHeader, MarketCoinRow } from "@/components";
import { Colors, MARKET_TABS, initialCoinsData } from "@/constants";
import SearchIcon from "@/assets/icons/main/search.svg";
import QrIcon from "@/assets/icons/main/scanner.svg";
import NotificationIcon from "@/assets/icons/main/notification.svg";
import type { HeaderButtonProps } from "@/components";
import { Feather } from "@expo/vector-icons";

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

export default function MarketsScreen() {
  const [selectedTab, setSelectedTab] = useState<string>("Spot");

  return (
    <ScreenContainer withPadding={false} scrollable style={styles.container}>
      {/* Header */}
      <UserHeader userButtons={headerButtons} />

      {/* Tabs Row */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabsBackground}>
          {MARKET_TABS.map((tab) => {
            const isActive = selectedTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                activeOpacity={0.8}
                onPress={() => setSelectedTab(tab)}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
              >
                <BaseText
                  variant={isActive ? "bold" : "regular"}
                  style={[styles.tabText, isActive && styles.tabTextActive]}
                >
                  {tab}
                </BaseText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Coins Market List */}
      <View style={styles.listContainer}>
        {initialCoinsData.map((coin) => (
          <MarketCoinRow key={coin.id} coin={coin} />
        ))}
      </View>

      {/* Add Favorite Button */}
      <View style={styles.actionContainer}>
        <TouchableOpacity activeOpacity={0.8} style={styles.favoriteButton}>
          <Feather name="plus" size={16} color={Colors.textSecondary} />
          <BaseText style={styles.favoriteButtonText}>Add Favorite</BaseText>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondary,
  },
  tabsContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 20,
  },
  tabsBackground: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
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
    backgroundColor: "#2E3A45",
  },
  tabText: {
    color: "#777777",
    fontSize: 14,
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  listContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  actionContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 140, // extra spacing so the float bottom tab doesn't cut it off
  },
  favoriteButton: {
    flexDirection: "row",
    height: 56,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderStyle: "dashed",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "transparent",
  },
  favoriteButtonText: {
    color: "#777777",
    fontSize: 15,
    fontWeight: "600",
  },
});
