import React from "react";
import { StyleSheet, View } from "react-native";
import { BaseText } from "../ui";
import { Feather } from "@expo/vector-icons";
import type { ActivityItem } from "@/constants";

interface ActivityItemRowProps {
  activity: ActivityItem;
}

export const ActivityItemRow: React.FC<ActivityItemRowProps> = ({
  activity,
}) => {
  const isBuy = activity.type === "L/B";
  const highlightColor = isBuy ? "#5ED5A8" : "#FF4D4D";
  const badgeBg = isBuy
    ? "rgba(94, 213, 168, 0.1)"
    : "rgba(255, 77, 77, 0.1)";

  return (
    <View style={styles.activityItem}>
      {/* Header Row: Badge, Ticker & Date */}
      <View style={styles.itemHeader}>
        <View style={styles.itemHeaderLeft}>
          {/* Badge */}
          <View style={[styles.badge, { backgroundColor: badgeBg }]}>
            <BaseText
              variant="bold"
              style={[styles.badgeText, { color: highlightColor }]}
            >
              {activity.type}
            </BaseText>
          </View>
          <BaseText variant="bold" style={styles.pairText}>
            {activity.pair}
          </BaseText>
        </View>

        <View style={styles.itemHeaderRight}>
          <BaseText style={styles.dateText}>{activity.timestamp}</BaseText>
          <Feather
            name="chevron-right"
            size={16}
            color="rgba(255, 255, 255, 0.3)"
          />
        </View>
      </View>

      {/* Detail Rows */}
      <View style={styles.detailsBlock}>
        {/* Detail 1: Amount */}
        <View style={styles.detailRow}>
          <BaseText style={styles.detailLabel}>Amount</BaseText>
          <BaseText
            variant="bold"
            style={[styles.detailValue, { color: highlightColor }]}
          >
            {activity.amount}
          </BaseText>
        </View>

        {/* Detail 2: Price */}
        <View style={styles.detailRow}>
          <BaseText style={styles.detailLabel}>Price</BaseText>
          <BaseText variant="bold" style={styles.detailValue}>
            {activity.price}
          </BaseText>
        </View>

        {/* Detail 3: Status */}
        <View style={styles.detailRow}>
          <BaseText style={styles.detailLabel}>Status</BaseText>
          <BaseText
            variant="bold"
            style={[styles.detailValue, { color: highlightColor }]}
          >
            {activity.status}
          </BaseText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  activityItem: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
    paddingBottom: 16,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  itemHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    fontSize: 11,
  },
  pairText: {
    color: "#FFFFFF",
    fontSize: 15,
  },
  itemHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateText: {
    color: "#777777",
    fontSize: 11,
  },
  detailsBlock: {
    gap: 8,
    paddingLeft: 6,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    color: "#777777",
    fontSize: 13,
  },
  detailValue: {
    color: "#FFFFFF",
    fontSize: 13,
  },
});
