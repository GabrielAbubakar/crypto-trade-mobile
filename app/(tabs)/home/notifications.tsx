import NotificationIcon from "@/assets/icons/main/notification.svg";
import QrIcon from "@/assets/icons/main/scanner.svg";
import SearchIcon from "@/assets/icons/main/search.svg";
import FilterIcon from "@/assets/icons/notification/Filter.svg";
import EmptyIllustration from "@/assets/icons/notification/notificationIconRain.svg";
import {
  BaseText,
  BaseTouchableOpacity,
  ScreenContainer,
  UserHeader,
} from "@/components";
import { Colors, INITIAL_NOTIFICATIONS } from "@/constants";
import { useGetNotificationsQuery } from "@/store";
import React, { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { showToast } from "@/utils";

const headerButtons = [
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
] as const;

interface NotificationItem {
  id: string;
  title: string;
  subtitle: string;
  type: "success" | "pending" | "warning";
  read: boolean;
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    INITIAL_NOTIFICATIONS,
  );
  const { data, isLoading, error } = useGetNotificationsQuery();

  console.log(error)

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast("success", "All notifications marked as read.");
  };

  const handleClearAll = () => {
    setNotifications([]);
    showToast("info", "All notifications cleared.");
  };

  const handleRestoreDefaults = () => {
    setNotifications(INITIAL_NOTIFICATIONS);
    showToast("success", "Default notifications restored.");
  };


  return (
    <ScreenContainer withPadding={false} scrollable={false}>
      {/* Universal header layout */}
      <UserHeader userButtons={headerButtons as any} />

      {/* Sub Header row with title and funnel filter */}
      <View style={styles.subHeader}>
        <BaseText variant="bold" size="lg" color="#FFFFFF">
          Notifications
        </BaseText>

        <View style={styles.subHeaderActions}>
          {notifications.length > 0 && (
            <>
              <BaseTouchableOpacity onPress={handleMarkAllRead}>
                <BaseText
                  size="xs"
                  color="#777777"
                  variant="medium"
                  style={styles.markReadText}
                >
                  Mark Read All
                </BaseText>
              </BaseTouchableOpacity>
              <View style={styles.actionDivider} />
            </>
          )}

          <BaseTouchableOpacity
            onPress={
              notifications.length > 0 ? handleClearAll : handleRestoreDefaults
            }
            style={styles.filterButton}
          >
            <FilterIcon width={22} height={22} />
          </BaseTouchableOpacity>
        </View>
      </View>

      {/* Main Content Area */}
      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.illustrationWrapper}>
            <EmptyIllustration width={180} height={180} />
          </View>
          <BaseText
            variant="bold"
            size="md"
            color="#FFFFFF"
            textAlign="center"
            style={styles.emptyTitle}
          >
            You have no notifications
          </BaseText>
          <BaseText
            size="sm"
            color="#777777"
            textAlign="center"
            style={styles.emptySubtitle}
          >
            lorem ipsum lorem ipsum
          </BaseText>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          renderItem={({ item }) => (
            <View style={styles.notificationRow}>
              <View style={styles.rowTitleContainer}>
                <BaseText size="sm" color="#C1C7CD" style={styles.rowTitle}>
                  {item.title}
                </BaseText>

                {/* Visual state dots */}
                {!item.read && (
                  <View
                    style={[
                      styles.indicatorDot,
                      item.type === "success" && styles.dotSuccess,
                      item.type === "pending" && styles.dotPending,
                      item.type === "warning" && styles.dotWarning,
                    ]}
                  />
                )}
              </View>

              <BaseText
                size="xs"
                color="#777777"
                style={styles.rowSubtitle}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.subtitle}
              </BaseText>
            </View>
          )}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  subHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Colors.secondary,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.02)",
  },
  subHeaderActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  markReadText: {
    color: "#777777",
    paddingVertical: 4,
  },
  actionDivider: {
    width: 1,
    height: 14,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  filterButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    backgroundColor: Colors.secondary,
  },
  illustrationWrapper: {
    marginBottom: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    marginBottom: 8,
  },
  emptySubtitle: {
    lineHeight: 18,
    marginBottom: 32,
  },
  restoreBtn: {
    borderColor: "#5ED5A8",
    borderWidth: 1,
    backgroundColor: "transparent",
    paddingHorizontal: 24,
  },
  restoreBtnText: {
    color: "#5ED5A8",
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
    backgroundColor: Colors.secondary,
  },
  notificationRow: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.04)",
  },
  rowTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  rowTitle: {},
  indicatorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotSuccess: {
    backgroundColor: "#5ED5A8",
  },
  dotPending: {
    backgroundColor: "#F5C242",
  },
  dotWarning: {
    backgroundColor: "#FF4D4D",
  },
  rowSubtitle: {
    lineHeight: 16,
    fontFamily: "NeueMontreal-Regular",
  },
});
