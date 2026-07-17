import React from "react";
import { StyleSheet, View } from "react-native";
import { Skeleton } from '@/shared/ui';

export const WalletAssetRowSkeleton: React.FC = () => {
  return (
    <View style={styles.assetRow}>
      {/* Left Col: Icon and Name/Ticker */}
      <View style={styles.leftCol}>
        <Skeleton width={40} height={40} borderRadius={20} />
        <View style={styles.nameStack}>
          <Skeleton width={80} height={14} borderRadius={4} style={{ marginBottom: 6 }} />
          <Skeleton width={40} height={10} borderRadius={2} />
        </View>
      </View>

      {/* Right Col: Balance Amount & Value in USD */}
      <View style={styles.rightCol}>
        <Skeleton width={70} height={14} borderRadius={4} style={{ marginBottom: 6 }} />
        <Skeleton width={50} height={10} borderRadius={2} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  assetRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  leftCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  nameStack: {
    justifyContent: "center",
  },
  rightCol: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
});
