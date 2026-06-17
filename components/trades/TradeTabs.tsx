import { BaseText } from "@/components/ui/BaseText";
import { Colors, FontFamily, OPERATION_TABS } from "@/constants";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type TradeType = "buy" | "sell" | "swap";

interface TradeTabsProps {
  activeTab: TradeType;
  onTabChange: (tab: TradeType) => void;
}

export const TradeTabs: React.FC<TradeTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <View style={styles.tabsContainer}>
      {OPERATION_TABS.map((tab) => {
        const isActive = activeTab === tab.value;
        return (
          <TouchableOpacity
            key={tab.value}
            style={[styles.tabButton, isActive && styles.tabButtonActive]}
            onPress={() => onTabChange(tab.value as TradeType)}
            activeOpacity={0.8}
          >
            <BaseText
              style={[
                styles.tabButtonText,
                isActive && styles.tabButtonTextActive,
              ]}
            >
              {tab.label}
            </BaseText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#161C22",
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: "#1B232A",
  },
  tabButtonText: {
    color: "#777777",
    fontSize: 14,
    fontFamily: FontFamily.bold,
  },
  tabButtonTextActive: {
    color: Colors.white,
  },
});
