import type { IMarketAsset } from "@/types";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SvgUri } from "react-native-svg";
import { BaseText, ItemBgContainer, Sparkline } from "../ui";

export const MarketCoinRow: React.FC<IMarketAsset> = React.memo(({
  priceUsd,
  iconUrl,
  change24h,
  sparkline,
  name,
  symbol,
}) => {
  const trendColor = change24h >= 0 ? "#5ED5A8" : "#FF4D4D";
  const resolvedUrl = iconUrl?.startsWith("http")
    ? iconUrl
    : process.env.EXPO_PUBLIC_API_URL
      ? `${process.env.EXPO_PUBLIC_API_URL}${iconUrl}`
      : iconUrl;

  return (
    <ItemBgContainer>
      <View style={styles.coinRow}>
        {/* Left Column: Icon & Names */}
        <View style={styles.leftCol}>
          <View style={styles.iconContainer}>
            <SvgUri width={"100%"} height={"100%"} uri={resolvedUrl} />
          </View>
          <View style={styles.nameStack}>
            <BaseText variant="bold" style={styles.coinName}>
              {name}
            </BaseText>
            <BaseText style={styles.coinTicker}>{symbol}</BaseText>
          </View>
        </View>

        {/* Middle Column: Sparkline chart */}
        <View style={styles.sparkCol}>
          <Sparkline
            data={sparkline}
            color={trendColor}
            width={90}
            height={32}
          />
        </View>

        {/* Right Column: Price & Change percentage */}
        <View style={styles.rightCol}>
          <BaseText variant="bold" style={styles.coinPrice}>
            {priceUsd?.toLocaleString("en-US", {
              currency: "USD",
              style: "currency",
            })}
          </BaseText>
          <BaseText style={[styles.coinChange, { color: trendColor }]}>
            {change24h}%
          </BaseText>
        </View>
      </View>
    </ItemBgContainer>
  );
});

MarketCoinRow.displayName = "MarketCoinRow";

const styles = StyleSheet.create({
  coinRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 48,
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
