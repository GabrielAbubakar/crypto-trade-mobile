import Background from "@/assets/images/auth-background.png";
import {
  BaseText,
  ScreenContainer,
  SignInForm,
  SignUpForm,
} from "@/components";
import type { AuthTab } from "@/components/auth/types";
import { Colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  BackHandler,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function AuthIndexScreen() {
  const [currentTab, setCurrentTab] = useState<AuthTab>("signin");
  const listRef = useRef<ScrollView>(null);

  const handleTabChange = (tab: AuthTab) => {
    setCurrentTab(tab);
    listRef.current?.scrollTo({
      x: tab === "signin" ? 0 : width,
      animated: true,
    });
  };

  const onMomentumScrollEnd = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    const newTab = index === 0 ? "signin" : "signup";
    if (newTab !== currentTab) {
      setCurrentTab(newTab);
    }
  };

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      // No previous screen to go back to, exit the app
      BackHandler.exitApp();
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
        <Ionicons name="close" size={24} color={Colors.white} />
      </TouchableOpacity>
      <View style={styles.tabWrapper}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => handleTabChange("signin")}
            style={[styles.tab, currentTab === "signin" && styles.activeTab]}
          >
            <BaseText
              style={[
                styles.tabText,
                currentTab === "signin" && styles.activeTabText,
              ]}
            >
              Sign in
            </BaseText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleTabChange("signup")}
            style={[styles.tab, currentTab === "signup" && styles.activeTab]}
          >
            <BaseText
              style={[
                styles.tabText,
                currentTab === "signup" && styles.activeTabText,
              ]}
            >
              Sign up
            </BaseText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <ScreenContainer withPadding={false} avoidKeyboard style={styles.container}>
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

      <View style={{ flex: 1 }}>
        {renderHeader()}
        <ScrollView
          ref={listRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onMomentumScrollEnd}
          scrollEventThrottle={16}
          bounces={false}
          removeClippedSubviews={Platform.OS === "android"}
          style={{ flex: 1 }}
        >
          {/* Screen 1 - Sign In */}
          <View style={{ width }}>
            <SignInForm />
          </View>

          {/* Screen 2 - Sign Up */}
          <View style={{ width }}>
            <SignUpForm />
          </View>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  closeButton: {
    marginBottom: 20,
  },
  tabWrapper: {
    // paddingHorizontal: 10,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#11181E",
    borderRadius: 15,
    padding: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: "#1B232A",
  },
  tabText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.white,
  },
});
