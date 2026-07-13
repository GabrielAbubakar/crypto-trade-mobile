import { BackHeader, BaseButton, BaseText, ScreenContainer } from "@/components/ui";
import { Colors, FontFamily } from "@/core/constants";
import { useExecuteQuoteMutation } from "@/core/store/store";
import { showErrorToast, showSuccessToast } from "@/core/utils";
import { useGetQuoteDetailsQuery } from "@/features/trading/api/tradeApi";
import { useGetWalletBalancesQuery } from "@/features/wallet/api/walletApi";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function ConfirmTradeScreen() {
  const router = useRouter();
  const { quoteId } = useLocalSearchParams<{ quoteId: string }>();

  // API Hooks
  const { data: quote, isLoading: isQuoteLoading } = useGetQuoteDetailsQuery(
    quoteId,
    {
      skip: !quoteId,
    },
  );
  const { data: balanceData } = useGetWalletBalancesQuery();
  const [executeQuote, { isLoading: isExecuting }] = useExecuteQuoteMutation();

  // Pin state
  const [pin, setPin] = useState<string>("");
  const textInputRef = useRef<TextInput>(null);

  // Focus input on load
  useEffect(() => {
    setTimeout(() => {
      textInputRef.current?.focus();
    }, 200);
  }, []);

  const getAvailableBalance = (symbol: string): number => {
    if (!balanceData?.wallet?.balances) return 0.0;
    const normalizedSymbol =
      symbol.toUpperCase() === "USDT" ? "USD" : symbol.toUpperCase();
    const balance = balanceData.wallet.balances.find(
      (b) => b.assetSymbol.toUpperCase() === normalizedSymbol,
    );
    return balance?.available ?? 0.0;
  };

  const handleSubmit = async (enteredPin: string) => {
    if (enteredPin.length < 4 || isExecuting || !quote) {
      showErrorToast("Please enter a valid PIN");
      return;
    }

    try {
      const result = await executeQuote({
        quoteId: quote.id,
        pin: enteredPin,
      }).unwrap();

      showSuccessToast("Trade completed successfully!");

      // Route to success status
      router.replace({
        pathname: "/(tabs)/trades/status",
        params: {
          status: "success",
          type: result.transaction.type,
          reference: result.transaction.reference,
          paid: `${result.transaction.fromAmount} ${result.transaction.fromAsset}`,
          received: `${result.transaction.toAmount} ${result.transaction.toAsset}`,
          fee: `${result.transaction.feeAmount} ${result.transaction.toAsset}`,
        },
      });
    } catch (err: any) {
      const errorMsg =
        err?.data?.error?.message || err?.data?.message || "Trade failed";

      const fromAsset = quote.fromAsset;
      const currentAvail = getAvailableBalance(fromAsset);

      // Route to failure status
      router.replace({
        pathname: "/(tabs)/trades/status",
        params: {
          status: "failed",
          type: quote.type,
          reason: errorMsg,
          required: `${quote.fromAmount.toFixed(2)} ${fromAsset}`,
          available: `${currentAvail.toFixed(2)} ${fromAsset}`,
        },
      });
    }
  };

  const handleTextChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    if (cleaned.length <= 4) {
      setPin(cleaned);
      if (cleaned.length === 4) {
        handleSubmit(cleaned);
      }
    }
  };

  if (isQuoteLoading || !quote) {
    return (
      <ScreenContainer style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <BaseText style={{ marginTop: 16 }}>Loading quote details...</BaseText>
      </ScreenContainer>
    );
  }

  const estimatedReceive = quote.toAmount - quote.feeAmount;

  return (
    <ScreenContainer style={styles.container}>
      <BackHeader title="Confirm trade" />
      <BaseText style={styles.subtitle}>
        Enter your transaction PIN to execute this quote.
      </BaseText>

      {/* Trade details overview card */}
      <View style={styles.summaryCard}>
        <BaseText variant="bold" style={styles.summaryTitle}>
          {quote.type === "buy"
            ? "Buy"
            : quote.type === "sell"
              ? "Sell"
              : "Swap"}{" "}
          {quote.toAsset}
        </BaseText>
        <BaseText style={styles.summaryDetails}>
          {quote.fromAmount.toFixed(2)} {quote.fromAsset} →{" "}
          {estimatedReceive.toFixed(5)} {quote.toAsset}
        </BaseText>
        <BaseText style={styles.summaryFee}>
          Fee: {quote.feeAmount.toFixed(2)} {quote.toAsset}
        </BaseText>
      </View>

      {/* Hidden input for keyboard focus */}
      <TextInput
        ref={textInputRef}
        value={pin}
        onChangeText={handleTextChange}
        keyboardType="numeric"
        maxLength={4}
        secureTextEntry
        style={styles.hiddenInput}
      />

      <BaseText variant="bold">Transaction PIN</BaseText>

      {/* Display dots */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => textInputRef.current?.focus()}
        style={styles.pinContainer}
      >
        {[0, 1, 2, 3].map((index) => {
          const filled = pin.length > index;
          return (
            <View
              key={index}
              style={[styles.pinDot, filled && styles.pinDotFilled]}
            />
          );
        })}
      </TouchableOpacity>

      {/* <BaseText style={styles.apiDisclaimer}>
        The API executes only after POST /trade/execute with quoteId and PIN.
      </BaseText> */}

      <View style={styles.footer}>
        <BaseButton
          title="Execute trade"
          isLoading={isExecuting}
          onPress={() => handleSubmit(pin)}
          style={styles.executeBtn}
          textStyle={{ color: Colors.secondary }}
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
  centerContainer: {
    backgroundColor: Colors.secondary,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    padding: 20,
    marginBottom: 40,
    alignItems: "center",
  },
  summaryTitle: {
    fontSize: 20,
    color: Colors.white,
    marginBottom: 8,
  },
  summaryDetails: {
    fontSize: 16,
    color: Colors.primary,
    marginBottom: 6,
    fontFamily: FontFamily.bold,
  },
  summaryFee: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  hiddenInput: {
    position: "absolute",
    width: 0,
    height: 0,
    opacity: 0,
  },
  pinContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 24,
    marginBottom: 34,
  },
  pinDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    backgroundColor: "transparent",
  },
  pinDotFilled: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  apiDisclaimer: {
    color: Colors.textSecondary,
    fontSize: 12,
    textAlign: "center",
    marginTop: 20,
    lineHeight: 18,
    paddingHorizontal: 30,
  },
  footer: {
    flex: 1,
    marginBottom: 20,
  },
  executeBtn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.primary,
  },
});
