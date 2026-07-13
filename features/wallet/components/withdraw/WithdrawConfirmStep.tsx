import { BackHeader, BaseText } from "@/components/ui";
import { Colors } from "@/core/constants";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface WithdrawConfirmStepProps {
  form: any;
  selectedSymbol: string;
  network: string;
  isSubmitting: boolean;
  onSubmit: () => void;
  onBack: () => void;
}

export function WithdrawConfirmStep({
  form,
  selectedSymbol,
  network,
  isSubmitting,
  onSubmit,
  onBack,
}: WithdrawConfirmStepProps) {
  return (
    <>
      <View style={styles.header}>
        <BackHeader title="Confirm withdrawal" onBack={onBack} />
        <BaseText style={styles.headerSubtitle}>
          Review every detail before submitting.
        </BaseText>
      </View>

      <View style={styles.formContent}>
        <View style={styles.summaryContainer}>
          <BaseText variant="bold" style={styles.summaryAmount}>
            {parseFloat(form.state.values.amount).toFixed(2)} {selectedSymbol}
          </BaseText>
        </View>

        {/* Details table */}
        <View style={styles.detailsTable}>
          <View style={styles.detailsRow}>
            <BaseText style={styles.detailsLabel}>Asset</BaseText>
            <BaseText variant="bold" style={styles.detailsValue}>
              {selectedSymbol}
            </BaseText>
          </View>
          <View style={styles.detailsRow}>
            <BaseText style={styles.detailsLabel}>Network</BaseText>
            <BaseText variant="bold" style={styles.detailsValue}>
              {network || "TRC20"}
            </BaseText>
          </View>
          <View style={styles.detailsRow}>
            <BaseText style={styles.detailsLabel}>Address</BaseText>
            <BaseText variant="bold" style={styles.detailsValue}>
              {form.state.values.address.length > 15
                ? `${form.state.values.address.slice(0, 8)}...${form.state.values.address.slice(-6)}`
                : form.state.values.address}
            </BaseText>
          </View>
          <View style={styles.detailsRow}>
            <BaseText style={styles.detailsLabel}>Fee</BaseText>
            <BaseText variant="bold" style={styles.detailsValue}>
              1.00 {selectedSymbol}
            </BaseText>
          </View>
          <View
            style={[
              styles.detailsRow,
              { borderBottomWidth: 0, paddingBottom: 0 },
            ]}
          >
            <BaseText style={styles.detailsLabel}>You receive</BaseText>
            <BaseText
              variant="bold"
              style={[styles.detailsValue, { color: Colors.primary }]}
            >
              {(parseFloat(form.state.values.amount) - 1.0).toFixed(2)}{" "}
              {selectedSymbol}
            </BaseText>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onSubmit}
          disabled={isSubmitting}
          style={[styles.actionBtn, isSubmitting && styles.disabledBtn]}
        >
          <BaseText variant="bold" style={styles.actionBtnText}>
            {isSubmitting ? "Submitting..." : "Submit withdrawal"}
          </BaseText>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 20,
    marginBottom: 20,
  },
  headerSubtitle: {
    color: "#777777",
    fontSize: 14,
  },
  formContent: {
    gap: 16,
    marginBottom: 20,
  },
  summaryContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  summaryAmount: {
    color: Colors.white,
    fontSize: 36,
  },
  detailsTable: {
    backgroundColor: "#141820",
    borderRadius: 20,
    padding: 20,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 14,
    marginBottom: 14,
  },
  detailsLabel: {
    color: "#777777",
    fontSize: 14,
  },
  detailsValue: {
    color: Colors.white,
    fontSize: 14,
  },
  footer: {
    paddingBottom: 40,
    marginTop: 10,
  },
  actionBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnText: {
    color: Colors.secondary,
    fontSize: 16,
  },
  disabledBtn: {
    opacity: 0.5,
  },
});
