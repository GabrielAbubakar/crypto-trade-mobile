import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { BaseText } from "../ui";
import { Feather } from "@expo/vector-icons";
import type { QuickActionItem } from "@/constants";

interface ActivityQuickActionProps {
  action: QuickActionItem;
}

export const ActivityQuickAction: React.FC<ActivityQuickActionProps> = ({
  action,
}) => {
  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.actionRow}>
      <View style={styles.actionLeft}>
        <View style={styles.actionIconBg}>
          <action.Icon width={20} height={20} />
        </View>
        <BaseText variant="bold" style={styles.actionTitle}>
          {action.title}
        </BaseText>
      </View>
      <Feather
        name="arrow-right"
        size={18}
        color="rgba(255, 255, 255, 0.4)"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  actionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  actionIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    alignItems: "center",
    justifyContent: "center",
  },
  actionTitle: {
    color: "#FFFFFF",
    fontSize: 15,
  },
});
