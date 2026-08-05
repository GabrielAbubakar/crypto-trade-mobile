import { BaseButton, BaseText, ScreenContainer } from "@/shared/ui";
import { Colors, FontFamily } from "@/shared/constants";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function TradeStatusScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    status: "success" | "failed";
    type?: string;
    reference?: string;
    paid?: string;
    received?: string;
    fee?: string;
    reason?: string;
    required?: string;
    available?: string;
  }>();

  const isSuccess = params.status === "success";

  const handleAction = () => {
    if (isSuccess) {
      // Route to Wallets transactions list
      router.replace("/(tabs)/wallets/transactions");
    } else {
      // Go back to the input form
      router.replace({
        pathname: "/(tabs)/trades/operation",
        params: { type: params.type || "buy" },
      });
    }
  };

  return (
    <ScreenContainer scrollable={true} style={styles.container}>
      <View style={styles.content}>
        {isSuccess ? (
          // SUCCESS FLOW (Completed)
          <View style={styles.alignCenter}>
            <View
              style={[styles.statusCircle, { borderColor: Colors.primary }]}
            >
              <Ionicons name="checkmark" size={50} color={Colors.primary} />
            </View>

            <BaseText variant="bold" style={styles.title}>
              Trade completed
            </BaseText>
            <BaseText style={styles.subtitle}>
              Your sandbox trade has settled successfully.
            </BaseText>

            <BaseText variant="bold" style={styles.headlineValue}>
              {params.received
                ? `${params.received} received`
                : "Trade completed"}
            </BaseText>

            {/* Success Details Table */}
            <View style={styles.detailsTable}>
              <View style={styles.tableRow}>
                <BaseText style={styles.tableLabel}>Reference</BaseText>
                <BaseText style={styles.tableValue}>
                  {params.reference || "CRT-BUY-1779"}
                </BaseText>
              </View>

              <View style={styles.tableRow}>
                <BaseText style={styles.tableLabel}>Paid</BaseText>
                <BaseText style={styles.tableValue}>
                  {params.paid || "250.00 USDT"}
                </BaseText>
              </View>

              <View style={styles.tableRow}>
                <BaseText style={styles.tableLabel}>Received</BaseText>
                <BaseText style={styles.tableValue}>
                  {params.received || "0.00384 BTC"}
                </BaseText>
              </View>

              <View style={styles.tableRow}>
                <BaseText style={styles.tableLabel}>Fee</BaseText>
                <BaseText style={styles.tableValue}>
                  {params.fee || "2.50 USDT"}
                </BaseText>
              </View>

              <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
                <BaseText style={styles.tableLabel}>Status</BaseText>
                <BaseText
                  variant="bold"
                  style={[styles.tableValue, { color: Colors.primary }]}
                >
                  Completed
                </BaseText>
              </View>
            </View>
          </View>
        ) : (
          // FAILURE FLOW (Failed)
          <View style={styles.alignCenter}>
            <View style={[styles.statusCircle, { borderColor: Colors.error }]}>
              <Ionicons name="close" size={50} color={Colors.error} />
            </View>

            <BaseText variant="bold" style={styles.title}>
              Trade failed
            </BaseText>
            <BaseText style={styles.subtitle}>
              The trade could not be completed.
            </BaseText>

            <BaseText
              variant="bold"
              style={[styles.headlineValue, { color: Colors.error }]}
            >
              {params.reason || "Insufficient balance"}
            </BaseText>

            <BaseText style={styles.reasonExplain}>
              Your available balance changed or became invalid before the quote
              was executed.
            </BaseText>

            {/* Failure Details Table */}
            <View style={styles.detailsTable}>
              <View style={styles.tableRow}>
                <BaseText style={styles.tableLabel}>Required</BaseText>
                <BaseText style={styles.tableValue}>
                  {params.required || "250.00 USDT"}
                </BaseText>
              </View>

              <View style={styles.tableRow}>
                <BaseText style={styles.tableLabel}>Available</BaseText>
                <BaseText style={[styles.tableValue, { color: Colors.error }]}>
                  {params.available || "124.00 USDT"}
                </BaseText>
              </View>

              <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
                <BaseText style={styles.tableLabel}>Status</BaseText>
                <BaseText
                  variant="bold"
                  style={[styles.tableValue, { color: Colors.error }]}
                >
                  Failed
                </BaseText>
              </View>
            </View>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <BaseButton
          title={isSuccess ? "View transaction" : "Edit amount"}
          onPress={handleAction}
          style={[
            styles.actionBtn,
            { backgroundColor: isSuccess ? Colors.primary : Colors.error },
          ]}
          textStyle={{ color: isSuccess ? Colors.secondary : Colors.white }}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondary,
    flex: 1,
  },
  content: {
    marginTop: 60,
  },
  alignCenter: {
    alignItems: "center",
  },
  statusCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    color: Colors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 28,
  },
  headlineValue: {
    fontSize: 26,
    color: Colors.white,
    textAlign: "center",
    marginBottom: 10,
  },
  reasonExplain: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: 32,
    marginBottom: 28,
    lineHeight: 18,
  },
  detailsTable: {
    backgroundColor: Colors.cardBg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.04)",
    paddingHorizontal: 20,
    paddingVertical: 8,
    width: "100%",
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.04)",
  },
  tableLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  tableValue: {
    fontSize: 14,
    color: Colors.white,
    fontFamily: FontFamily.bold,
  },
  footer: {
    marginTop: 40,
    marginBottom: 20,
  },
  actionBtn: {
    height: 56,
    borderRadius: 16,
  },
});
