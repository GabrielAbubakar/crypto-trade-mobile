import { Colors } from "@/constants";
import type { ITransactionItem } from "@/types";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { BaseText } from "../ui";

interface WalletTransactionRowProps {
  transaction: ITransactionItem;
}

export const WalletTransactionRow: React.FC<WalletTransactionRowProps> = ({
  transaction,
}) => {
  let IconName: any = "arrow-down-left";
  let iconColor = Colors.primary;
  let amountPrefix = "+";

  if (transaction.type === "withdrawal") {
    IconName = "arrow-up-right";
    iconColor = Colors.error;
    amountPrefix = "-";
  } else if (transaction.type === "transfer") {
    IconName = "repeat";
    iconColor = "#3861FB";
    amountPrefix = "";
  }

  const dateStr = new Date(transaction.timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View style={styles.row}>
      <View style={styles.leftCol}>
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
          <Feather name={IconName} size={18} color={iconColor} />
        </View>
        <View style={styles.textStack}>
          <BaseText variant="bold" style={styles.title}>
            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} {transaction.symbol}
          </BaseText>
          <BaseText style={styles.date}>{dateStr}</BaseText>
        </View>
      </View>

      <View style={styles.rightCol}>
        <BaseText
          variant="bold"
          style={[
            styles.amount,
            {
              color:
                transaction.type === "deposit"
                  ? Colors.primary
                  : transaction.type === "withdrawal"
                  ? Colors.error
                  : "#FFFFFF",
            },
          ]}
        >
          {amountPrefix}
          {Number(transaction.amount).toLocaleString(undefined, {
            maximumFractionDigits: 6,
          })}{" "}
          {transaction.symbol}
        </BaseText>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                transaction.status === "completed"
                  ? "rgba(94, 213, 168, 0.1)"
                  : transaction.status === "pending"
                  ? "rgba(255, 178, 54, 0.1)"
                  : "rgba(255, 87, 87, 0.1)",
            },
          ]}
        >
          <BaseText
            style={[
              styles.statusText,
              {
                color:
                  transaction.status === "completed"
                    ? Colors.primary
                    : transaction.status === "pending"
                    ? "#FFB236"
                    : Colors.error,
              },
            ]}
          >
            {transaction.status}
          </BaseText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  leftCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  textStack: {
    justifyContent: "center",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 4,
  },
  date: {
    color: "#777777",
    fontSize: 12,
  },
  rightCol: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  amount: {
    fontSize: 16,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
});
