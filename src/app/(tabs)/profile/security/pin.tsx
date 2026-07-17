import { BackHeader, BaseButton, BaseInput, ScreenContainer } from "@/shared/ui";
import { BaseText } from "@/shared/ui/BaseText";
import { Colors } from "@/shared/constants";
import { useUpdateTransactionPinMutation } from "@/store/store";
import { showErrorToast, showSuccessToast } from "@/shared/utils";
import { updatePinSchema } from "@/features/profile/schemas/security.schema";
import { Ionicons } from "@expo/vector-icons";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function TransactionPinScreen() {
  const router = useRouter();
  const [updatePin, { isLoading }] = useUpdateTransactionPinMutation();

  const [showPin, setShowPin] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const form = useForm({
    defaultValues: {
      currentPin: "",
      newPin: "",
      confirmPin: "",
    },
    validators: {
      onChange: updatePinSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await updatePin({
          currentPin: value.currentPin,
          newPin: value.newPin,
        }).unwrap();
        showSuccessToast("Transaction PIN updated successfully");
        router.back();
      } catch (err: any) {
        showErrorToast(err?.data?.error?.message || "Failed to update PIN");
      }
    },
  });

  return (
    <ScreenContainer style={styles.container} withPadding={true}>
      <BackHeader title="Transaction PIN" />

      <BaseText color="#8594A6" style={styles.subtitle}>
        Update the PIN used for trade and withdrawal confirmations.
      </BaseText>

      <BaseText color="#8594A6" size="xs">
        Default PIN is 0000.
      </BaseText>

      <View style={styles.form}>
        {/* Current PIN */}
        <View style={styles.inputGroup}>
          <BaseText variant="bold" color="#FFFFFF" style={styles.label}>
            Current PIN
          </BaseText>
          <form.Field name="currentPin">
            {(field) => (
              <BaseInput
                placeholder="••••"
                secureTextEntry={!showPin.current}
                value={field.state.value}
                onChangeText={field.handleChange}
                keyboardType="numeric"
                maxLength={4}
                containerStyle={styles.authInput}
                style={{ color: "#FFFFFF", fontSize: 18 }}
                rightIcon={
                  <TouchableOpacity
                    onPress={() =>
                      setShowPin((prev) => ({
                        ...prev,
                        current: !prev.current,
                      }))
                    }
                  >
                    <Ionicons
                      name={showPin.current ? "eye-off" : "eye"}
                      size={20}
                      color="#8594A6"
                    />
                  </TouchableOpacity>
                }
                error={
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
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

        {/* New PIN */}
        <View style={styles.inputGroup}>
          <BaseText variant="bold" color="#FFFFFF" style={styles.label}>
            New PIN
          </BaseText>
          <form.Field name="newPin">
            {(field) => (
              <BaseInput
                placeholder="••••"
                secureTextEntry={!showPin.new}
                value={field.state.value}
                onChangeText={field.handleChange}
                keyboardType="numeric"
                maxLength={4}
                containerStyle={styles.authInput}
                style={{ color: "#FFFFFF", fontSize: 18 }}
                rightIcon={
                  <TouchableOpacity
                    onPress={() =>
                      setShowPin((prev) => ({ ...prev, new: !prev.new }))
                    }
                  >
                    <Ionicons
                      name={showPin.new ? "eye-off" : "eye"}
                      size={20}
                      color="#8594A6"
                    />
                  </TouchableOpacity>
                }
                error={
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
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

        {/* Confirm PIN */}
        <View style={styles.inputGroup}>
          <BaseText variant="bold" color="#FFFFFF" style={styles.label}>
            Confirm PIN
          </BaseText>
          <form.Field name="confirmPin">
            {(field) => (
              <BaseInput
                placeholder="••••"
                secureTextEntry={!showPin.confirm}
                value={field.state.value}
                onChangeText={field.handleChange}
                keyboardType="numeric"
                maxLength={4}
                containerStyle={styles.authInput}
                style={{ color: "#FFFFFF", fontSize: 18 }}
                rightIcon={
                  <TouchableOpacity
                    onPress={() =>
                      setShowPin((prev) => ({
                        ...prev,
                        confirm: !prev.confirm,
                      }))
                    }
                  >
                    <Ionicons
                      name={showPin.confirm ? "eye-off" : "eye"}
                      size={20}
                      color="#8594A6"
                    />
                  </TouchableOpacity>
                }
                error={
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
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
      </View>

      {/* PIN Rules */}
      <View style={styles.rulesBox}>
        <BaseText variant="bold" color="#8594A6" style={styles.rulesTitle}>
          PIN rules
        </BaseText>
        <BaseText size="sm" color="#8594A6" style={styles.rulesText}>
          Use four digits. Avoid repeated or obvious numbers.
        </BaseText>
      </View>

      <BaseButton
        title="Update PIN"
        onPress={() => form.handleSubmit()}
        isLoading={isLoading}
        style={styles.actionButton}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondary,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 20,
  },
  form: {
    gap: 20,
    marginBottom: 30,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
  },
  authInput: {
    backgroundColor: "#141820",
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  rulesBox: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.04)",
    marginBottom: 32,
  },
  rulesTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  rulesText: {
    lineHeight: 18,
  },
  actionButton: {
    width: "100%",
    marginBottom: 40,
  },
});
