import Background from "@/assets/images/Background.png";
import { BaseButton, OnboardingItem, Paginator } from "@/components";
import { Colors, onboarding } from "@/constants";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { Animated, FlatList, Image, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const insets = useSafeAreaInsets();

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;
  const viewConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleNext = () => {
    if (currentIndex < onboarding.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
      });
    } else {
      router.replace("/(auth)");
    }
  };

  return (
    // <ScreenContainer style={{ justifyContent: "center" }} withPadding={false}>
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.secondary,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        position: "relative",
      }}
    >
      <Image
        source={Background}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "120%",
        }}
      />
      {/* <ImageBackground source={Background} style={{ flex: 1 }}> */}
      <FlatList
        style={{ flexGrow: 0, marginBottom: 30, marginTop: 50 }}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        data={onboarding}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <OnboardingItem item={item} key={item.title} />
        )}
        keyExtractor={(item) => item.title}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={flatListRef}
      />

      <View style={styles.footer}>
        <Paginator data={onboarding} currentIndex={currentIndex} />
        <BaseButton title="Next" style={styles.button} onPress={handleNext} />
      </View>
      {/* </ImageBackground> */}
    </View>
    // </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: 100,
    paddingBottom: 30,
    width: "100%",
    maxWidth: 577,
    alignSelf: "center",
  },
  button: {
    boxShadow: "10px 20px 70px rgba(94, 213, 168, .2)",
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
