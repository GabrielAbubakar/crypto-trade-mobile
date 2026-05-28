import React from "react";
import { StyleSheet, View } from "react-native";
import { Skeleton } from "../ui/Skeleton";

/**
 * Skeleton loader for NotificationItem component
 * Matches the layout and dimensions of NotificationItem
 */
export const NotificationItemSkeleton: React.FC = () => {
  return (
    <View style={styles.notificationRow}>
      <View style={styles.rowTitleContainer}>
        <Skeleton width={150} height={14} borderRadius={4} />
        <Skeleton width={10} height={10} borderRadius={5} />
      </View>
      <Skeleton width="80%" height={12} borderRadius={4} />
    </View>
  );
};

const styles = StyleSheet.create({
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
});
