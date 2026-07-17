import { Colors, FontFamily } from "@/shared/constants";

import { BackHeader, BaseButton, BaseInput, BaseText, ScreenContainer, SelectOptionsSheet } from "@/shared/ui";
import { useCreateQuoteMutation, useGetMarketAssetsQuery, useGetMarketPricesQuery } from "@/store/store";
import { showErrorToast } from "@/shared/utils";
import { TradeDetailsCard, TradeInputCard, TradeTabs } from "@/features/trading/components";
import { useGetWalletBalancesQuery } from "@/features/wallet/api/walletApi";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useForm, useStore } from "@tanstack/react-form";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

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
  const { data: marketAssetsResponse } = useGetMarketAssetsQuery({});

  // console.log(balanceData)

  const [createQuote, { isLoading: isQuoteCreating }] =
    useCreateQuoteMutation();

  // Selected Assets state
  const [fromAsset, setFromAsset] = useState("USDT");
  const [toAsset, setToAsset] = useState("BTC");

  // Bottom Sheet Refs
  const toSheetRef = useRef<BottomSheetModal>(null);
  const fromSheetRef = useRef<BottomSheetModal>(null);

  // Map market assets to options (Buy flow: excluding USDT)
  const coinOptions = useMemo(() => {
    if (!marketAssetsResponse?.data) return [];
    return marketAssetsResponse.data
      .filter((asset) => asset.symbol.toUpperCase() !== "USDT")
      .map((asset) => ({
        value: asset.symbol,
        label: asset.name,
      }));
  }, [marketAssetsResponse]);

  // Map user balances to options for selling (excluding stablecoins)
  const sellCoinOptions = useMemo(() => {
    if (!balanceData?.wallet?.balances) return [];
    return balanceData.wallet.balances
      .filter(
        (b) =>
          b.assetSymbol.toUpperCase() !== "USDT" &&
          b.assetSymbol.toUpperCase() !== "USD",
      )
      .map((b) => {
        const asset = marketAssetsResponse?.data?.find(
          (a) => a.symbol.toUpperCase() === b.assetSymbol.toUpperCase(),
        );
        return {
          value: b.assetSymbol,
          label: asset?.name || b.assetSymbol,
        };
      });
  }, [balanceData, marketAssetsResponse]);

  // Map user balances to options for swapping (including stablecoins)
  const swapFromOptions = useMemo(() => {
    if (!balanceData?.wallet?.balances) return [];
    return balanceData.wallet.balances.map((b) => {
      const asset = marketAssetsResponse?.data?.find(
        (a) => a.symbol.toUpperCase() === b.assetSymbol.toUpperCase(),
      );
      return {
        value: b.assetSymbol,
        label: asset?.name || b.assetSymbol,
      };
    });
  }, [balanceData, marketAssetsResponse]);

  // Map all market assets to options for swapping
  const swapToOptions = useMemo(() => {
    if (!marketAssetsResponse?.data) return [];
    return marketAssetsResponse.data.map((asset) => ({
      value: asset.symbol,
      label: asset.name,
    }));
  }, [marketAssetsResponse]);

  // Dynamically select options for the "From" input sheet
  const fromOptions = useMemo(() => {
    if (activeTab === "sell") {
      return sellCoinOptions;
    }
    if (activeTab === "swap") {
      return swapFromOptions;
    }
    return [];
  }, [activeTab, sellCoinOptions, swapFromOptions]);

  // Dynamically select options for the "To" input sheet
  const toOptions = useMemo(() => {
    if (activeTab === "buy") {
      return coinOptions;
    }
    if (activeTab === "swap") {
      return swapToOptions;
    }
    return [];
  }, [activeTab, coinOptions, swapToOptions]);

  // Find asset name helper
  const getAssetName = (symbol: string): string => {
    if (!marketAssetsResponse?.data) {
      if (symbol === "BTC") return "Bitcoin";
      if (symbol === "ETH") return "Ethereum";
      if (symbol === "SOL") return "Solana";
      return symbol;
    }
    const found = marketAssetsResponse.data.find(
      (a) => a.symbol.toUpperCase() === symbol.toUpperCase(),
    );
    return found ? found.name : symbol;
  };

  // Adjust defaults when tab switches
  useEffect(() => {
    if (activeTab === "buy") {
      setFromAsset("USDT");
      setToAsset("BTC");
    } else if (activeTab === "sell") {
      const firstAsset = balanceData?.wallet?.balances?.find(
        (b) =>
          b.assetSymbol.toUpperCase() !== "USDT" &&
          b.assetSymbol.toUpperCase() !== "USD",
      );
      setFromAsset(firstAsset?.assetSymbol || "BTC");
      setToAsset("USDT");
    } else {
      const firstAsset = balanceData?.wallet?.balances?.[0];
      const defaultFrom = firstAsset?.assetSymbol || "USDT";
      setFromAsset(defaultFrom);
      setToAsset(defaultFrom.toUpperCase() === "BTC" ? "ETH" : "BTC");
    }
  }, [activeTab, balanceData]);

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
    const priceVal = found.priceUsd ?? found.price;
    if (priceVal === undefined || priceVal === null) return 1.0;
    return typeof priceVal === "string"
      ? parseFloat(priceVal)
      : priceVal;
  };

  // Find user's available balance helper
  const getAvailableBalance = (symbol: string): number => {
    if (!balanceData?.wallet?.balances) return 0.0;
    const searchSymbol = symbol.toUpperCase();
    let balance = balanceData.wallet.balances.find(
      (b) => b.assetSymbol.toUpperCase() === searchSymbol,
    );
    if (!balance && searchSymbol === "USDT") {
      balance = balanceData.wallet.balances.find(
        (b) => b.assetSymbol.toUpperCase() === "USD",
      );
    }
    if (!balance && searchSymbol === "USD") {
      balance = balanceData.wallet.balances.find(
        (b) => b.assetSymbol.toUpperCase() === "USDT",
      );
    }
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
            "Failed to create quote.",
        );
      }
    },
  });

  // Calculate live conversion estimate
  const formValues = useStore(form.baseStore, (state: any) => state.values);
  const amountStr = formValues.amount;
  const inputAmount = parseFloat(amountStr) || 0;

  const fromPrice = getAssetPrice(fromAsset);
  const toPrice = getAssetPrice(toAsset);

  let receiveAmount = 0;
  let estimatedRateText = "";

  if (activeTab === "buy") {
    // USDT -> BTC (Buy)
    receiveAmount = toPrice > 0 ? inputAmount / toPrice : 0;
    estimatedRateText = `1 ${toAsset} = ${toPrice?.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    })} USDT`;
  } else if (activeTab === "sell") {
    // ETH -> USDT (Sell)
    receiveAmount = inputAmount * fromPrice;
    estimatedRateText = `1 ${fromAsset} = ${fromPrice?.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    })} USDT`;
  } else {
    // ETH -> BTC (Swap)
    const totalUsdVal = inputAmount * fromPrice;
    receiveAmount = toPrice > 0 ? totalUsdVal / toPrice : 0;
    const swapRate = toPrice > 0 ? fromPrice / toPrice : 0;
    estimatedRateText = `1 ${fromAsset} ≈ ${swapRate.toFixed(5)} ${toAsset}`;
  }


  return (
    <ScreenContainer scrollable style={styles.container}>
      <BackHeader
        title={
          activeTab === "buy"
            ? `Buy ${getAssetName(toAsset)}`
            : activeTab === "sell"
              ? `Sell ${getAssetName(fromAsset)}`
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
      <TradeTabs
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          form.setFieldValue("amount", "");
        }}
      />

      <View>
        {/* You Pay / From field */}
        <TradeInputCard
          label={
            activeTab === "buy"
              ? "You pay"
              : activeTab === "sell"
                ? "You sell"
                : "From"
          }
          assetSymbol={fromAsset}
          isAssetClickable={activeTab === "sell" || activeTab === "swap"}
          onAssetPress={() => fromSheetRef.current?.present()}
          input={
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
          }
        />

        {/* Separator / Arrow for Swap */}
        {activeTab === "swap" && (
          <View style={styles.arrowRow}>
            <View style={styles.arrowIcon}>
              <BaseText style={styles.arrowText}>↓</BaseText>
            </View>
          </View>
        )}

        {/* You Receive / To field */}
        <TradeInputCard
          label={activeTab === "swap" ? "To" : "You receive"}
          assetSymbol={toAsset}
          isAssetClickable={activeTab === "buy" || activeTab === "swap"}
          onAssetPress={() => toSheetRef.current?.present()}
          input={
            <BaseInput
              placeholder="0.00"
              editable={false}
              value={inputAmount > 0 ? receiveAmount.toFixed(5) : "0.00000"}
              style={[styles.fieldInput, { color: Colors.white }]}
              containerStyle={styles.fieldInputContainer}
            />
          }
          containerStyle={{ marginTop: activeTab === "swap" ? 0 : 16 }}
        />

        {/* Context Details */}
        <TradeDetailsCard
          isBalanceLoading={isBalanceLoading}
          isPricesLoading={isPricesLoading}
          currentAvailable={currentAvailable}
          fromAsset={fromAsset}
          estimatedRateText={estimatedRateText}
          activeTab={activeTab}
        />
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

      {/* To Sheet */}
      <SelectOptionsSheet
        ref={toSheetRef}
        title="Select Coin"
        options={toOptions}
        selectedValue={toAsset}
        onSelect={(value) => {
          setToAsset(value);
          toSheetRef.current?.dismiss();
        }}
      />

      {/* From Sheet */}
      <SelectOptionsSheet
        ref={fromSheetRef}
        title="Select Asset"
        options={fromOptions}
        selectedValue={fromAsset}
        onSelect={(value) => {
          setFromAsset(value);
          fromSheetRef.current?.dismiss();
        }}
      />
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
  footer: {
    marginTop: 32,
    marginBottom: 20,
  },
  submitButton: {
    height: 56,
    borderRadius: 16,
  },
});
