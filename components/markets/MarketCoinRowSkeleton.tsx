import React from "react";
import { StyleSheet, View } from "react-native";
import { Skeleton } from "../ui/Skeleton";

/**
 * Skeleton loader for NotificationItem component
 * Matches the layout and dimensions of NotificationItem
 */
export const MarketCoinRowSkeleton: React.FC = () => {
  return (
    <View style={styles.notificationRow}>
      <Skeleton width={30} height={30} borderRadius={4} />
      <View style={styles.rowTitleContainer}>
        <Skeleton width={60} height={10} borderRadius={0} />
        <Skeleton width={30} height={10} borderRadius={0} />
      </View>
      <Skeleton width={100} height={20} borderRadius={0} />
      <View style={{ marginLeft: "auto", gap: 10 }}>
        <Skeleton width={60} height={10} borderRadius={0} />
        <Skeleton
          width={30}
          height={10}
          borderRadius={0}
          style={{ alignSelf: "flex-end" }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  notificationRow: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.04)",
  },
  rowTitleContainer: {
    gap: 10,
  },
});
