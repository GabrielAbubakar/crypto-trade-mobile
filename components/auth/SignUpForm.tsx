import Fingerprint from "@/assets/icons/auth/Fingerprint.svg";
import { Colors } from "@/constants";
import { signUpSchema } from "@/schema";
import { useRequestOTPMutation } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import { useForm } from "@tanstack/react-form";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { BaseButton, BaseInput, BaseText } from "../ui";
import { SocialLoginSection } from "./SocialLoginSection";
import type { AuthMethod } from "./types";

export const SignUpForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [requestOtp, { isLoading }] = useRequestOTPMutation();

  const form = useForm({
    defaultValues: {
      method: "email" as AuthMethod,
      fullName: "",
      email: "",
      phone: "",
      password: "",
    },
    validators: {
      onChange: signUpSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await requestOtp({
          email: value.email,
        }).unwrap();
        router.push({
          pathname: "/(auth)/otp",
          params: {
            identifier: value.email,
            fullName: value.fullName,
            phone: value.phone,
            password: value.password,
          },
        });
      } catch (error) {
        console.log("Error requesting OTP:", error);
      }
    },
  });

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <BaseText variant="bold" style={styles.formTitle}>
        Sign up
      </BaseText>

      {/* Full Name */}
      <View style={styles.inputGroup}>
        <View style={styles.methodToggle}>
          <BaseText style={styles.inputLabel}>Full Name</BaseText>
          <TouchableOpacity
            onPress={() => {
              router.push("/register-mobile");
            }}
          >
            <BaseText style={styles.toggleText}>Register with mobile</BaseText>
          </TouchableOpacity>
        </View>
        <form.Field name="fullName">
          {(field) => (
            <BaseInput
              placeholder="Please enter full name"
              value={field.state.value}
              onChangeText={field.handleChange}
              containerStyle={styles.authInput}
              error={
                field.state.meta.isTouched && field.state.meta.errors.length > 0
                  ? field.state.meta.errors
                      .map((err: any) =>
                        typeof err === "string" ? err : err.message,
                      )
                      .join(", ")
                  : undefined
              }
            />
          )}
        </form.Field>
      </View>

      {/* Email */}
      <View style={styles.inputGroup}>
        <BaseText style={styles.inputLabel}>Email</BaseText>

        <form.Field name="email">
          {(field) => (
            <BaseInput
              placeholder="Please enter email"
              value={field.state.value}
              onChangeText={field.handleChange}
              keyboardType="email-address"
              containerStyle={styles.authInput}
              error={
                field.state.meta.isTouched && field.state.meta.errors.length > 0
                  ? field.state.meta.errors
                      .map((err: any) =>
                        typeof err === "string" ? err : err.message,
                      )
                      .join(", ")
                  : undefined
              }
            />
          )}
        </form.Field>
      </View>

      {/* Mobile Number */}
      <View style={styles.inputGroup}>
        <BaseText style={styles.inputLabel}>Mobile Number</BaseText>
        <form.Field name="phone">
          {(field) => (
            <BaseInput
              placeholder="Enter your mobile"
              value={field.state.value}
              onChangeText={field.handleChange}
              keyboardType="phone-pad"
              containerStyle={styles.authInput}
              error={
                field.state.meta.isTouched && field.state.meta.errors.length > 0
                  ? field.state.meta.errors
                      .map((err: any) =>
                        typeof err === "string" ? err : err.message,
                      )
                      .join(", ")
                  : undefined
              }
            />
          )}
        </form.Field>
      </View>

      {/* Password */}
      <View style={styles.inputGroup}>
        <BaseText style={styles.inputLabel}>Password</BaseText>
        <form.Field name="password">
          {(field) => (
            <BaseInput
              placeholder="Please enter password"
              secureTextEntry={!showPassword}
              value={field.state.value}
              onChangeText={field.handleChange}
              containerStyle={styles.authInput}
              rightIcon={
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color={Colors.textSecondary}
                  />
                </TouchableOpacity>
              }
              error={
                field.state.meta.isTouched && field.state.meta.errors.length > 0
                  ? field.state.meta.errors
                      .map((err: any) =>
                        typeof err === "string" ? err : err.message,
                      )
                      .join(", ")
                  : undefined
              }
            />
          )}
        </form.Field>
      </View>

      <BaseButton
        title="Sign up"
        isLoading={isLoading}
        onPress={() => form.handleSubmit()}
        style={styles.submitButton}
      />

      <SocialLoginSection label="Or sign up with" />

      <View style={styles.fingerprintContainer}>
        <Fingerprint />
        <BaseText style={styles.fingerprintText}>
          Use fingerprint, instead?
        </BaseText>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingTop: 30,
  },
  formTitle: {
    fontSize: 32,
    color: Colors.white,
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  methodToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  toggleText: {
    fontSize: 14,
    color: Colors.primary,
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
  },
  submitButton: {
    height: 56,
    borderRadius: 15,
  },
  fingerprintContainer: {
    marginTop: 50,
    alignItems: "center",
    marginBottom: 30,
  },
  fingerprintText: {
    color: Colors.textSecondary,
    marginTop: 10,
  },
});
