import Fingerprint from "@/assets/icons/auth/Fingerprint.svg";
import { Colors } from "@/constants";
import { signInSchema } from "@/schema";
import { setCredentials, useAppDispatch, useLoginMutation } from "@/store";
import { showToast } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { useForm } from "@tanstack/react-form";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { BaseButton, BaseInput, BaseText } from "../ui";
import { SocialLoginSection } from "./SocialLoginSection";
import type { AuthMethod } from "./types";

export const SignInForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const [method, setMethod] = useState<AuthMethod>("email");
  const [showPassword, setShowPassword] = useState(false);
  const [signIn, { isLoading, error }] = useLoginMutation();

  const form = useForm({
    defaultValues: {
      method: "email" as AuthMethod,
      email: "",
      phone: "",
      password: "",
    },
    validators: {
      onChange: signInSchema,
    },
    onSubmit: async ({ value, meta }) => {
      // console.log("Signing in...");
      try {
        const res = await signIn({
          loginType: method,
          identifier: method === "email" ? value.email : value.phone,
          password: value.password,
        }).unwrap();

        dispatch(setCredentials(res));
        showToast("success", "Signed in successfully.");
        router.replace("/(tabs)/home");
      } catch (error) {
        const message =
          (error as any)?.data?.message ||
          (error as any)?.message ||
          "Unable to sign in";
        showToast("error", message);
        console.error("Error signing in:", error);
      }
    },
  });

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <BaseText variant="bold" style={styles.formTitle}>
        Sign in
      </BaseText>

      <View style={styles.inputGroup}>
        <View style={styles.methodToggle}>
          <BaseText style={styles.inputLabel}>
            {method === "email" ? "Email" : "Mobile Number"}
          </BaseText>
          <TouchableOpacity
            onPress={() => {
              const newMethod = method === "email" ? "phone" : "email";
              setMethod(newMethod);
              form.setFieldValue("method", newMethod);
            }}
          >
            <BaseText style={styles.toggleText}>
              {method === "email"
                ? "Sign in with mobile"
                : "Sign in with email"}
            </BaseText>
          </TouchableOpacity>
        </View>

        <form.Field name={method === "email" ? "email" : "phone"}>
          {(field) => (
            <BaseInput
              placeholder={
                method === "email" ? "Enter your email" : "Enter your mobile"
              }
              value={field.state.value}
              onChangeText={field.handleChange}
              keyboardType={method === "email" ? "email-address" : "phone-pad"}
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

      <View style={styles.inputGroup}>
        <BaseText style={styles.inputLabel}>Password</BaseText>
        <form.Field name="password">
          {(field) => (
            <BaseInput
              placeholder="Enter your password"
              // secureTextEntry={!showPassword}
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

      <TouchableOpacity>
        <BaseText style={styles.forgotPassword}>Forgot password?</BaseText>
      </TouchableOpacity>

      <BaseButton
        title="Sign in"
        isLoading={isLoading}
        onPress={() => form.handleSubmit()}
        style={styles.submitButton}
      />

      <SocialLoginSection />

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
  forgotPassword: {
    color: Colors.primary,
    fontSize: 14,
    textAlign: "left",
    marginBottom: 30,
    marginTop: -10,
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
