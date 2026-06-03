import React from "react";
import { StyleSheet, View } from "react-native";
import { Skeleton } from "../ui/Skeleton";

/**
 * Skeleton loader for CoinCard component
 * Matches the layout and dimensions of CoinCard
 */
export const CoinCardSkeleton: React.FC = () => {
  return (
    <View style={styles.coinCardSkeleton}>
      {/* Header: Price & Icon */}
      <View style={styles.header}>
        <Skeleton
          width={60}
          height={20}
          borderRadius={4}
          backgroundColor="#e8e8e8"
        />
        <Skeleton
          width={28}
          height={28}
          borderRadius={4}
          backgroundColor="#e8e8e8"
        />
      </View>

      {/* Meta Row: Pair & Change */}
      <View style={styles.metaRow}>
        <Skeleton
          width={50}
          height={14}
          borderRadius={4}
          backgroundColor="#e8e8e8"
        />
        <Skeleton
          width={40}
          height={14}
          borderRadius={4}
          backgroundColor="#e8e8e8"
        />
      </View>

      {/* Sparkline */}
      <View style={styles.sparklineContainer}>
        <Skeleton
          width="100%"
          height={35}
          borderRadius={4}
          backgroundColor="#e8e8e8"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  coinCardSkeleton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    width: 180,
    height: 155,
    borderWidth: 1,
    borderColor: "#F2F3F7",
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  sparklineContainer: {
    height: 35,
    marginTop: 8,
  },
});
