import { Colors } from "@/constants";
import type { ITransactionItem } from "@/types";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { BaseText } from "../ui";

interface WalletTransactionRowProps {
  transaction: ITransactionItem;
}

export const WalletTransactionRow: React.FC<WalletTransactionRowProps> = ({
  transaction,
}) => {
  const router = useRouter();

  const displayAsset =
    transaction.type === "withdrawal" ? transaction.fromAsset : transaction.toAsset;
  const displayAmount =
    transaction.type === "withdrawal" ? transaction.fromAmount : transaction.toAmount;

  let iconName: any = "arrow-down-left";
  let iconColor = Colors.primary;
  let amountPrefix = "+";

  if (transaction.type === "withdrawal") {
    iconName = "arrow-up-right";
    iconColor = Colors.error;
    amountPrefix = "-";
  } else if (transaction.type === "transfer") {
    iconName = "repeat";
    iconColor = Colors.info;
    amountPrefix = "";
  }

  const isCompleted = transaction.status === "completed";
  const dateStr = new Date(transaction.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: "/(tabs)/wallets/transaction/[id]",
          params: { id: transaction.id },
        })
      }
      style={styles.transactionRow}
    >
      <View style={styles.transactionLeft}>
        <View
          style={[
            styles.transactionIcon,
            { backgroundColor: `${iconColor}15` },
          ]}
        >
          <Feather name={iconName} size={16} color={iconColor} />
        </View>
        <View style={styles.transactionNameStack}>
          <BaseText variant="bold" style={styles.transactionTitle}>
            {transaction.type === "deposit"
              ? "Sandbox deposit"
              : transaction.type === "withdrawal"
                ? "USDT withdrawal"
                : "Transfer"}
          </BaseText>
          <BaseText style={styles.transactionSubtitle}>
            {isCompleted ? "Completed" : "Pending"}
          </BaseText>
        </View>
      </View>
      <View style={styles.transactionRight}>
        <BaseText
          variant="bold"
          style={[
            styles.transactionAmount,
            {
              color:
                transaction.type === "withdrawal" ? Colors.error : Colors.primary,
            },
          ]}
        >
          {amountPrefix}
          {Number(displayAmount).toLocaleString(undefined, {
            maximumFractionDigits: 6,
          })}{" "}
          {displayAsset}
        </BaseText>
        <BaseText style={styles.transactionTime}>{dateStr}</BaseText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#161C22",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.03)",
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  transactionNameStack: {
    justifyContent: "center",
  },
  transactionTitle: {
    color: Colors.white,
    fontSize: 14,
    marginBottom: 2,
  },
  transactionSubtitle: {
    color: "#777777",
    fontSize: 12,
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontSize: 14,
    marginBottom: 2,
  },
  transactionTime: {
    color: "#777777",
    fontSize: 12,
  },
});
