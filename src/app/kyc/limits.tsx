import {
    BackHeader,
    BaseButton,
    BaseText,
    ScreenContainer,
} from "@/shared/ui";
import { Colors, FontFamily } from "@/shared/constants";
import { KycProgressSteps } from "@/features/kyc/components/KycProgressSteps";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function KYCLimits() {
  const router = useRouter();

  return (
    <ScreenContainer scrollable>
      <BackHeader title="Account limits" />

      <BaseText style={styles.headerSubtitle}>
        Your verification level controls trade, withdrawal, and sandbox deposit
        access.
      </BaseText>

      <KycProgressSteps currentStep={0} />

      <View style={styles.content}>
        {/* Starter Tier */}
        <View style={styles.tierCard}>
          <View style={styles.tierBadge}>
            <BaseText style={styles.tierBadgeText}>0</BaseText>
          </View>
          <View style={styles.tierDetails}>
            <BaseText variant="bold" style={styles.tierName}>
              Starter
            </BaseText>
            <BaseText style={styles.tierDescription}>
              Trade locked • Withdraw locked • $100 deposit
            </BaseText>
          </View>
        </View>

        {/* Review Tier */}
        <View style={styles.tierCard}>
          <View
            style={[
              styles.tierBadge,
              { backgroundColor: "rgba(255,255,255,0.1)" },
            ]}
          >
            <BaseText
              style={[styles.tierBadgeText, { color: Colors.textSecondary }]}
            >
              1
            </BaseText>
          </View>
          <View style={styles.tierDetails}>
            <BaseText variant="bold" style={styles.tierName}>
              Review
            </BaseText>
            <BaseText style={styles.tierDescription}>
              Documents submitted • $250 deposit
            </BaseText>
          </View>
        </View>

        {/* Verified Tier */}
        <View style={[styles.tierCard, styles.verifiedTierCard]}>
          <View style={[styles.tierBadge, { backgroundColor: Colors.primary }]}>
            <BaseText
              style={[styles.tierBadgeText, { color: Colors.secondary }]}
            >
              2
            </BaseText>
          </View>
          <View style={styles.tierDetails}>
            <BaseText variant="bold" style={styles.tierName}>
              Verified
            </BaseText>
            <BaseText
              style={[
                styles.tierDescription,
                { color: "rgba(255, 255, 255, 0.7)" },
              ]}
            >
              $5,000 trade • $2,500 withdrawal
            </BaseText>
          </View>
        </View>

        <BaseText style={styles.infoText}>
          Verification is required before executing quotes or requesting
          withdrawals.
        </BaseText>
      </View>

      <BaseButton
        title="Continue"
        onPress={() => router.push("/kyc/details")}
        style={styles.continueButton}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 20,
  },
  content: {
    flex: 1,
    gap: 16,
    marginTop: 8,
  },
  tierCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  verifiedTierCard: {
    backgroundColor: "#083D2B",
  },
  tierBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(94, 213, 168, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  tierBadgeText: {
    color: Colors.primary,
    fontSize: 16,
    fontFamily: FontFamily.bold,
  },
  tierDetails: {
    flex: 1,
  },
  tierName: {
    fontSize: 16,
    color: Colors.white,
    marginBottom: 4,
  },
  tierDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  infoText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 18,
    marginTop: 10,
    paddingHorizontal: 20,
  },
  continueButton: {
    marginVertical: 24,
  },
});
