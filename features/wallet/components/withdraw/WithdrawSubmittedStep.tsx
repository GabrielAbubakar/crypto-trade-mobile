import { BackHeader, BaseText } from "@/components/ui";
import { Colors } from "@/core/constants";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface WithdrawSubmittedStepProps {
  form: any;
  selectedSymbol: string;
  txId: string;
  onBack: () => void;
}

export function WithdrawSubmittedStep({
  form,
  selectedSymbol,
  txId,
  onBack,
}: WithdrawSubmittedStepProps) {
  const router = useRouter();

  return (
    <>
      <View style={styles.header}>
        <BackHeader title="Withdrawal submitted" onBack={onBack} />
        <BaseText style={styles.headerSubtitle}>
          Finance review can approve or reject this request.
        </BaseText>
      </View>

      <View style={styles.formContent}>
        {/* Checkmark Indicator */}
        <View style={styles.successContainer}>
          <View style={styles.successCircle}>
            <Feather name="check" size={48} color={Colors.primary} />
          </View>
        </View>

        {/* Status table */}
        <View style={styles.detailsTable}>
          <View style={styles.detailsRow}>
            <BaseText style={styles.detailsLabel}>Status</BaseText>
            <BaseText variant="bold" style={{ color: Colors.warning }}>
              Pending review
            </BaseText>
          </View>
          <View style={styles.detailsRow}>
            <BaseText style={styles.detailsLabel}>Amount</BaseText>
            <BaseText variant="bold" style={styles.detailsValue}>
              {parseFloat(form.state.values.amount).toFixed(2)} {selectedSymbol}
            </BaseText>
          </View>
          <View style={styles.detailsRow}>
            <BaseText style={styles.detailsLabel}>Fee</BaseText>
            <BaseText variant="bold" style={styles.detailsValue}>
              1.00 {selectedSymbol}
            </BaseText>
          </View>
          <View style={styles.detailsRow}>
            <BaseText style={styles.detailsLabel}>Reference</BaseText>
            <BaseText variant="bold" style={styles.detailsValue}>
              {txId}
            </BaseText>
          </View>
          <View
            style={[
              styles.detailsRow,
              { borderBottomWidth: 0, paddingBottom: 0 },
            ]}
          >
            <BaseText style={styles.detailsLabel}>Created</BaseText>
            <BaseText variant="bold" style={styles.detailsValue}>
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </BaseText>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname: "/(tabs)/wallets/transaction/[id]",
              params: { id: txId },
            })
          }
          style={styles.actionBtn}
        >
          <BaseText variant="bold" style={styles.actionBtnText}>
            View transaction
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
  successContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  successCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(94, 213, 168, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.primary,
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
});
