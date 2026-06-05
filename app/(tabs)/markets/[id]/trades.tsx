import { BaseText, ScreenContainer } from "@/components";
import { Colors } from "@/constants";
import { useGetTradesQuery } from "@/store";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function TradesScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: response, isLoading } = useGetTradesQuery(
    { symbol: id },
    { skip: !id, pollingInterval: 5000 },
  );

  const trades = response?.data;

  if (isLoading && !trades) {
    return (
      <ScreenContainer style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <BaseText size="3xl" variant="bold" style={styles.headerTitle}>
            Recent trades
          </BaseText>
          <BaseText style={styles.headerSubtitle}>
            Latest simulated market prints.
          </BaseText>
        </View>

        {/* Segmented Control */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={styles.tabBtn}
            onPress={() => router.replace(`/markets/${id}/orderbook` as any)}
          >
            <BaseText size="sm" style={styles.tabText}>
              Order book
            </BaseText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabBtn, styles.tabBtnActive]}>
            <BaseText size="sm" style={[styles.tabText, styles.tabTextActive]}>
              Trades
            </BaseText>
          </TouchableOpacity>
        </View>

        {/* Trades List */}
        <View style={styles.listContainer}>
          {trades?.map((trade) => {
            const isBuy = trade.side === "buy";
            const color = isBuy ? "#5CD6A5" : Colors.error;
            const label = isBuy ? "Buy" : "Sell";

            return (
              <View key={trade.id} style={styles.tradeCard}>
                <View style={styles.tradeCol1}>
                  <BaseText variant="bold" style={[styles.sideText, { color }]}>
                    {label}
                  </BaseText>
                </View>
                <View style={styles.tradeCol2}>
                  <BaseText variant="bold" style={styles.priceText}>
                    {trade.priceUsd.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </BaseText>
                </View>
                <View style={styles.tradeCol3}>
                  <BaseText style={styles.amountText}>
                    {trade.amount.toFixed(4)}
                  </BaseText>
                </View>
                <View style={styles.tradeCol4}>
                  <BaseText style={styles.totalText}>
                    {trade.totalUsd.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </BaseText>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom fade gradient or shadow could go here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    marginTop: 20,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 28,
    marginBottom: 8,
  },
  headerSubtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  tabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#161C22",
  },
  tabBtnActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.secondary,
  },
  listContainer: {
    gap: 12,
  },
  tradeCard: {
    backgroundColor: "#161C22",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tradeCol1: {
    flex: 1,
  },
  sideText: {
    fontSize: 13,
  },
  tradeCol2: {
    flex: 2.5,
  },
  priceText: {
    color: Colors.white,
    fontSize: 14,
  },
  tradeCol3: {
    flex: 2,
    alignItems: "flex-end",
  },
  amountText: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  tradeCol4: {
    flex: 2.5,
    alignItems: "flex-end",
  },
  totalText: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
});
