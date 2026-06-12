import { KycProgressSteps } from "@/components/kyc/KycProgressSteps";
import {
  BackHeader,
  BaseButton,
  BaseText,
  ScreenContainer,
} from "@/components/ui";
import { Colors, FontFamily } from "@/constants";
import { useGetProfileQuery } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

type KYCStatus = "starter" | "pending" | "approved" | "rejected";

export default function KYCIndex() {
  const router = useRouter();
  const { data: profileData, isLoading } = useGetProfileQuery();
  const [status, setStatus] = useState<KYCStatus>("starter");

  // React.useEffect(() => {
  //   if (profileData?.verification.tier) {
  //     setStatus(profileData.verification.tier as KYCStatus);
  //   }
  // }, [profileData]);

  // console.log(profileData?.verification);

  const renderContent = () => {
    switch (status) {
      case "starter":
        return (
          <View style={styles.contentCard}>
            <View style={styles.badgeContainer}>
              <BaseText style={styles.badgeText}>
                Level {profileData?.verification.level}
              </BaseText>
            </View>
            <BaseText variant="bold" style={styles.mainTitle}>
              {profileData?.verification.label} account
            </BaseText>
            <BaseText style={styles.subtitle}>
              Browse markets now. Verify to trade, withdraw, and raise sandbox
              deposit limits.
            </BaseText>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <BaseText style={styles.infoLabel}>Trade limit</BaseText>
              <BaseText style={styles.lockedValue}>
                {profileData?.verification.limits.tradePerTransactionUsd}
              </BaseText>
            </View>
            <View style={styles.infoRow}>
              <BaseText style={styles.infoLabel}>Withdrawal limit</BaseText>
              <BaseText style={styles.lockedValue}>
                {profileData?.verification.limits.withdrawalPerTransactionUsd}
              </BaseText>
            </View>
            <View style={styles.infoRow}>
              <BaseText style={styles.infoLabel}>Sandbox deposit</BaseText>
              <BaseText style={styles.infoValue}>
                {profileData?.verification.limits.depositPerTransactionUsd.toLocaleString(
                  "en-US",
                  {
                    style: "currency",
                    currency: "USD",
                  },
                )}
              </BaseText>
            </View>

            <BaseButton
              title="Start verification"
              onPress={() => router.push("/kyc/limits")}
              style={styles.actionButton}
            />

            <BaseText style={styles.bottomText}>
              You can continue browsing markets without verification.
            </BaseText>
          </View>
        );

      case "pending":
        return (
          <View style={styles.contentCard}>
            <View
              style={[styles.statusIconContainer, { borderColor: "#D4AF37" }]}
            >
              <Ionicons name="ellipsis-horizontal" size={40} color="#D4AF37" />
            </View>

            <BaseText variant="bold" style={styles.mainTitle}>
              {profileData?.verification.label}
            </BaseText>
            <BaseText style={styles.subtitle}>
              You can browse markets while we review your documents. Trading and
              withdrawals stay locked.
            </BaseText>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <BaseText style={styles.infoLabel}>Current level</BaseText>
              <BaseText style={styles.infoValue}>
                {profileData?.verification.level}
              </BaseText>
            </View>
            <View style={styles.infoRow}>
              <BaseText style={styles.infoLabel}>Sandbox deposit</BaseText>
              <BaseText style={styles.infoValue}>$250 max</BaseText>
            </View>

            <BaseButton
              title="Back to home"
              variant="primary"
              onPress={() => router.replace("/(tabs)/home")}
              style={styles.actionButton}
            />
          </View>
        );

      case "approved":
        return (
          <View style={styles.contentCard}>
            <View
              style={[
                styles.statusIconContainer,
                { borderColor: Colors.primary },
              ]}
            >
              <Ionicons name="checkmark" size={40} color={Colors.primary} />
            </View>

            <BaseText variant="bold" style={styles.mainTitle}>
              Level 2 unlocked
            </BaseText>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <BaseText style={styles.infoLabel}>Trade per quote</BaseText>
              <BaseText style={styles.infoValue}>$5,000</BaseText>
            </View>
            <View style={styles.infoRow}>
              <BaseText style={styles.infoLabel}>Withdrawal request</BaseText>
              <BaseText style={styles.infoValue}>$2,500</BaseText>
            </View>
            <View style={styles.infoRow}>
              <BaseText style={styles.infoLabel}>Daily withdrawal</BaseText>
              <BaseText style={styles.infoValue}>$10,000</BaseText>
            </View>

            <BaseButton
              title="Start trading"
              onPress={() => router.replace("/(tabs)/home")}
              style={styles.actionButton}
            />
          </View>
        );

      case "rejected":
        return (
          <View style={styles.contentCard}>
            <View
              style={[
                styles.statusIconContainer,
                { borderColor: Colors.error },
              ]}
            >
              <Ionicons name="close" size={40} color={Colors.error} />
            </View>

            <BaseText variant="bold" style={styles.mainTitle}>
              Try again
            </BaseText>

            <View style={styles.reasonCard}>
              <BaseText style={styles.reasonTitle}>Reason</BaseText>
              <BaseText style={styles.reasonText}>
                Document photo was blurry. Upload a clearer image with all
                corners visible.
              </BaseText>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <BaseText style={styles.infoLabel}>Current level</BaseText>
              <BaseText style={styles.infoValue}>Starter</BaseText>
            </View>

            <BaseButton
              title="Resubmit documents"
              variant="cancel"
              onPress={() => router.push("/kyc/limits")}
              style={styles.actionButton}
            />
          </View>
        );
    }
  };

  const getHeaderTitle = (): string => {
    switch (status) {
      case "starter":
        return "Verify to unlock limits";
      case "pending":
        return "Review in progress";
      case "approved":
        return "Verification approved";
      case "rejected":
        return "Review needs attention";
      default:
        return "Verify identity";
    }
  };

  // useEffect(() => {
  //   if (profileData?.verification.status) {
  //     setStatus(profileData.verification.status as KYCStatus);
  //   }
  // }, [profileData]);

  if (isLoading) {
    return (
      <ScreenContainer
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable style={styles.container}>
      <BackHeader title={getHeaderTitle()} />

      <BaseText style={styles.headerSubtitle}>
        Complete identity verification from inside the app before high-value
        trading or withdrawals.
      </BaseText>

      {/* Progress Indicator */}
      <KycProgressSteps currentStep={status === "starter" ? 0 : 3} />

      {/* Dynamic Content */}
      <View style={styles.content}>{renderContent()}</View>

      {/* Developer helper panel */}
      {/* <View style={styles.devPanel}>
        <BaseText style={styles.devTitle}>DEV STATUS PREVIEW:</BaseText>
        <View style={styles.devButtons}>
          {(["starter", "pending", "approved", "rejected"] as KYCStatus[]).map(
            (state) => (
              <TouchableOpacity
                key={state}
                style={[
                  styles.devButton,
                  status === state && styles.devButtonActive,
                ]}
                onPress={() => setStatus(state)}
              >
                <BaseText
                  style={[
                    styles.devButtonText,
                    {
                      color: status === state ? Colors.secondary : Colors.white,
                    },
                  ]}
                >
                  {state.charAt(0).toUpperCase() + state.slice(1)}
                </BaseText>
              </TouchableOpacity>
            ),
          )}
        </View>
      </View> */}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 20,
  },
  content: {
    flex: 1,
    marginTop: 10,
  },
  contentCard: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
  },
  badgeContainer: {
    backgroundColor: "rgba(94, 213, 168, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    color: Colors.primary,
    fontSize: 12,
    fontFamily: FontFamily.bold,
  },
  mainTitle: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    marginVertical: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 14,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: FontFamily.bold,
  },
  lockedValue: {
    fontSize: 14,
    fontFamily: FontFamily.bold,
    color: Colors.error,
  },
  actionButton: {
    width: "100%",
    marginTop: 24,
  },
  statusIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  reasonCard: {
    backgroundColor: "rgba(255, 77, 77, 0.08)",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 77, 77, 0.2)",
    width: "100%",
    marginTop: 10,
  },
  reasonTitle: {
    fontSize: 14,
    color: Colors.error,
    fontFamily: FontFamily.bold,
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  devPanel: {
    marginTop: 40,
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  devTitle: {
    fontSize: 11,
    fontFamily: FontFamily.bold,
    color: Colors.primary,
    marginBottom: 10,
    textAlign: "center",
  },
  devButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  devButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  devButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  devButtonText: {
    fontSize: 11,
    fontFamily: FontFamily.medium,
  },

  bottomText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 20,
  },
});
