import { BaseText } from "@/components/ui";
import { MARKET_TABS } from "@/constants";
import { useGetTrendingAssetsQuery } from "@/store";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { MarketCoinRow } from "./MarketCoinRow";
import { MarketCoinRowSkeleton } from "./MarketCoinRowSkeleton";

const { width } = Dimensions.get("window");

function EmptyComponent() {
  return (
    <BaseText>No data Available</BaseText>
  )
}

export const MarketTabsView = () => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { data: trendingData, isLoading, isFetching, refetch } = useGetTrendingAssetsQuery();

  const handleTabPress = (index: number) => {
    setSelectedTabIndex(index);
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  const handleMomentumScrollEnd = (event: any) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    if (newIndex !== selectedTabIndex) {
      setSelectedTabIndex(newIndex);
    }
  };

  const renderCoinItem = ({ item }: { item: any }) => (
    isLoading ? <MarketCoinRowSkeleton key={item.id} /> : <MarketCoinRow key={item.id} {...item} />
  );

  const renderPage = () => {
    return (
      <View style={{ width, position: "relative" }}>
        {/* {isFetching && <ActivityIndicator style={{}} color={Colors.primary} size="small" />} */}
        <FlatList
          data={isLoading ? Array.from({ length: 5 }).map((_, index) => ({ id: index })) : trendingData?.data}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={EmptyComponent}
          ItemSeparatorComponent={() => (
            <View
              style={{ width: "100%", height: 1, backgroundColor: "#ffffff06" }}
            />
          )}
          renderItem={renderCoinItem}
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={refetch} />
          }
          contentContainerStyle={styles.listContainer}
          scrollEnabled={false}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Tabs Row */}
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

      {/* Horizontal Swiper for Tabs */}
      <FlatList
        ref={flatListRef}
        data={MARKET_TABS}
        keyExtractor={(item) => item}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        renderItem={renderPage}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  listContainer: {
    paddingHorizontal: 20,
  },
});
