import Background from "@/assets/images/auth-background.png";
import { BaseButton, BaseInput, BaseText, ScreenContainer } from "@/components/ui";
import { Colors } from "@/core/constants";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";

export default function RegisterMobileScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const handleSendOTP = () => {
    if (!phoneNumber.trim()) {
      setError("Mobile number is required");
      return;
    }
    // Simple validation (must be at least 10 chars)
    if (phoneNumber.trim().length < 10) {
      setError("Mobile number must be at least 10 characters");
      return;
    }
    setError("");
    router.push({
      pathname: "/(auth)/otp",
      params: { mobile: phoneNumber.trim() },
    });
  };

  return (
    <ScreenContainer
      scrollable={false}
      withPadding={true}
      style={styles.container}
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
      <View
        style={{ flex: 1 }}
      >
        {/* Back Button Header */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
          <BaseText variant="bold" style={styles.backButtonText}>
            Sign Up
          </BaseText>
        </TouchableOpacity>

        <View style={styles.content}>
          <BaseText variant="bold" style={styles.title}>
            Register with mobile
          </BaseText>
          <BaseText style={styles.subtitle}>
            Please type your number, then well send a verification code for
            authentication.
          </BaseText>

          <View style={styles.inputGroup}>
            <BaseText style={styles.label}>Mobile Number</BaseText>
            <BaseInput
              placeholder="Enter your mobile"
              value={phoneNumber}
              onChangeText={(text) => {
                setPhoneNumber(text);
                if (error) setError("");
              }}
              keyboardType="phone-pad"
              containerStyle={styles.authInput}
              style={{ color: Colors.white }}
            />
            {error ? (
              <BaseText style={styles.errorText}>{error}</BaseText>
            ) : null}
          </View>
        </View>

        <BaseButton
          title="Send OTP"
          onPress={handleSendOTP}
          style={styles.submitButton}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
    paddingTop: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  backButtonText: {
    color: Colors.white,
    fontSize: 16,
    marginLeft: 8,
  },
  content: {
    // flex: 1,
  },
  title: {
    fontSize: 32,
    color: Colors.white,
    marginBottom: 10,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#A7AFB7",
    lineHeight: 20,
    marginBottom: 40,
  },
  inputGroup: {
    marginBottom: 50,
  },
  label: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  authInput: {
    backgroundColor: "#161C22",
    height: 56,
    marginBottom: 5,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    height: 56,
    borderRadius: 15,
    marginBottom: 30,
  },
});
