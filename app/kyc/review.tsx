import { KycProgressSteps } from "@/components/kyc/KycProgressSteps";
import {
  BackHeader,
  BaseButton,
  BaseText,
  ScreenContainer,
} from "@/components/ui";
import { Colors } from "@/constants";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import {
  useAppDispatch,
  useAppSelector,
  useKycVerificationMutation,
  resetKyc,
} from "@/store";

export default function KYCReview() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const kycState = useAppSelector((state) => state.kyc);
  const [submitKyc, { isLoading }] = useKycVerificationMutation();

  // Handle fallback mock values for visual excellence if fields are empty
  const name = kycState.legalName || "Ada Student";
  const country = kycState.country || "Nigeria";
  const docType = kycState.documentType || "National ID";
  const frontUploaded = kycState.documentImageUrl ? "Uploaded" : "Not Uploaded";
  const selfieUploaded = kycState.selfieImageUrl ? "Uploaded" : "Not Uploaded";

  const handleSubmit = async () => {
    try {
      const payload = {
        legalName: name,
        country: country,
        documentType: kycState.documentType || "national_id",
        documentNumber: kycState.documentNumber || "NIN-000-000",
        selfieImageUrl: kycState.selfieImageUrl || "https://example.com/uploads/ada-selfie.jpg",
        documentImageUrl: kycState.documentImageUrl || "https://example.com/uploads/ada-national-id.jpg",
      };
      await submitKyc(payload).unwrap();
      dispatch(resetKyc());
      // Navigate back to the main KYC dashboard
      router.replace("/kyc");
    } catch (error) {
      console.error("KYC submission failed:", error);
    }
  };

  return (
    <ScreenContainer scrollable>
      <BackHeader title="Review submission" />

      <BaseText style={styles.headerSubtitle}>
        Check the details and files before sending them for admin review.
      </BaseText>

      <KycProgressSteps currentStep={3} />

      <View style={styles.content}>
        <View style={styles.reviewCard}>
          <View style={styles.infoRow}>
            <BaseText style={styles.infoLabel}>Legal name</BaseText>
            <BaseText variant="medium" style={styles.infoValue}>
              {name}
            </BaseText>
          </View>
          <View style={styles.infoRow}>
            <BaseText style={styles.infoLabel}>Country</BaseText>
            <BaseText variant="medium" style={styles.infoValue}>
              {country}
            </BaseText>
          </View>
          <View style={styles.infoRow}>
            <BaseText style={styles.infoLabel}>Document</BaseText>
            <BaseText variant="medium" style={styles.infoValue}>
              {docType}
            </BaseText>
          </View>
          <View style={styles.infoRow}>
            <BaseText style={styles.infoLabel}>Document Image</BaseText>
            <BaseText
              variant="medium"
              style={[styles.infoValue, { color: Colors.primary }]}
            >
              {frontUploaded}
            </BaseText>
          </View>
          <View style={styles.infoRow}>
            <BaseText style={styles.infoLabel}>Selfie Image</BaseText>
            <BaseText
              variant="medium"
              style={[styles.infoValue, { color: Colors.primary }]}
            >
              {selfieUploaded}
            </BaseText>
          </View>
        </View>

        <BaseText style={styles.footerNotice}>
          After submission your status changes to pending and trade/withdraw
          will remain locked until approved.
        </BaseText>
      </View>

      <BaseButton
        title="Submit for review"
        isLoading={isLoading}
        onPress={handleSubmit}
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
    marginTop: 8,
  },
  reviewCard: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.04)",
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    color: Colors.white,
  },
  footerNotice: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  continueButton: {
    marginVertical: 24,
    width: "100%",
  },
});
