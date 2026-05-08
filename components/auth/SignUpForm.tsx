import Fingerprint from "@/assets/icons/auth/Fingerprint.svg";
import { Colors } from "@/constants";
import { signUpSchema } from "@/schema";
import { Ionicons } from "@expo/vector-icons";
import { useForm } from "@tanstack/react-form";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { BaseButton, BaseInput, BaseText } from "../ui";
import { SocialLoginSection } from "./SocialLoginSection";
import { AuthMethod } from "./types";

interface SignUpFormProps {
  onRegisterSuccess: () => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  onRegisterSuccess,
}) => {
  const [method, setMethod] = useState<AuthMethod>("email");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      method: "email" as AuthMethod,
      email: "",
      mobile: "",
      password: "",
    },
    validators: {
      onChange: signUpSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("Register with", value);
      onRegisterSuccess();
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

      <View style={styles.inputGroup}>
        <View style={styles.methodToggle}>
          <BaseText style={styles.inputLabel}>
            {method === "email" ? "Email" : "Mobile Number"}
          </BaseText>
          <TouchableOpacity
            onPress={() => {
              const newMethod = method === "email" ? "mobile" : "email";
              setMethod(newMethod);
              form.setFieldValue("method", newMethod);
            }}
          >
            <BaseText style={styles.toggleText}>
              {method === "email"
                ? "Register with mobile"
                : "Register with email"}
            </BaseText>
          </TouchableOpacity>
        </View>

        <form.Field name={method === "email" ? "email" : "mobile"}>
          {(field) => (
            <View>
              <BaseInput
                placeholder={
                  method === "email"
                    ? "Please enter email"
                    : "Enter your mobile"
                }
                value={field.state.value}
                onChangeText={field.handleChange}
                keyboardType={
                  method === "email" ? "email-address" : "phone-pad"
                }
                containerStyle={styles.authInput}
              />
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <BaseText style={styles.errorText}>
                  {field.state.meta.errors
                    .map((err: any) =>
                      typeof err === "string" ? err : err.message,
                    )
                    .join(", ")}
                </BaseText>
              )}
            </View>
          )}
        </form.Field>
      </View>

      <View style={styles.inputGroup}>
        <BaseText style={styles.inputLabel}>Password</BaseText>
        <form.Field name="password">
          {(field) => (
            <View>
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
              />
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <BaseText style={styles.errorText}>
                  {field.state.meta.errors
                    .map((err: any) =>
                      typeof err === "string" ? err : err.message,
                    )
                    .join(", ")}
                </BaseText>
              )}
            </View>
          )}
        </form.Field>
      </View>

      <BaseButton
        title="Sign up"
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
