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
      {/* Symbol */}
      <Skeleton
        width={40}
        height={20}
        borderRadius={4}
        backgroundColor="rgba(255, 255, 255, 0.1)"
      />

      {/* Change */}
      <Skeleton
        width={50}
        height={20}
        borderRadius={4}
        backgroundColor="rgba(255, 255, 255, 0.1)"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  coinCardSkeleton: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
});
