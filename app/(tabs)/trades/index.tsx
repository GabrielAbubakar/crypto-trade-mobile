import { ScreenContainer, ScreenHeader } from "@/components";
import { Colors } from "@/constants";
import React from "react";
import { StyleSheet } from "react-native";

export default function TradesScreen() {
  return (
    <ScreenContainer withPadding={true}>
      <ScreenHeader
        title="Trades"
        subtitle="Buy, sell, or swap with quotes that expire before execution."
        style={{ marginTop: 20 }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 20,
  },
  tabsBackground: {
    flexDirection: "row",
    backgroundColor: "#161C22",
    borderRadius: 14,
    padding: 4,
    justifyContent: "space-between",
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
  tabText: {
    color: "#777777",
    fontSize: 14,
  },
  tabTextActive: {
    color: "#C1C7CD",
  },
  chartContainer: {
    width: "100%",
    height: 250,
  },
  row: {
    flexDirection: "row",
  },
  button: {
    flex: 1,
    borderRadius: 0,
  },
  bottomContainer: {
    backgroundColor: Colors.white,
    flex: 1,
  },
});
