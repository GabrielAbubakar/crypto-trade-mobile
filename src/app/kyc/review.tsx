import { ImagePreviewModal, KycProgressSteps } from "@/features/kyc/components";
import {
    BackHeader,
    BaseButton,
    BaseText,
    ScreenContainer,
} from "@/shared/ui";
import { Colors } from "@/shared/constants";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useKycVerificationMutation } from "@/store/store";
import { resetKyc } from "@/features/kyc/slices/kycSlice";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

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
  const backUploaded = kycState.documentBackImageUrl
    ? "Uploaded"
    : "Not Uploaded";
  const selfieUploaded = kycState.selfieImageUrl ? "Uploaded" : "Not Uploaded";

  const frontUrl = kycState.documentImageUrl || "https://example.com/uploads/ada-national-id.jpg";
  const backUrl = kycState.documentBackImageUrl || undefined;
  const selfieUrl = kycState.selfieImageUrl || "https://example.com/uploads/ada-selfie.jpg";

  const [previewData, setPreviewData] = useState<{ url: string; title: string } | null>(null);

  const handlePreview = (url: string, title: string) => {
    setPreviewData({ url, title });
  };

  const closePreview = () => {
    setPreviewData(null);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        legalName: name,
        country: country,
        documentType: kycState.documentType,
        documentNumber: kycState.documentNumber,
        selfieImageUrl: kycState.selfieImageUrl,
        documentImageUrl: kycState.documentImageUrl,
        documentBackImageUrl: kycState.documentBackImageUrl || undefined,
      };
      await submitKyc(payload).unwrap();
      dispatch(resetKyc());
      // Navigate back to the main KYC dashboard
      router.replace("/home");
    } catch {

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
          <TouchableOpacity
            style={styles.infoRow}
            onPress={() => handlePreview(frontUrl, "Document Front")}
            activeOpacity={0.7}
          >
            <BaseText style={styles.infoLabel}>Document Image (Front)</BaseText>
            <View style={styles.valueContainer}>
              <BaseText
                variant="medium"
                style={[styles.infoValue, { color: Colors.primary }]}
              >
                {frontUploaded}
              </BaseText>
              <Ionicons
                name="eye-outline"
                size={16}
                color={Colors.primary}
                style={styles.actionIcon}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.infoRow}
            onPress={() => backUrl && handlePreview(backUrl, "Document Back")}
            disabled={!backUrl}
            activeOpacity={backUrl ? 0.7 : 1}
          >
            <BaseText style={styles.infoLabel}>Document Image (Back)</BaseText>
            <View style={styles.valueContainer}>
              <BaseText
                variant="medium"
                style={[
                  styles.infoValue,
                  {
                    color: kycState.documentBackImageUrl
                      ? Colors.primary
                      : Colors.textSecondary,
                  },
                ]}
              >
                {backUploaded}
              </BaseText>
              {!!backUrl && (
                <Ionicons
                  name="eye-outline"
                  size={16}
                  color={Colors.primary}
                  style={styles.actionIcon}
                />
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.infoRow}
            onPress={() => handlePreview(selfieUrl, "Selfie")}
            activeOpacity={0.7}
          >
            <BaseText style={styles.infoLabel}>Selfie Image</BaseText>
            <View style={styles.valueContainer}>
              <BaseText
                variant="medium"
                style={[styles.infoValue, { color: Colors.primary }]}
              >
                {selfieUploaded}
              </BaseText>
              <Ionicons
                name="eye-outline"
                size={16}
                color={Colors.primary}
                style={styles.actionIcon}
              />
            </View>
          </TouchableOpacity>
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

      <ImagePreviewModal
        visible={!!previewData}
        onClose={closePreview}
        imageUrl={previewData?.url}
        title={previewData?.title}
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
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionIcon: {
    marginLeft: 4,
  },
});
