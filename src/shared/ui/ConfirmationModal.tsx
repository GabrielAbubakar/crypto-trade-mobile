import { Colors } from "@/shared/constants";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { BaseButton } from "./BaseButton";
import { BaseModal } from "./BaseModal";
import { BaseText } from "./BaseText";

interface ConfirmationModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  showIcon?: boolean;
  iconName?: any;
  iconColor?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  onConfirm,
  onCancel,
  isLoading = false,
  title = "Log out",
  message = "Are you sure you want to logout?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  showIcon = true,
  iconName = "log-out-outline",
  iconColor = Colors.error,
}) => (
  <BaseModal visible={visible} onClose={onCancel}>
    {showIcon && (
      <View style={styles.iconWrapper}>
        <Ionicons name={iconName} size={36} color={iconColor} />
      </View>
    )}
    <BaseText variant="bold" size="lg" style={styles.title}>
      {title}
    </BaseText>
    <BaseText variant="regular" size="md" style={styles.message}>
      {message}
    </BaseText>
    <View style={styles.buttonRow}>
      <BaseButton
        title={cancelLabel}
        variant="secondary"
        onPress={onCancel}
        disabled={isLoading}
        style={styles.leftButton}
      />
      <BaseButton
        title={confirmLabel}
        variant="cancel"
        onPress={onConfirm}
        isLoading={isLoading}
        disabled={isLoading}
        style={styles.rightButton}
      />
    </View>
  </BaseModal>
);

const styles = StyleSheet.create({
  title: {
    color: Colors.white,
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    color: Colors.textSecondary,
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 22,
  },
  iconWrapper: {
    alignSelf: "center",
    marginBottom: 16,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255, 90, 90, 0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
  },
  leftButton: {
    flex: 1,
    marginRight: 10,
  },
  rightButton: {
    flex: 1,
  },
});
