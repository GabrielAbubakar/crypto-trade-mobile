import { KycProgressSteps } from "@/components/kyc/KycProgressSteps";
import {
  BackHeader,
  BaseButton,
  BaseText,
  ScreenContainer,
} from "@/components/ui";
import { Colors, FontFamily } from "@/constants";
import {
  setSelfieImageUrl,
  useAppDispatch,
  useAppSelector,
  useKycUploadMutation,
} from "@/store";
import { showErrorToast, showSuccessToast } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function KYCSelfie() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const kycState = useAppSelector((state) => state.kyc);

  const [kycUpload, { isLoading: isUploadingApi }] = useKycUploadMutation();
  const [isUploading, setIsUploading] = useState(false);

  const handleCapture = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const file = result.assets[0];
      const fileName = file.name;
      const contentType = file.mimeType || "image/jpeg";

      setIsUploading(true);

      // 1. Fetch pre-signed upload URL instructions
      const uploadInstructions = await kycUpload({
        fileName,
        contentType,
        documentKind: "selfie",
      }).unwrap();

      const { uploadUrl, imageUrl } = uploadInstructions;

      // 2. Fetch local file blob and PUT upload
      const response = await fetch(file.uri);
      const blob = await response.blob();

      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: blob,
        headers: {
          "Content-Type": contentType,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload selfie file to S3");
      }

      // 3. Update Redux store state
      dispatch(setSelfieImageUrl(imageUrl));
      showSuccessToast("Selfie image uploaded successfully!");
    } catch (err: any) {
      console.error(err);
      showErrorToast(err?.message || "An error occurred during selfie upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleContinue = () => {
    router.push("/kyc/review");
  };

  return (
    <ScreenContainer scrollable>
      <BackHeader title="Selfie check" />

      <BaseText style={styles.headerSubtitle}>
        Upload a clear selfie so compliance can compare your face with your
        document.
      </BaseText>

      <KycProgressSteps currentStep={2} />

      <View style={styles.content}>
        {/* Circular camera match area */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.cameraCircle,
            (kycState.selfieImageUrl || isUploading) &&
              styles.cameraCircleCaptured,
          ]}
          onPress={handleCapture}
          disabled={isUploading}
        >
          {isUploading ? (
            <View style={styles.capturedContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <BaseText
                variant="bold"
                style={[styles.capturedText, { marginTop: 16 }]}
              >
                Uploading selfie...
              </BaseText>
            </View>
          ) : kycState.selfieImageUrl ? (
            <View style={styles.capturedContainer}>
              <Ionicons
                name="checkmark-circle"
                size={48}
                color={Colors.primary}
              />
              <BaseText variant="bold" style={styles.capturedText}>
                Selfie uploaded!
              </BaseText>
              <BaseText style={styles.tapToRetake}>Tap to re-upload</BaseText>
            </View>
          ) : (
            <View style={styles.cameraPlaceholder}>
              <Ionicons
                name="camera-outline"
                size={40}
                color={Colors.primary}
              />
              <BaseText variant="medium" style={styles.cameraText}>
                Upload Face Photo
              </BaseText>
            </View>
          )}
        </TouchableOpacity>

        {/* Checklist */}
        <View style={styles.checklist}>
          <View style={styles.checkRow}>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={14} color={Colors.primary} />
            </View>
            <BaseText style={styles.checkText}>Good lighting</BaseText>
          </View>
          <View style={styles.checkRow}>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={14} color={Colors.primary} />
            </View>
            <BaseText style={styles.checkText}>No sunglasses or masks</BaseText>
          </View>
          <View style={styles.checkRow}>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={14} color={Colors.primary} />
            </View>
            <BaseText style={styles.checkText}>Use your own document</BaseText>
          </View>
        </View>
      </View>

      <BaseButton
        title="Continue"
        disabled={!kycState.selfieImageUrl || isUploading}
        onPress={handleContinue}
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
    alignItems: "center",
    marginTop: 8,
  },
  cameraCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 4,
    borderColor: "rgba(94, 213, 168, 0.2)",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 24,
    overflow: "hidden",
  },
  cameraCircleCaptured: {
    borderColor: Colors.primary,
    backgroundColor: "rgba(94, 213, 168, 0.05)",
  },
  cameraPlaceholder: {
    alignItems: "center",
    gap: 8,
  },
  cameraText: {
    fontSize: 16,
    color: Colors.white,
  },
  capturedContainer: {
    alignItems: "center",
    gap: 4,
  },
  capturedText: {
    fontSize: 16,
    color: Colors.primary,
    marginTop: 8,
  },
  tapToRetake: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  checklist: {
    width: "100%",
    gap: 12,
    marginTop: 10,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    gap: 12,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(94, 213, 168, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  checkText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: FontFamily.medium,
  },
  continueButton: {
    marginVertical: 24,
    width: "100%",
  },
});
