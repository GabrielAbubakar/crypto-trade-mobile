import DollarCircle from "@/assets/icons/trade/dollarCircle.svg";
import Candle from "@/assets/icons/trade/market.svg";
import Star from "@/assets/icons/trade/star.svg";
import type { HeaderButtonProps } from "@/components";
import {
  BaseButton,
  BaseText,
  BaseTouchableOpacity,
  ScreenContainer,
  UserHeader,
} from "@/components";
import { TradeActionSheet } from "@/components/trades";
import { Colors, MARKET_TABS } from "@/constants";
import React, { useMemo, useRef, useState } from "react";
import type { FlatList } from "react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";

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
];

const categories = ["Open Order", "Order Books", "Market Trades"];

function RowBtn({
  title,
  isActive,
  onPress,
}: {
  title: string;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <BaseTouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: isActive ? "#F1F4F6" : "transparent",
        paddingHorizontal: 17,
        paddingVertical: 15,
        flex: 1,
      }}
    >
      <BaseText
        size="sm"
        style={{
          color: isActive ? "#1B232A" : "#A7AFB7",
          textAlign: "center",
        }}
      >
        {title}
      </BaseText>
    </BaseTouchableOpacity>
  );
}

export default function TradesScreen() {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [selectedCat, setSelectedCat] = useState("Open Order");
  const [tradeSide, setTradeSide] = useState<"buy" | "sell">("buy");
  const [sheetVisible, setSheetVisible] = useState(false);
  const [activeOrderType, setActiveOrderType] = useState("Market");
  const [price] = useState("38418.49");
  const [quantity] = useState("0.65");
  const [selectedPercent, setSelectedPercent] = useState(50);
  const flatListRef = useRef<FlatList>(null);

  const handleTabPress = (index: number) => {
    setSelectedTabIndex(index);
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  const openTradeSheet = (side: "buy" | "sell") => {
    setTradeSide(side);
    setSheetVisible(true);
  };

  const closeTradeSheet = () => {
    setSheetVisible(false);
  };

  const availableBalance = "16.23464400";
  const total = useMemo(() => {
    const priceNum = Number(price.replace(/,/g, ""));
    const quantityNum = Number(quantity.replace(/,/g, ""));
    if (!Number.isFinite(priceNum) || !Number.isFinite(quantityNum)) {
      return "0.000000";
    }
    return (priceNum * quantityNum).toFixed(8);
  }, [price, quantity]);

  return (
    <ScreenContainer withPadding={false}>
      <UserHeader userButtons={headerOptions} />

      {/* Top Tabs */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabsBackground}>
          {MARKET_TABS.map((tab, index) => {
            const isActive = selectedTabIndex === index;
            return (
              <TouchableOpacity
                key={tab}
                activeOpacity={0.8}
                onPress={() => handleTabPress(index)}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
              >
                <BaseText
                  style={[styles.tabText, isActive && styles.tabTextActive]}
                >
                  {tab}
                </BaseText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Chart Area */}
      <View style={styles.chartContainer}>
        <BaseText>Chart Area (Coming Soon)</BaseText>
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.row}>
          <BaseButton
            variant="primary"
            title="Buy"
            style={styles.button}
            onPress={() => openTradeSheet("buy")}
          />
          <BaseButton
            variant="cancel"
            title="Sell"
            style={styles.button}
            onPress={() => openTradeSheet("sell")}
          />
        </View>

        {/* Category Row */}
        <View
          style={{
            flexDirection: "row",
            borderBottomColor: Colors.border,
            borderBottomWidth: 1,
          }}
        >
          {categories.map((cat) => (
            <RowBtn
              key={cat}
              title={cat}
              isActive={selectedCat === cat}
              onPress={() => setSelectedCat(cat)}
            />
          ))}
        </View>

        {/* Bid / Ask */}
        <View
          style={{
            flexDirection: "row",
            borderBottomColor: Colors.border,
            borderBottomWidth: 1,
          }}
        >
          <BaseText
            size="xs"
            style={{ color: Colors.textSecondary, padding: 15, flex: 1 }}
          >
            Bid
          </BaseText>
          <BaseText
            size="xs"
            style={{
              color: Colors.textSecondary,
              padding: 15,
              flex: 1,
              borderLeftColor: Colors.border,
              borderLeftWidth: 1,
            }}
          >
            Ask
          </BaseText>
        </View>
      </View>

      <TradeActionSheet
        visible={sheetVisible}
        tradeSide={tradeSide}
        availableBalance={availableBalance}
        activeOrderType={activeOrderType}
        price={price}
        quantity={quantity}
        selectedPercent={selectedPercent}
        total={total}
        onClose={closeTradeSheet}
        onOrderTypeChange={setActiveOrderType}
        onPercentChange={setSelectedPercent}
        onConfirm={closeTradeSheet}
      />
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

  tabsContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 20,
  },
  tabsBackground: {
    flexDirection: "row",
    backgroundColor: "#161C22",
    borderRadius: 14,
    padding: 4,
    justifyContent: "space-between",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: "#1B232A",
  },
  tabText: {
    color: "#777777",
    fontSize: 14,
  },
  tabTextActive: {
    color: "#C1C7CD",
  },
  chartContainer: {
    width: "100%",
    height: 250,
  },
  row: {
    flexDirection: "row",
  },
  button: {
    flex: 1,
    borderRadius: 0,
  },
  bottomContainer: {
    backgroundColor: Colors.white,
    flex: 1,
  },
});
