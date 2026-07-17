import NotificationIcon from "@/assets/icons/main/notification.svg";
import QrIcon from "@/assets/icons/main/scanner.svg";
import SearchIcon from "@/assets/icons/main/search.svg";
import FilterIcon from "@/assets/icons/notification/Filter.svg";
import EmptyIllustration from "@/assets/icons/notification/notificationIconRain.svg";
import { BaseText, BaseTouchableOpacity, ScreenContainer, UserHeader } from "@/shared/ui";
import { Colors } from "@/shared/constants";
import { useGetNotificationsQuery } from "@/store/store";
import { showToast } from "@/shared/utils";
import { NotificationItem, NotificationItemSkeleton } from "@/features/activity/components";
import React from "react";
import { Dimensions, FlatList, RefreshControl, StyleSheet, View } from "react-native";

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

function EmptyComponent() {
  return (
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
  )
}

export default function NotificationsScreen() {
  const { data, isLoading, error, refetch, isFetching } = useGetNotificationsQuery();

  const handleMarkAllRead = () => {
    showToast("success", "All notifications marked as read.");
  };

  const handleClearAll = () => {
    showToast("info", "All notifications cleared.");
  };

  const handleRestoreDefaults = () => {
    showToast("success", "Default notifications restored.");
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    if (isLoading) {
      return <NotificationItemSkeleton key={index} />;
    }
    return <NotificationItem key={item.id} {...item} />;
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
          {(data?.data?.length ?? 0) > 0 && (
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
              (data?.data?.length ?? 0) > 0 ? handleClearAll : handleRestoreDefaults
            }
            style={styles.filterButton}
          >
            <FilterIcon width={22} height={22} />
          </BaseTouchableOpacity>
        </View>
      </View>

      {/* Main Content Area */}
      <FlatList
        data={isLoading ? Array.from({ length: 5 }).map((_, index) => ({ id: index })) : data?.data}
        ListEmptyComponent={EmptyComponent}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
      />
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
    minHeight: Dimensions.get("window").height * 0.65,
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
