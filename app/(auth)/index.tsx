import {
  BaseText,
  OTPStep,
  ScreenContainer,
  SignInForm,
  SignUpForm,
  SuccessStep,
} from "@/components";
import { AuthStep, AuthTab } from "@/components/auth/types";
import { Colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function AuthIndexScreen() {
  const [step, setStep] = useState<AuthStep>("auth");
  const [currentTab, setCurrentTab] = useState<AuthTab>("signin");
  const flatListRef = useRef<ScrollView>(null);

  const handleTabChange = (tab: AuthTab) => {
    setCurrentTab(tab);
    flatListRef.current?.scrollTo({
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

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.closeButton}
      >
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

  if (step === "otp") {
    return (
      <OTPStep
        onVerify={() => setStep("success")}
        onBack={() => setStep("auth")}
      />
    );
  }

  if (step === "success") {
    return <SuccessStep onFinish={() => router.replace("/(tabs)/home")} />;
  }

  return (
    <ScreenContainer withPadding={false} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {renderHeader()}
        <ScrollView
          ref={flatListRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onMomentumScrollEnd}
          scrollEventThrottle={16}
          bounces={false}
          removeClippedSubviews={Platform.OS === "android"}
          style={{ flex: 1 }}
        >
          <View style={{ width }}>
            <SignInForm />
          </View>
          <View style={{ width }}>
            <SignUpForm onRegisterSuccess={() => setStep("otp")} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
