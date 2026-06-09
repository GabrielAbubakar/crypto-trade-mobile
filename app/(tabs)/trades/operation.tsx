import {
  BackHeader,
  BaseButton,
  BaseInput,
  BaseText,
  ScreenContainer,
} from "@/components";
import { Colors, FontFamily } from "@/constants";
import {
  useCreateQuoteMutation,
  useGetMarketPricesQuery,
  useGetWalletBalancesQuery,
} from "@/store";
import { showErrorToast } from "@/utils";
import { useForm } from "@tanstack/react-form";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

type TradeType = "buy" | "sell" | "swap";

export default function TradeOperationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<TradeType>(
    (params.type as TradeType) || "buy",
  );

  // API Integration
  const { data: balanceData, isLoading: isBalanceLoading } =
    useGetWalletBalancesQuery();
  const { data: marketPrices, isLoading: isPricesLoading } =
    useGetMarketPricesQuery();

  const [createQuote, { isLoading: isQuoteCreating }] =
    useCreateQuoteMutation();

  // Selected Assets state
  const [fromAsset, setFromAsset] = useState("USDT");
  const [toAsset, setToAsset] = useState("BTC");

  // Adjust defaults when tab switches
  useEffect(() => {
    if (activeTab === "buy") {
      setFromAsset("USDT");
      setToAsset("BTC");
    } else if (activeTab === "sell") {
      setFromAsset("BTC");
      setToAsset("USDT");
    } else {
      setFromAsset("USDT");
      setToAsset("BTC");
    }
  }, [activeTab]);

  // Find asset price helper
  const getAssetPrice = (symbol: string): number => {
    if (symbol === "USDT" || symbol === "USDC" || symbol === "USD") return 1.0;
    if (!marketPrices?.data) {
      // Hardcoded fallback estimates for visual layout
      if (symbol === "BTC") return 64200.5;
      if (symbol === "ETH") return 3100.25;
      if (symbol === "SOL") return 145.8;
      return 1.0;
    }
    const found = marketPrices?.data.find(
      (p) => p.symbol.toUpperCase() === symbol.toUpperCase(),
    );
    if (!found) return 1.0;
    return typeof found.price === "string"
      ? parseFloat(found.price)
      : found.price;
  };

  // Find user's available balance helper
  const getAvailableBalance = (symbol: string): number => {
    if (!balanceData?.wallet?.balances) return 0.0;
    // For cash / stable, treat USD and USDT interchangeably if needed
    const normalizedSymbol =
      symbol.toUpperCase() === "USDT" ? "USD" : symbol.toUpperCase();
    const balance = balanceData.wallet.balances.find(
      (b) => b.assetSymbol.toUpperCase() === normalizedSymbol,
    );
    return balance?.available ?? 0.0;
  };

  const currentAvailable = getAvailableBalance(fromAsset);

  // TanStack Form
  const form = useForm({
    defaultValues: {
      amount: "",
    },
    onSubmit: async ({ value }) => {
      const parsedAmount = parseFloat(value.amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        showErrorToast("Please enter a valid positive amount.");
        return;
      }

      if (parsedAmount > currentAvailable) {
        showErrorToast(
          `Insufficient balance. You only have ${currentAvailable.toFixed(4)} ${fromAsset}.`,
        );
        return;
      }

      try {
        const response = await createQuote({
          type: activeTab,
          fromAsset,
          toAsset,
          fromAmount: parsedAmount,
        }).unwrap();

        // Redirect to quote preview
        router.push({
          pathname: "/(tabs)/trades/quote-preview",
          params: { quoteId: response.id },
        });
      } catch (err: any) {
        showErrorToast(
          err?.data?.error?.message ||
            err?.data?.message ||
            "Failed to create quote. Please complete identity verification.",
        );
      }
    },
  });

  // Calculate live conversion estimate
  const amountStr = form.state.values.amount;
  const inputAmount = parseFloat(amountStr) || 0;
  const fromPrice = getAssetPrice(fromAsset);
  const toPrice = getAssetPrice(toAsset);

  let receiveAmount = 0;
  let estimatedRateText = "";

  if (activeTab === "buy") {
    // USDT -> BTC (Buy)
    receiveAmount = toPrice > 0 ? inputAmount / toPrice : 0;
    estimatedRateText = `1 ${toAsset} = ${toPrice?.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    })}`;
  } else if (activeTab === "sell") {
    // ETH -> USDT (Sell)
    receiveAmount = inputAmount * fromPrice;
    estimatedRateText = `1 ${fromAsset} = ${fromPrice?.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    })}`;
  } else {
    // ETH -> BTC (Swap)
    const totalUsdVal = inputAmount * fromPrice;
    receiveAmount = toPrice > 0 ? totalUsdVal / toPrice : 0;
    const swapRate = toPrice > 0 ? fromPrice / toPrice : 0;
    estimatedRateText = `1 ${fromAsset} ≈ ${swapRate.toFixed(5)} ${toAsset}`;
  }

  const renderTabButton = (tab: TradeType, label: string) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
      onPress={() => {
        setActiveTab(tab);
        form.setFieldValue("amount", "");
      }}
    >
      <BaseText
        style={[
          styles.tabButtonText,
          activeTab === tab && styles.tabButtonTextActive,
        ]}
      >
        {label}
      </BaseText>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer scrollable style={styles.container}>
      <BackHeader
        title={
          activeTab === "buy"
            ? "Buy Bitcoin"
            : activeTab === "sell"
              ? "Sell Bitcoin"
              : "Swap assets"
        }
      />

      <BaseText style={styles.subtitle}>
        {activeTab === "buy"
          ? "Create a quote before confirming with PIN."
          : activeTab === "sell"
            ? "Preview rate and fees before execution."
            : "Convert one supported coin into another."}
      </BaseText>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {renderTabButton("buy", "Buy")}
        {renderTabButton("sell", "Sell")}
        {renderTabButton("swap", "Swap")}
      </View>

      <View style={styles.formContainer}>
        {/* You Pay / From field */}
        <View style={styles.inputCard}>
          <View style={styles.row}>
            <View style={styles.inputCol}>
              <BaseText style={styles.inputLabel}>
                {activeTab === "buy"
                  ? "You pay"
                  : activeTab === "sell"
                    ? "You sell"
                    : "From"}
              </BaseText>
              <form.Field name="amount">
                {(field) => (
                  <BaseInput
                    placeholder="0.00"
                    keyboardType="numeric"
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    style={styles.fieldInput}
                    containerStyle={styles.fieldInputContainer}
                  />
                )}
              </form.Field>
            </View>
            <View style={styles.assetSelector}>
              <BaseText variant="bold" style={styles.assetText}>
                {fromAsset}
              </BaseText>
            </View>
          </View>
        </View>

        {/* Separator / Arrow for Swap */}
        {activeTab === "swap" && (
          <View style={styles.arrowRow}>
            <View style={styles.arrowIcon}>
              <BaseText style={styles.arrowText}>↓</BaseText>
            </View>
          </View>
        )}

        {/* You Receive / To field */}
        <View
          style={[
            styles.inputCard,
            { marginTop: activeTab === "swap" ? 0 : 16 },
          ]}
        >
          <View style={styles.row}>
            <View style={styles.inputCol}>
              <BaseText style={styles.inputLabel}>
                {activeTab === "swap" ? "To" : "You receive"}
              </BaseText>
              <BaseInput
                placeholder="0.00"
                editable={false}
                value={inputAmount > 0 ? receiveAmount.toFixed(5) : "0.00000"}
                style={[styles.fieldInput, { color: Colors.white }]}
                containerStyle={styles.fieldInputContainer}
              />
            </View>
            <View style={styles.assetSelector}>
              <BaseText variant="bold" style={styles.assetText}>
                {toAsset}
              </BaseText>
            </View>
          </View>
        </View>

        {/* Context Details */}
        <View style={styles.detailsCard}>
          <View style={styles.detailsRow}>
            <BaseText style={styles.detailLabel}>Available</BaseText>
            {isBalanceLoading ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <BaseText style={styles.detailValue}>
                {currentAvailable.toFixed(4)} {fromAsset}
              </BaseText>
            )}
          </View>

          <View style={styles.detailsRow}>
            <BaseText style={styles.detailLabel}>Estimated rate</BaseText>
            {isPricesLoading ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <BaseText style={styles.detailValue}>
                {estimatedRateText}
              </BaseText>
            )}
          </View>

          <View style={styles.detailsRow}>
            <BaseText style={styles.detailLabel}>
              {activeTab === "swap" ? "Quote expires" : "Verification limit"}
            </BaseText>
            <BaseText style={[styles.detailValue, { color: Colors.primary }]}>
              {activeTab === "swap" ? "30 seconds" : "$5,000"}
            </BaseText>
          </View>
        </View>
      </View>

      {/* Action Button */}
      <View style={styles.footer}>
        <BaseButton
          title={activeTab === "swap" ? "Preview swap" : "Get quote"}
          isLoading={isQuoteCreating}
          onPress={() => form.handleSubmit()}
          style={[
            styles.submitButton,
            {
              backgroundColor:
                activeTab === "sell" ? Colors.error : Colors.primary,
            },
          ]}
          textStyle={{
            color: activeTab === "sell" ? Colors.white : Colors.secondary,
          }}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondary,
    flex: 1,
    paddingBottom: 100,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
    marginBottom: 20,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#161C22",
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: "#1B232A",
  },
  tabButtonText: {
    color: "#777777",
    fontSize: 14,
    fontFamily: FontFamily.bold,
  },
  tabButtonTextActive: {
    color: Colors.white,
  },
  formContainer: {
    // flex: 1,
  },
  inputCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.04)",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputCol: {
    flex: 1,
  },
  inputLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginBottom: 4,
  },
  fieldInputContainer: {
    backgroundColor: "transparent",
    borderWidth: 0,
    paddingHorizontal: 0,
  },
  fieldInput: {
    fontSize: 24,
    color: Colors.white,
    fontFamily: FontFamily.bold,
  },
  assetSelector: {
    backgroundColor: "#161C22",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    marginLeft: 10,
  },
  assetText: {
    color: Colors.white,
    fontSize: 14,
  },
  arrowRow: {
    alignItems: "center",
    marginVertical: -8,
    zIndex: 10,
  },
  arrowIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#161C22",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  arrowText: {
    color: Colors.white,
    fontSize: 16,
    lineHeight: 18,
  },
  detailsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.04)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 24,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.04)",
  },
  detailLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: 13,
    color: Colors.white,
    fontFamily: FontFamily.bold,
  },
  footer: {
    marginTop: 32,
    marginBottom: 20,
  },
  submitButton: {
    height: 56,
    borderRadius: 16,
  },
});
