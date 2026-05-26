import type { CoinMarketItem } from "@/constants";
import React from "react";
import { StyleSheet, View } from "react-native";
import { BaseText, Sparkline } from "../ui";

interface MarketCoinRowProps {
  coin: CoinMarketItem;
}

export const MarketCoinRow: React.FC<MarketCoinRowProps> = ({ coin }) => {
  const trendColor = coin.isPositive ? "#5ED5A8" : "#FF4D4D";

  return (
    <View style={styles.coinRow}>
      {/* Left Column: Icon & Names */}
      <View style={styles.leftCol}>
        <View style={styles.iconContainer}>
          <coin.Icon width={32} height={32} />
        </View>
        <View style={styles.nameStack}>
          <BaseText variant="bold" style={styles.coinName}>
            {coin.name}
          </BaseText>
          <BaseText style={styles.coinTicker}>
            {coin.ticker}
          </BaseText>
        </View>
      </View>

      {/* Middle Column: Sparkline chart */}
      <View style={styles.sparkCol}>
        <Sparkline
          data={coin.sparklineData}
          color={trendColor}
          width={90}
          height={32}
        />
      </View>

      {/* Right Column: Price & Change percentage */}
      <View style={styles.rightCol}>
        <BaseText variant="bold" style={styles.coinPrice}>
          {coin.price}
        </BaseText>
        <BaseText style={[styles.coinChange, { color: trendColor }]}>
          {coin.change}
        </BaseText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  coinRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  leftCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  nameStack: {
    justifyContent: "center",
  },
  coinName: {
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 2,
  },
  coinTicker: {
    color: "#777777",
    fontSize: 12,
  },
  sparkCol: {
    flex: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  rightCol: {
    flex: 2,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  coinPrice: {
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 2,
  },
  coinChange: {
    fontSize: 12,
    fontWeight: "600",
  },
});
