import React from "react";
import { StyleSheet, View } from "react-native";
import { BaseText } from "../ui/BaseText";

interface NotificationItemProps {
  id: string;
  title: string;
  subtitle: string;
  type: "success" | "pending" | "warning";
  read: boolean;
}

/**
 * Individual Notification Item Component
 * Extracted from notifications page for reusability
 */
export const NotificationItem: React.FC<NotificationItemProps> = ({
  id,
  title,
  subtitle,
  type,
  read,
}) => {
  return (
    <View style={styles.notificationRow}>
      <View style={styles.rowTitleContainer}>
        <BaseText size="sm" color="#C1C7CD" style={styles.rowTitle}>
          {title}
        </BaseText>

        {/* Visual state dots */}
        {!read && (
          <View
            style={[
              styles.indicatorDot,
              type === "success" && styles.dotSuccess,
              type === "pending" && styles.dotPending,
              type === "warning" && styles.dotWarning,
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
        {subtitle}
      </BaseText>
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
