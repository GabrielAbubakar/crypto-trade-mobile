import type { IMarketAsset } from "@/types";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SvgUri } from "react-native-svg";
import { BaseText } from "../ui/BaseText";
import { Sparkline } from "../ui/Sparkline";

export const CoinCard: React.FC<IMarketAsset> = ({
  priceUsd,
  iconUrl,
  change24h,
  sparkline,
}) => {
  const trendColor = change24h >= 0 ? "#5ED5A8" : "#FF4D4D";
  const resolvedUrl = iconUrl.startsWith("http")
    ? iconUrl
    : process.env.EXPO_PUBLIC_API_URL
      ? `${process.env.EXPO_PUBLIC_API_URL}${iconUrl}`
      : iconUrl;

  return (
    <View style={styles.coinCard}>
      {/* Top Row: Price & Badge Icon */}
      <View style={styles.coinCardHeader}>
        <BaseText
          variant="bold"
          style={[styles.coinPrice, { color: trendColor }]}
        >
          {priceUsd.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
          })}
        </BaseText>

        <View style={styles.coinIconContainer}>
          <SvgUri width={"100%"} height={"100%"} uri={resolvedUrl} />
        </View>
      </View>

      {/* Middle Row: Pair & Trend Percentage */}
      <View style={styles.coinMetaRow}>
        {/* <BaseText style={styles.coinPair}>{pair}</BaseText> */}
        <BaseText size="xs" style={[styles.coinChange, { color: trendColor }]}>
          {change24h >= 0 ? "+" : ""}
          {change24h.toFixed(2)}%
        </BaseText>
      </View>

      {/* Bottom Row: Dynamic Sparkline */}
      <View style={styles.sparklineContainer}>
        <Sparkline
          data={sparkline}
          color={trendColor}
          width={138}
          height={35}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  coinCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    width: 180,
    height: 155,
    borderWidth: 1,
    borderColor: "#F2F3F7",
    // justifyContent: "space-between",
    gap: 8,
    boxShadow: [
      {
        offsetX: 0,
        offsetY: 16,
        blurRadius: 50,
        color: "rgba(22, 28, 34, 0.08)",
      },
    ],
  },
  coinCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  coinPrice: {
    fontSize: 16,
  },
  coinMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  coinPair: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1B232A",
  },
  coinChange: {},
  sparklineContainer: {
    // alignItems: "center",
    // justifyContent: "center",
    height: 35,
    marginTop: 8,
  },
  coinIconContainer: {
    width: 24,
    height: 24,
  },
  coinIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
});
