import type { QuickActionItem } from "@/constants";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { BaseText } from "../ui";

interface ActivityQuickActionProps {
  action: QuickActionItem;
}

export const ActivityQuickAction: React.FC<ActivityQuickActionProps> = ({
  action,
}) => {
  return (
    <TouchableOpacity activeOpacity={0.6} style={styles.actionRow}>
      <View style={styles.actionLeft}>
        <View style={styles.actionIconBg}>
          <action.Icon width={20} height={20} />
        </View>
        <BaseText size="sm" style={styles.actionTitle}>
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
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  actionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  actionIconBg: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  actionTitle: {
    color: "#C1C7CD",
  },
});
