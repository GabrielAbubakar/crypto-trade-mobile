import DollarCircle from "@/assets/icons/trade/dollarCircle.svg";
import Candle from "@/assets/icons/trade/market.svg";
import Star from "@/assets/icons/trade/star.svg";
import { HeaderButtonProps, ScreenContainer, UserHeader } from "@/components";
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
]


export default function TradesScreen() {
  return (
    <ScreenContainer withPadding={false}>
      <UserHeader userButtons={headerOptions} />
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
});
