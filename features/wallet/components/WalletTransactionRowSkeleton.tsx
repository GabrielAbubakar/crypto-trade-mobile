import React from "react";
import { StyleSheet, View } from "react-native";
import { Skeleton } from '@/components/ui';

export const WalletTransactionRowSkeleton: React.FC = () => {
  return (
    <View style={styles.row}>
      {/* Left Col: Icon and Name/Ticker */}
      <View style={styles.leftCol}>
        <Skeleton width={40} height={40} borderRadius={20} />
        <View style={styles.textStack}>
          <Skeleton width={110} height={14} borderRadius={4} style={{ marginBottom: 6 }} />
          <Skeleton width={80} height={10} borderRadius={2} />
        </View>
      </View>

      {/* Right Col: Amount & Status Badge */}
      <View style={styles.rightCol}>
        <Skeleton width={90} height={14} borderRadius={4} style={{ marginBottom: 6 }} />
        <Skeleton width={50} height={12} borderRadius={4} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
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
  textStack: {
    justifyContent: "center",
  },
  rightCol: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
});
