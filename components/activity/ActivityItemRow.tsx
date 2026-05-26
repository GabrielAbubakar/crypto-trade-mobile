import type { ActivityItem } from "@/constants";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { BaseText } from "../ui";

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
      {/* Left: Badge Column */}
      <View style={styles.badgeCol}>
        <View style={[styles.badge, { backgroundColor: badgeBg }]}>
          <BaseText style={[styles.badgeText, { color: highlightColor }]}>
            {activity.type}
          </BaseText>
        </View>
      </View>

      {/* Right: Content Column */}
      <View style={styles.contentCol}>
        {/* Pair & Date */}
        <View style={styles.row}>
          <BaseText variant="bold" size="sm" style={styles.pairText}>
            {activity.pair}
          </BaseText>
          <View style={styles.dateWrap}>
            <BaseText style={styles.dateText}>{activity.timestamp}</BaseText>
            <Feather
              name="chevron-right"
              size={14}
              color="#777777"
              style={{ marginLeft: 4 }}
            />
          </View>
        </View>

        {/* Amount */}
        <View style={styles.row}>
          <BaseText style={styles.detailLabel}>Amount</BaseText>
          <BaseText style={[styles.detailValue, { color: highlightColor }]}>
            {activity.amount}
          </BaseText>
        </View>

        {/* Price */}
        <View style={styles.row}>
          <BaseText style={styles.detailLabel}>Price</BaseText>
          <BaseText style={styles.detailValue}>{activity.price}</BaseText>
        </View>

        {/* Status */}
        <View style={styles.row}>
          <BaseText style={styles.detailLabel}>Status</BaseText>
          <BaseText style={[styles.detailValue, { color: highlightColor }]}>
            {activity.status}
          </BaseText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  activityItem: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
    paddingVertical: 16,
    gap: 10
  },
  badgeCol: {

  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    fontSize: 14,
  },
  contentCol: {
    flex: 1,
    // gap: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pairText: {
    color: "#FFFFFF",
  },
  dateWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    color: "#777777",
    fontSize: 13,
  },
  detailLabel: {
    color: "#777777",
    fontSize: 14,
  },
  detailValue: {
    color: "#C1C7CD",
    fontSize: 14,
  },
});

