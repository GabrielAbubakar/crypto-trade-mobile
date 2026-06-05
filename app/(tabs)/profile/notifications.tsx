import {
  BackHeader,
  BaseButton,
  ProfileOptionCard,
  ScreenContainer,
  Skeleton,
} from "@/components";
import { BaseText } from "@/components/ui/BaseText";
import { Colors } from "@/constants";
import {
  useGetNotificationsQuery,
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
} from "@/store";
import { showErrorToast, showSuccessToast } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function NotificationsScreen() {
  const { data: notificationsData, isLoading } = useGetNotificationsQuery();
  const notifications = notificationsData?.data ?? [];
  const [markNotificationAsRead] = useMarkNotificationAsReadMutation();
  const [markAllNotificationsAsRead, { isLoading: isMarkingAll }] =
    useMarkAllNotificationsAsReadMutation();

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead().unwrap();
      showSuccessToast("All notifications marked as read");
    } catch (err) {
      showErrorToast("Failed to mark all notifications as read");
    }
  };

  const handleNotificationPress = async (id: string) => {
    try {
      await markNotificationAsRead(id).unwrap();
    } catch (err) {
      showErrorToast("Failed to mark notification as read");
    }
  };

  console.log(notificationsData);

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

  const formatNotificationTime = (createdAtStr: string, isRead: boolean) => {
    if (!isRead) return "Now";
    try {
      const date = new Date(createdAtStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return "Now";
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return "Read";
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={{ flex: 1 }}>
          <View style={styles.actionsRow}>
            <Skeleton width="100%" height={48} borderRadius={16} />
          </View>
          <ScrollView
            contentContainerStyle={styles.scrollList}
            scrollEnabled={false}
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <View key={`skeleton-${index}`} style={styles.skeletonCard}>
                <View style={styles.skeletonLeft}>
                  <Skeleton width={40} height={40} borderRadius={20} />
                  <View style={styles.skeletonText}>
                    <Skeleton
                      width={120}
                      height={14}
                      borderRadius={4}
                      style={{ marginBottom: 8 }}
                    />
                    <Skeleton width={180} height={12} borderRadius={4} />
                  </View>
                </View>
                <Skeleton width={48} height={24} borderRadius={12} />
              </View>
            ))}
          </ScrollView>
        </View>
      );
    }

    if (notifications.length > 0) {
      return (
        <View style={{ flex: 1 }}>
          <View style={styles.actionsRow}>
            <BaseButton
              title="Mark all as read"
              variant="secondary"
              onPress={handleMarkAllRead}
              isLoading={isMarkingAll}
              disabled={isMarkingAll}
              style={styles.markReadBtn}
            />
          </View>

          <ScrollView contentContainerStyle={styles.scrollList}>
            {notifications.map((notif) => {
              const type =
                (notif.type as "kyc" | "wallet" | "alert") || "alert";
              return (
                <ProfileOptionCard
                  key={notif.id}
                  title={notif.title}
                  description={notif.body}
                  icon={getIcon(type, notif.isRead)}
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
                        {formatNotificationTime(notif.createdAt, notif.isRead)}
                      </BaseText>
                    </View>
                  }
                  onPress={() => handleNotificationPress(notif.id)}
                />
              );
            })}
          </ScrollView>
        </View>
      );
    }

    return (
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
    );
  };

  return (
    <ScreenContainer style={styles.container} withPadding={true}>
      <BackHeader title="Notifications" />

      <BaseText color="#8594A6" style={styles.subtitle}>
        Security, KYC, transaction, and alert messages.
      </BaseText>

      {renderContent()}
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
    marginBottom: 24,
  },
  markReadBtn: {
    width: "100%",
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
  skeletonCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#141820",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  skeletonLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  skeletonText: {
    flex: 1,
  },
});
