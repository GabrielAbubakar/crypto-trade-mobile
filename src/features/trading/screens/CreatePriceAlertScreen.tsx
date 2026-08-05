import { BaseText, ScreenContainer } from "@/shared/ui";
import { Colors } from "@/shared/constants";
import { useCreatePriceAlertMutation } from "@/features/profile";
import { showErrorToast } from "@/shared/utils";
import { useGetAssetDetailsQuery } from "@/features/trading/api/marketApi";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SvgUri } from "react-native-svg";

export default function CreatePriceAlertScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: coin, isLoading } = useGetAssetDetailsQuery(id, {
    skip: !id,
  });

  const [createAlert, { isLoading: isCreating }] =
    useCreatePriceAlertMutation();

  const [direction, setDirection] = useState<"above" | "below">("above");
  const [targetPrice, setTargetPrice] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCreate = async () => {
    if (!coin) {
      showErrorToast("Invalid coin");
      return;
    }
    if (!targetPrice) {
      showErrorToast("Please enter a target price");
      return;
    }

    const numericTarget = parseFloat(targetPrice.replace(/,/g, ""));
    if (isNaN(numericTarget)) {
      showErrorToast("Invalid target price");
      return;
    }

    try {
      await createAlert({
        assetSymbol: coin.symbol,
        direction,
        targetPriceUsd: numericTarget,
      }).unwrap();
      setIsSuccess(true);
    } catch (e) {}
  };

  const handlePriceChange = (text: string) => {
    // Strip everything except numbers and decimal points
    const cleaned = text.replace(/[^0-9.]/g, "");
    setTargetPrice(cleaned);
  };

  const formatPriceDisplay = (val: string) => {
    if (!val) return "";
    const parts = val.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  const resolvedUrl = coin?.iconUrl?.startsWith("http")
    ? coin?.iconUrl
    : process.env.EXPO_PUBLIC_API_URL
      ? `${process.env.EXPO_PUBLIC_API_URL}${coin?.iconUrl}`
      : coin?.iconUrl;

  if (isLoading || !coin) {
    return (
      <ScreenContainer style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </ScreenContainer>
    );
  }

  // --- SUCCESS VIEW ---
  if (isSuccess) {
    const formattedTarget = `$${formatPriceDisplay(targetPrice)}`;
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <BaseText size="3xl" variant="bold" style={styles.headerTitle}>
              Alert created
            </BaseText>
            <BaseText style={styles.headerSubtitle}>
              We will notify you when the target is reached.
            </BaseText>
          </View>

          <View style={styles.successIconContainer}>
            <View style={styles.successIconOuter}>
              <View style={styles.successIconInner}>
                <Ionicons name="checkmark" size={40} color={Colors.secondary} />
              </View>
            </View>
            <BaseText
              size="2xl"
              variant="bold"
              style={styles.successTargetTitle}
            >
              {coin.symbol} {direction} {formattedTarget}
            </BaseText>
            <BaseText style={styles.successTargetDesc}>
              This alert appears in Profile → Price Alerts and can be edited or
              deleted.
            </BaseText>
          </View>

          <View style={styles.detailsList}>
            <View style={styles.detailRow}>
              <BaseText style={styles.detailLabel}>Asset</BaseText>
              <BaseText variant="bold" style={styles.detailValue}>
                {coin.symbol}
              </BaseText>
            </View>
            <View style={styles.detailRow}>
              <BaseText style={styles.detailLabel}>Direction</BaseText>
              <BaseText variant="bold" style={styles.detailValue}>
                {direction}
              </BaseText>
            </View>
            <View style={styles.detailRow}>
              <BaseText style={styles.detailLabel}>Target</BaseText>
              <BaseText variant="bold" style={styles.detailValue}>
                {formattedTarget}
              </BaseText>
            </View>
          </View>
        </View>

        <View style={styles.ctaContainer}>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => router.replace("/profile/price-alerts")}
          >
            <BaseText variant="bold" style={styles.ctaBtnText}>
              View alerts
            </BaseText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // --- CREATE VIEW ---
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <BaseText size="3xl" variant="bold" style={styles.headerTitle}>
            Create price alert
          </BaseText>
          <BaseText style={styles.headerSubtitle}>
            Get notified when {coin.symbol} crosses your target.
          </BaseText>
        </View>

        {/* Asset Card */}
        <View style={styles.assetCard}>
          <View style={styles.assetCardLeft}>
            {coin.iconUrl && (
              <SvgUri width={40} height={40} uri={resolvedUrl ?? ""} />
            )}
            <View style={styles.assetCardInfo}>
              <BaseText size="lg" variant="bold" style={styles.assetSymbol}>
                {coin.symbol}
              </BaseText>
              <BaseText style={styles.assetName}>{coin.name}</BaseText>
            </View>
          </View>
          <BaseText size="lg" variant="bold" style={styles.assetPrice}>
            {coin.priceUsd.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </BaseText>
        </View>

        {/* Direction Toggle */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              direction === "above" && styles.toggleBtnActive,
            ]}
            onPress={() => setDirection("above")}
          >
            <BaseText
              variant="bold"
              size="sm"
              style={
                direction === "above"
                  ? styles.toggleTextActive
                  : styles.toggleText
              }
            >
              Above
            </BaseText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              direction === "below" && styles.toggleBtnActive,
            ]}
            onPress={() => setDirection("below")}
          >
            <BaseText
              variant="bold"
              size="sm"
              style={
                direction === "below"
                  ? styles.toggleTextActive
                  : styles.toggleText
              }
            >
              Below
            </BaseText>
          </TouchableOpacity>
        </View>

        {/* Input Card */}
        <View style={styles.inputCard}>
          <BaseText style={styles.inputLabel}>Target price</BaseText>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              keyboardType="decimal-pad"
              value={formatPriceDisplay(targetPrice)}
              onChangeText={handlePriceChange}
              placeholder="0.00"
              placeholderTextColor="#3C4858"
            />
            <BaseText variant="bold" style={styles.inputCurrency}>
              USD
            </BaseText>
          </View>
        </View>

        {/* Summary Rows */}
        <View style={styles.summaryList}>
          <View style={styles.summaryRow}>
            <BaseText style={styles.summaryLabel}>Trigger</BaseText>
            <BaseText variant="bold" style={styles.summaryValue}>
              {coin.symbol} {direction}{" "}
              {targetPrice ? `$${formatPriceDisplay(targetPrice)}` : "--"}
            </BaseText>
          </View>
          <View style={styles.summaryRow}>
            <BaseText style={styles.summaryLabel}>Status</BaseText>
            <BaseText
              variant="bold"
              style={[styles.summaryValue, { color: Colors.primary }]}
            >
              Active after creation
            </BaseText>
          </View>
        </View>
      </View>

      <View style={styles.ctaContainer}>
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={handleCreate}
          disabled={isCreating}
        >
          {isCreating ? (
            <ActivityIndicator color={Colors.secondary} />
          ) : (
            <BaseText variant="bold" style={styles.ctaBtnText}>
              Create alert
            </BaseText>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    // flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
  },
  headerTitle: {
    color: Colors.white,
    marginBottom: 8,
  },
  headerSubtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  assetCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.cardBgAlt,
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
  },
  assetCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  assetCardInfo: {
    justifyContent: "center",
  },
  assetSymbol: {
    color: Colors.white,
  },
  assetName: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  assetPrice: {
    color: Colors.white,
  },
  toggleRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  toggleBtn: {
    backgroundColor: Colors.cardBgAlt,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  toggleBtnActive: {
    backgroundColor: Colors.primary,
  },
  toggleText: {
    color: Colors.textSecondary,
  },
  toggleTextActive: {
    color: Colors.secondary,
  },
  inputCard: {
    backgroundColor: Colors.cardBgAlt,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  inputLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textInput: {
    flex: 1,
    color: Colors.white,
    fontSize: 32,
    fontWeight: "bold",
    padding: 0,
  },
  inputCurrency: {
    color: Colors.textSecondary,
    fontSize: 16,
    marginLeft: 12,
  },
  summaryList: {
    gap: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.cardBgAlt,
    borderRadius: 12,
    padding: 16,
  },
  summaryLabel: {
    color: Colors.textSecondary,
  },
  summaryValue: {
    color: Colors.white,
  },
  ctaContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  ctaBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
  },
  ctaBtnText: {
    color: Colors.secondary,
    fontSize: 16,
  },
  successIconContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  successIconOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(92, 214, 165, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  successIconInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  successTargetTitle: {
    color: Colors.white,
    marginBottom: 12,
  },
  successTargetDesc: {
    color: Colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  detailsList: {
    backgroundColor: Colors.cardBgAlt,
    borderRadius: 16,
    padding: 16,
    gap: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    color: Colors.textSecondary,
  },
  detailValue: {
    color: Colors.white,
    textTransform: "capitalize",
  },
});
