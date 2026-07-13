import { Colors } from "@/core/constants";
import type { IPriceAlert } from "@/core/types";
import React, { useEffect, useState } from "react";
import { StyleSheet, Switch, TouchableOpacity, View } from "react-native";
import { BaseButton } from "./BaseButton";
import { BaseInput } from "./BaseInput";
import { BaseModal } from "./BaseModal";
import { BaseText } from "./BaseText";

interface EditPriceAlertModalProps {
  visible: boolean;
  alert: IPriceAlert | null;
  onClose: () => void;
  onConfirm: (updatedFields: {
    targetPriceUsd: number;
    direction: "above" | "below" | string;
    isActive: boolean;
  }) => Promise<void>;
  isLoading?: boolean;
}

export const EditPriceAlertModal: React.FC<EditPriceAlertModalProps> = ({
  visible,
  alert,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const [price, setPrice] = useState("");
  const [direction, setDirection] = useState<"above" | "below" | string>("above");
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (alert) {
      setPrice(alert.targetPriceUsd.toString());
      setDirection(alert.direction);
      setIsActive(alert.isActive);
      setError("");
    }
  }, [alert, visible]);

  const handleSave = async () => {
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setError("Please enter a valid price greater than 0");
      return;
    }
    setError("");
    await onConfirm({
      targetPriceUsd: parsedPrice,
      direction,
      isActive,
    });
  };

  if (!alert) return null;

  return (
    <BaseModal visible={visible} onClose={onClose}>
      <BaseText variant="bold" size="lg" style={styles.title}>
        Edit Price Alert
      </BaseText>

      <View style={styles.assetHeader}>
        <BaseText variant="bold" size="md" color={Colors.white}>
          Asset: {alert.assetSymbol}
        </BaseText>
      </View>

      <View style={styles.fieldContainer}>
        <BaseText size="sm" color={Colors.textSecondary} style={styles.label}>
          Target Price (USD)
        </BaseText>
        <BaseInput
          value={price}
          onChangeText={(val) => {
            setPrice(val);
            if (error) setError("");
          }}
          keyboardType="decimal-pad"
          containerStyle={styles.inputContainer}
          style={styles.inputText}
          placeholder="e.g. 95000"
          error={error}
        />
      </View>

      <View style={styles.fieldContainer}>
        <BaseText size="sm" color={Colors.textSecondary} style={styles.label}>
          Trigger Direction
        </BaseText>
        <View style={styles.directionRow}>
          <TouchableOpacity
            style={[
              styles.directionButton,
              direction === "above" && styles.directionButtonActive,
            ]}
            onPress={() => setDirection("above")}
            activeOpacity={0.8}
          >
            <BaseText
              variant="bold"
              size="sm"
              color={direction === "above" ? Colors.secondary : Colors.textSecondary}
            >
              Goes Above
            </BaseText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.directionButton,
              direction === "below" && styles.directionButtonActive,
            ]}
            onPress={() => setDirection("below")}
            activeOpacity={0.8}
          >
            <BaseText
              variant="bold"
              size="sm"
              color={direction === "below" ? Colors.secondary : Colors.textSecondary}
            >
              Goes Below
            </BaseText>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.switchRow}>
        <View style={styles.switchTextContainer}>
          <BaseText variant="bold" size="sm" color={Colors.white}>
            Active Alert
          </BaseText>
          <BaseText size="xs" color={Colors.textSecondary}>
            Receive notifications when triggered
          </BaseText>
        </View>
        <Switch
          value={isActive}
          onValueChange={setIsActive}
          trackColor={{ false: "#1A2130", true: Colors.primary }}
          thumbColor={Colors.white}
        />
      </View>

      <View style={styles.buttonRow}>
        <BaseButton
          title="Cancel"
          variant="secondary"
          onPress={onClose}
          disabled={isLoading}
          style={styles.leftButton}
        />
        <BaseButton
          title="Save"
          variant="primary"
          onPress={handleSave}
          isLoading={isLoading}
          disabled={isLoading}
          style={styles.rightButton}
        />
      </View>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  title: {
    color: Colors.white,
    marginBottom: 16,
    textAlign: "center",
  },
  assetHeader: {
    backgroundColor: "#161C22",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: "#141820",
    borderWidth: 1,
    borderColor: "#1E2633",
  },
  inputText: {
    color: Colors.white,
  },
  directionRow: {
    flexDirection: "row",
    gap: 12,
  },
  directionButton: {
    flex: 1,
    backgroundColor: "#141820",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1E2633",
  },
  directionButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#141820",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1E2633",
    marginBottom: 24,
  },
  switchTextContainer: {
    flex: 1,
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
