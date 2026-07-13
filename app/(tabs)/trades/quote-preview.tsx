import { BackHeader, BaseButton, BaseText, ScreenContainer } from "@/components/ui";
import { Colors, FontFamily } from "@/core/constants";
import { useGetQuoteDetailsQuery } from "@/features/trading/api/tradeApi";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function QuotePreviewScreen() {
  const router = useRouter();
  const { quoteId } = useLocalSearchParams<{ quoteId: string }>();

  // Fetch live quote details
  const {
    data: quote,
    isLoading,
    error,
  } = useGetQuoteDetailsQuery(quoteId, {
    skip: !quoteId,
  });

  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  // Initialize countdown timer
  useEffect(() => {
    if (quote) {
      // Set initial duration from response
      setTimeLeft(quote.expiresInSeconds || 30);
      setIsExpired(quote.isExpired);
    }
  }, [quote]);

  // Tick down timer
  useEffect(() => {
    if (isExpired || timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isExpired]);

  const handleConfirm = () => {
    if (isExpired) return;
    router.push({
      pathname: "/(tabs)/trades/confirm",
      params: { quoteId },
    });
  };

  const handleGetNewQuote = () => {
    router.replace({
      pathname: "/(tabs)/trades/operation",
      params: { type: quote?.type || "buy" },
    });
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <ScreenContainer style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <BaseText style={{ marginTop: 16 }}>Fetching quote details...</BaseText>
      </ScreenContainer>
    );
  }

  if (error || !quote) {
    return (
      <ScreenContainer style={styles.centerContainer}>
        <BaseText style={styles.errorText}>
          Failed to retrieve quote details
        </BaseText>
        <BaseButton
          title="Back to trade"
          onPress={handleGetNewQuote}
          style={{ marginTop: 16 }}
        />
      </ScreenContainer>
    );
  }

  const estimatedReceive = quote.toAmount - quote.feeAmount;

  return (
    <ScreenContainer scrollable={true} style={styles.container}>
      <BackHeader title={isExpired ? "Quote expired" : "Quote preview"} />

      {isExpired ? (
        // EXPIRED STATE UI
        <View style={styles.expiredContainer}>
          <View
            style={{
              alignItems: "center",
              backgroundColor: "#141820",
              paddingVertical: 20,
              borderRadius: 22,
              marginBottom: 40,
            }}
          >
            <View style={styles.exclamationCircle}>
              <BaseText variant="bold" style={styles.exclamationText}>
                !
              </BaseText>
            </View>
            <BaseText variant="bold" style={styles.expiredTitle}>
              This quote is no longer valid
            </BaseText>
            <BaseText style={styles.expiredSubtitle}>
              Get a new quote so the rate, fee, and receive amount are current.
            </BaseText>
          </View>

          <View style={styles.detailsCard}>
            <View style={styles.detailsRow}>
              <BaseText style={styles.detailLabel}>Expired quote</BaseText>
              <BaseText style={styles.detailValue} numberOfLines={1}>
                {quote.id}
              </BaseText>
            </View>
            <View style={styles.detailsRow}>
              <BaseText style={styles.detailLabel}>Previous receive</BaseText>
              <BaseText style={styles.detailValue}>
                {estimatedReceive.toFixed(5)} {quote.toAsset}
              </BaseText>
            </View>
          </View>

          <BaseButton
            title="Get new quote"
            onPress={handleGetNewQuote}
            style={styles.yellowBtn}
            textStyle={{ color: Colors.secondary }}
          />
        </View>
      ) : (
        // ACTIVE STATE UI
        <View style={styles.activeContainer}>
          <BaseText style={styles.activeSubtitle}>
            Confirm the rate before this quote expires.
          </BaseText>

          {/* Countdown timer */}
          <View style={styles.timerCard}>
            <BaseText style={styles.timerLabel}>Expires in</BaseText>
            <BaseText variant="bold" style={styles.timerValue}>
              {formatTimer(timeLeft)}
            </BaseText>
          </View>

          {/* Quote Details */}
          <View style={styles.detailsCard}>
            <View style={styles.detailsRow}>
              <BaseText style={styles.detailLabel}>From</BaseText>
              <BaseText style={styles.detailValue}>
                {quote.fromAmount.toFixed(5)} {quote.fromAsset}
              </BaseText>
            </View>

            <View style={styles.detailsRow}>
              <BaseText style={styles.detailLabel}>To</BaseText>
              <BaseText style={styles.detailValue}>
                {quote.toAmount.toFixed(5)} {quote.toAsset}
              </BaseText>
            </View>

            <View style={styles.detailsRow}>
              <BaseText style={styles.detailLabel}>Rate</BaseText>
              <BaseText style={styles.detailValue}>
                1 {quote.fromAsset} ={" "}
                {quote.rate.toLocaleString("en-US", {
                  maximumFractionDigits: 5,
                })}{" "}
                {quote.toAsset}
              </BaseText>
            </View>

            <View style={styles.detailsRow}>
              <BaseText style={styles.detailLabel}>Fee</BaseText>
              <BaseText style={styles.detailValue}>
                {quote.feeAmount.toFixed(2)} {quote.toAsset}
              </BaseText>
            </View>

            <View style={styles.detailsRow}>
              <BaseText style={styles.detailLabel}>Estimated receive</BaseText>
              <BaseText
                variant="bold"
                style={[styles.detailValue, { color: Colors.primary }]}
              >
                {estimatedReceive.toFixed(5)} {quote.toAsset}
              </BaseText>
            </View>
          </View>

          <BaseButton
            title="Confirm with PIN"
            onPress={handleConfirm}
            style={styles.confirmBtn}
            textStyle={{ color: Colors.secondary }}
          />
        </View>
      )}
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
  errorText: {
    color: Colors.error,
    fontSize: 16,
    fontFamily: FontFamily.bold,
  },
  activeContainer: {
    flex: 1,
  },
  activeSubtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
    marginBottom: 24,
  },
  timerCard: {
    backgroundColor: "#161C22",
    borderRadius: 20,
    paddingVertical: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  timerLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  timerValue: {
    color: Colors.primary,
    fontSize: 24,
  },
  detailsCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.04)",
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 32,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.04)",
  },
  detailLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  detailValue: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: FontFamily.bold,
  },
  confirmBtn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.primary,
  },
  expiredContainer: {
    marginTop: 20,
  },
  exclamationCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: Colors.warning,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  exclamationText: {
    color: Colors.warning,
    fontSize: 40,
  },
  expiredTitle: {
    fontSize: 22,
    color: Colors.white,
    marginBottom: 12,
    textAlign: "center",
  },
  expiredSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 24,
  },
  yellowBtn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.warning,
    width: "100%",
  },
});
