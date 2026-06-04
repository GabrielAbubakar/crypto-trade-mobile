import {
  BackHeader,
  BaseButton,
  ProfileOptionCard,
  ScreenContainer,
} from "@/components";
import { BaseText } from "@/components/ui/BaseText";
import { Colors } from "@/constants";
import { showSuccessToast } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  type: "kyc" | "wallet" | "alert";
  time: string;
}

export default function NotificationsScreen() {
  const initialNotifications: NotificationItem[] = [
    {
      id: "1",
      title: "KYC approved",
      message: "You can now trade and withdraw.",
      isRead: false,
      type: "kyc",
      time: "Now",
    },
    {
      id: "2",
      title: "USDT deposit completed",
      message: "250 USDT added to wallet.",
      isRead: false,
      type: "wallet",
      time: "Now",
    },
    {
      id: "3",
      title: "BTC price alert",
      message: "BTC crossed your target.",
      isRead: true,
      type: "alert",
      time: "Read",
    },
  ];

  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications);

  const handleMarkAllRead = () => {
    setNotifications(
      notifications.map((n) => ({ ...n, isRead: true, time: "Read" })),
    );
    showSuccessToast("All notifications marked as read");
  };

  const handleClearAll = () => {
    setNotifications([]);
    showSuccessToast("Notifications cleared!");
  };

  const getIcon = (type: "kyc" | "wallet" | "alert", isRead: boolean) => {
    const color = isRead ? "#8594A6" : "#5ED5A8";
    switch (type) {
      case "kyc":
        return <Ionicons name="card-outline" size={20} color={color} />;
      case "wallet":
        return <Ionicons name="wallet-outline" size={20} color={color} />;
      case "alert":
        return <Ionicons name="trending-up-outline" size={20} color={color} />;
    }
  };

  return (
    <ScreenContainer style={styles.container} withPadding={true}>
      <BackHeader title="Notifications" />

      <BaseText color="#8594A6" style={styles.subtitle}>
        Security, KYC, transaction, and alert messages.
      </BaseText>

      {notifications.length > 0 ? (
        <View style={{ flex: 1 }}>
          <View style={styles.actionsRow}>
            <BaseButton
              title="Mark all as read"
              variant="secondary"
              onPress={handleMarkAllRead}
              style={styles.markReadBtn}
            />
            <BaseButton
              title="Clear all"
              variant="secondary"
              onPress={handleClearAll}
              style={styles.clearBtn}
            />
          </View>

          <ScrollView contentContainerStyle={styles.scrollList}>
            {notifications.map((notif) => (
              <ProfileOptionCard
                key={notif.id}
                title={notif.title}
                description={notif.message}
                icon={getIcon(notif.type, notif.isRead)}
                iconBgColor={notif.isRead ? "#1A2130" : "#23362F"}
                rightElement={
                  <View
                    style={notif.isRead ? styles.badgeRead : styles.badgeNow}
                  >
                    <BaseText
                      variant="bold"
                      size="xs"
                      color={notif.isRead ? "#8594A6" : "#5ED5A8"}
                    >
                      {notif.time}
                    </BaseText>
                  </View>
                }
              />
            ))}
          </ScrollView>
        </View>
      ) : (
        /* Empty State */
        <View style={styles.emptyContainer}>
          <Ionicons
            name="sparkles-outline"
            size={60}
            color="#5ED5A8"
            style={styles.emptyIcon}
          />
          <BaseText variant="bold" color="#FFFFFF" style={styles.emptyTitle}>
            All caught up
          </BaseText>
          <BaseText size="sm" color="#8594A6" style={styles.emptyText}>
            When the list is empty, show this calm state instead of a blank
            screen.
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
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  markReadBtn: {
    flex: 1.5,
  },
  clearBtn: {
    flex: 1,
  },
  scrollList: {
    paddingBottom: 40,
  },
  badgeNow: {
    backgroundColor: "rgba(94, 213, 168, 0.12)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeRead: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
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
