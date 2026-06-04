import DollarCircle from "@/assets/icons/trade/dollarCircle.svg";
import Candle from "@/assets/icons/trade/market.svg";
import Star from "@/assets/icons/trade/star.svg";
import type { HeaderButtonProps } from "@/components";
import { BaseText, ScreenContainer } from "@/components";
import { Colors } from "@/constants";
import React from "react";
import { StyleSheet } from "react-native";

const headerOptions: HeaderButtonProps[] = [
  {
    link: "/",
    icon: Candle,
  },
  {
    link: "/home",
    icon: Star,
  },
  {
    link: "/home",
    icon: DollarCircle,
  },
];

export default function TradesScreen() {
  return (
    <ScreenContainer withPadding={false}>
      <BaseText variant="bold" size="3xl" style={styles.title}>
        Trades
      </BaseText>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: 20,
  },

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
