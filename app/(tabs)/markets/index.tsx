import NotificationIcon from "@/assets/icons/main/notification.svg";
import QrIcon from "@/assets/icons/main/scanner.svg";
import SearchIcon from "@/assets/icons/main/search.svg";
import type { HeaderButtonProps } from "@/components";
import {
  BaseText,
  MarketTabsView,
  ScreenContainer,
  UserHeader,
} from "@/components";
import { Colors } from "@/constants";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

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
  return (
    <ScreenContainer withPadding={false} scrollable style={styles.container}>
      {/* Header */}
      <UserHeader userButtons={headerButtons} />

      <View style={styles.header}>
        <BaseText size="3xl" variant="bold" style={styles.title}>
          Markets
        </BaseText>
        <BaseText size="md" style={styles.subtitle}>
          Search assets, view live prices, and open a coin detail screen.
        </BaseText>
      </View>

      <MarketTabsView />

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
