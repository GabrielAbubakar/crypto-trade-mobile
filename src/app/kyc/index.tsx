import {
    KycApproved,
    KycNotStarted,
    KycPending,
    KycProgressSteps,
    KycRejected,
} from "@/features/kyc/components";
import { BackHeader, BaseText, ScreenContainer } from "@/shared/ui";
import { Colors } from "@/shared/constants";
import { useGetProfileQuery } from "@/features/profile/api/profileApi";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

type KYCStatus = "not_started" | "pending" | "approved" | "rejected";

export default function KYCIndex() {
  const router = useRouter();
  const { data: profileData, isLoading } = useGetProfileQuery();
  const [status, setStatus] = useState<KYCStatus>("not_started");

  const renderContent = () => {
    switch (status) {
      case "not_started":
        return (
          <KycNotStarted
            verification={profileData?.verification}
            onStartVerification={() => router.push("/kyc/limits")}
          />
        );

      case "pending":
        return (
          <KycPending
            verification={profileData?.verification}
            onBackToHome={() => router.replace("/(tabs)/home")}
          />
        );

      case "approved":
        return (
          <KycApproved
            verification={profileData?.verification}
            onStartTrading={() => router.replace("/(tabs)/trades")}
          />
        );

      case "rejected":
        return (
          <KycRejected
            verification={profileData?.verification}
            onResubmit={() => router.push("/kyc/limits")}
          />
        );
    }
  };

  const getHeaderTitle = (): string => {
    switch (status) {
      case "not_started":
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

  useEffect(() => {
    if (profileData?.verification.status) {
      setStatus(profileData.verification.status as KYCStatus);
    }
  }, [profileData]);

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
      <KycProgressSteps currentStep={status === "not_started" ? 0 : 3} />

      {/* Dynamic Content */}
      <View style={styles.content}>{renderContent()}</View>
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
});
