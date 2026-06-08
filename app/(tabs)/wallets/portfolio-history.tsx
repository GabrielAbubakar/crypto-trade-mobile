import { BackHeader, BaseText, ScreenContainer, Skeleton } from "@/components";
import { Colors } from "@/constants";
import { useGetPortfolioHistoryQuery } from "@/store";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Defs, Line, LinearGradient, Path, Stop } from "react-native-svg";

const { width: screenWidth } = Dimensions.get("window");

export default function PortfolioHistoryScreen() {
  const [activeInterval, setActiveInterval] = useState<
    "1D" | "1W" | "1M" | "1Y"
  >("1M");

  const {
    data: portfolioHistory,
    isFetching,
    refetch,
  } = useGetPortfolioHistoryQuery(activeInterval);

  const handleRefresh = () => {
    refetch();
  };

  // Static/calculated ledger data to match the Screen 2 list
  const ledgerData = [
    {
      id: "1",
      month: "May 2026",
      value: 4892.4,
      change: "+3.8%",
      isPositive: true,
    },
    {
      id: "2",
      month: "April 2026",
      value: 4713.2,
      change: "+1.2%",
      isPositive: true,
    },
    {
      id: "3",
      month: "March 2026",
      value: 4421.0,
      change: "-0.8%",
      isPositive: false,
    },
  ];

  // Map history to chart points
  const chartPoints = useMemo(() => {
    if (!portfolioHistory?.data || portfolioHistory.data.length === 0) {
      // Return default mock points for demonstration if empty
      return [
        { price: 4421 },
        { price: 4500 },
        { price: 4620 },
        { price: 4580 },
        { price: 4713.2 },
        { price: 4800 },
        { price: 4892.4 },
      ];
    }
    return portfolioHistory.data.map((pt) => ({ price: pt.valueUsd }));
  }, [portfolioHistory]);

  // SVG Chart Calculations
  const chartHeight = 160;
  const chartWidth = screenWidth - 40; // Horizontal margin padding

  const svgData = useMemo(() => {
    if (chartPoints.length < 2) return null;
    const prices = chartPoints.map((p) => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min === 0 ? 1 : max - min;

    const paddingY = 15;
    const usableHeight = chartHeight - paddingY * 2;

    const coords = chartPoints.map((pt, idx) => {
      const x = (idx / (chartPoints.length - 1)) * chartWidth;
      const y =
        chartHeight - paddingY - ((pt.price - min) / range) * usableHeight;
      return { x, y };
    });

    let linePath = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 1; i < coords.length; i++) {
      linePath += ` L ${coords[i].x} ${coords[i].y}`;
    }

    const areaPath = `${linePath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

    return { linePath, areaPath };
  }, [chartPoints, chartWidth, chartHeight]);

  const renderHeader = () => (
    <View style={styles.header}>
      <BackHeader title="Portfolio history" />
      <BaseText style={styles.subtitle}>
        Track total balance movement over time.
      </BaseText>

      {/* Chart Section */}
      <View style={styles.chartContainer}>
        {isFetching ? (
          <View
            style={[
              styles.chartWrapper,
              { justifyContent: "center", alignItems: "center" },
            ]}
          >
            <Skeleton
              width={chartWidth - 40}
              height={chartHeight - 40}
              borderRadius={8}
            />
          </View>
        ) : svgData ? (
          <View style={styles.chartWrapper}>
            <Svg width={chartWidth} height={chartHeight}>
              <Defs>
                <LinearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <Stop
                    offset="0%"
                    stopColor={Colors.primary}
                    stopOpacity="0.25"
                  />
                  <Stop
                    offset="100%"
                    stopColor={Colors.primary}
                    stopOpacity="0.0"
                  />
                </LinearGradient>
              </Defs>
              {/* Grid Lines */}
              <Line
                x1="0"
                y1={chartHeight / 2}
                x2={chartWidth}
                y2={chartHeight / 2}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <Line
                x1="0"
                y1={chartHeight - 15}
                x2={chartWidth}
                y2={chartHeight - 15}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
              {/* Fill Area */}
              <Path d={svgData.areaPath} fill="url(#chartGrad)" />
              {/* Outline Line */}
              <Path
                d={svgData.linePath}
                fill="none"
                stroke={Colors.primary}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
        ) : (
          <View style={styles.emptyChart} />
        )}

        {/* Chart Period Filters */}
        <View style={styles.intervalRow}>
          {["1D", "1W", "1M", "1Y"].map((period) => {
            const isActive = activeInterval === period;
            return (
              <TouchableOpacity
                key={period}
                activeOpacity={0.8}
                onPress={() => setActiveInterval(period as any)}
                style={[
                  styles.intervalBtn,
                  isActive && styles.intervalBtnActive,
                ]}
              >
                <BaseText
                  variant="bold"
                  style={[
                    styles.intervalText,
                    isActive && styles.intervalTextActive,
                  ]}
                >
                  {period}
                </BaseText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );

  const renderLedgerItem = ({ item }: { item: (typeof ledgerData)[0] }) => (
    <View style={styles.ledgerRow}>
      <View style={styles.ledgerLeft}>
        <View
          style={[
            styles.ledgerIcon,
            {
              backgroundColor: item.isPositive
                ? "rgba(94, 213, 168, 0.15)"
                : "rgba(255, 77, 77, 0.15)",
            },
          ]}
        >
          <BaseText
            variant="bold"
            style={{
              color: item.isPositive ? Colors.primary : Colors.error,
              fontSize: 16,
            }}
          >
            P
          </BaseText>
        </View>
        <View style={styles.ledgerNameStack}>
          <BaseText variant="bold" style={styles.ledgerMonth}>
            {item.month}
          </BaseText>
          <BaseText style={styles.ledgerSubtitle}>Portfolio value</BaseText>
        </View>
      </View>
      <View style={styles.ledgerRight}>
        <BaseText variant="bold" style={styles.ledgerValue}>
          {item.value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </BaseText>
        <BaseText
          variant="medium"
          style={[
            styles.ledgerChange,
            { color: item.isPositive ? Colors.primary : Colors.error },
          ]}
        >
          {item.change}
        </BaseText>
      </View>
    </View>
  );

  return (
    <ScreenContainer withPadding={false} style={styles.container}>
      <FlatList
        data={ledgerData}
        keyExtractor={(item) => item.id}
        renderItem={renderLedgerItem}
        ListHeaderComponent={renderHeader}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
          />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondary,
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  subtitle: {
    color: "#777777",
    fontSize: 14,
    marginTop: -8,
    marginBottom: 24,
  },
  chartContainer: {
    marginBottom: 30,
  },
  chartWrapper: {
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyChart: {
    height: 160,
    backgroundColor: "rgba(255,255,255,0.02)",
    borderRadius: 16,
    marginBottom: 16,
  },
  intervalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#161C22",
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.03)",
  },
  intervalBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  intervalBtnActive: {
    backgroundColor: "#23362F",
  },
  intervalText: {
    color: "#777777",
    fontSize: 12,
  },
  intervalTextActive: {
    color: Colors.primary,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100,
  },
  ledgerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#161C22",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.03)",
  },
  ledgerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  ledgerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  ledgerNameStack: {
    justifyContent: "center",
  },
  ledgerMonth: {
    color: Colors.white,
    fontSize: 16,
    marginBottom: 2,
  },
  ledgerSubtitle: {
    color: "#777777",
    fontSize: 12,
  },
  ledgerRight: {
    alignItems: "flex-end",
  },
  ledgerValue: {
    color: Colors.white,
    fontSize: 16,
    marginBottom: 2,
  },
  ledgerChange: {
    fontSize: 12,
  },
});
