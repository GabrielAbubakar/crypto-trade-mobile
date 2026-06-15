import { KycProgressSteps } from "@/components/kyc/KycProgressSteps";
import {
  BackHeader,
  BaseButton,
  BaseText,
  ScreenContainer,
} from "@/components/ui";
import { Colors, FontFamily } from "@/constants";
import {
  setDocumentBackImageUrl,
  setDocumentImageUrl,
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

type DocTab = "front" | "back";

export default function KYCDocument() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const kycState = useAppSelector((state) => state.kyc);

  const [activeTab, setActiveTab] = useState<DocTab>("front");

  const [uploadedFiles, setUploadedFiles] = useState<Record<DocTab, boolean>>({
    front: !!kycState.documentImageUrl,
    back: !!kycState.documentBackImageUrl,
  });

  const [kycUpload, { isLoading: isUploadingApi }] = useKycUploadMutation();
  const [uploadingTab, setUploadingTab] = useState<Record<DocTab, boolean>>({
    front: false,
    back: false,
  });

  const handleUpload = async (tab: DocTab) => {
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

      setUploadingTab((prev) => ({ ...prev, [tab]: true }));

      const documentKind = tab === "front" ? "document_front" : "document_back";

      // 1. Request presigned URL
      const uploadInstructions = await kycUpload({
        fileName,
        contentType,
        documentKind,
      }).unwrap();

      const { uploadUrl, publicUrl, imageUrl, method, formFields } = uploadInstructions.data;
      const finalImageUrl = publicUrl || imageUrl || "";

      // 2. Upload the file
      if (method === "POST" || method === "post") {
        const formData = new FormData();
        if (formFields) {
          Object.entries(formFields).forEach(([key, value]) => {
            formData.append(key, String(value));
          });
        }
        formData.append("file", {
          uri: file.uri,
          type: contentType,
          name: fileName,
        } as any);

        const uploadResponse = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text().catch(() => "");
          console.error("Cloudinary upload failed:", errorText);
          throw new Error("Failed to upload document file to Cloudinary");
        }
      } else {
        // 2. Fetch and upload raw binary data
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
          throw new Error("Failed to upload binary file to S3");
        }
      }

      // 3. Update Redux store state
      if (tab === "back") {
        dispatch(setDocumentBackImageUrl(finalImageUrl));
      } else {
        dispatch(setDocumentImageUrl(finalImageUrl));
      }

      setUploadedFiles((prev) => ({
        ...prev,
        [tab]: true,
      }));

      showSuccessToast(`${tab.toUpperCase()} document uploaded successfully!`);
    } catch (err: any) {
      // console.error(err);
      showErrorToast(err?.message || "An error occurred during file upload.");
    } finally {
      setUploadingTab((prev) => ({ ...prev, [tab]: false }));
    }
  };

  const handleContinue = () => {
    router.push("/kyc/selfie");
  };

  // We require Front to be uploaded
  const canContinue = uploadedFiles.front;

  const renderUploadPlaceholder = (tab: DocTab, label: string) => {
    const isUploaded = uploadedFiles[tab];
    const isUploading = uploadingTab[tab];

    return (
      <TouchableOpacity
        style={[styles.uploadCard, isUploaded && styles.uploadCardActive]}
        onPress={() => handleUpload(tab)}
        disabled={isUploading}
      >
        {isUploading ? (
          <View style={styles.uploadedContent}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <BaseText
              variant="bold"
              style={[styles.uploadedTitle, { marginTop: 16 }]}
            >
              Uploading...
            </BaseText>
          </View>
        ) : isUploaded ? (
          <View style={styles.uploadedContent}>
            <View style={styles.uploadedCircle}>
              <Ionicons name="checkmark" size={32} color={Colors.primary} />
            </View>
            <BaseText variant="bold" style={styles.uploadedTitle}>
              {label} uploaded
            </BaseText>
            <BaseText style={styles.uploadedSubtitle}>
              Tap to re-upload
            </BaseText>
          </View>
        ) : (
          <View style={styles.uploadPlaceholderContent}>
            <View style={styles.uploadCircle}>
              <Ionicons
                name="cloud-upload-outline"
                size={32}
                color={Colors.textSecondary}
              />
            </View>
            <BaseText variant="medium" style={styles.uploadPlaceholderTitle}>
              Upload document {label}
            </BaseText>
            <BaseText style={styles.uploadPlaceholderSubtitle}>
              Accepted files: JPG - PNG
            </BaseText>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer scrollable>
      <BackHeader title="Upload document" />

      <BaseText style={styles.headerSubtitle}>
        Use a clear photo. All corners should be visible and text readable.
      </BaseText>

      <KycProgressSteps currentStep={2} />

      <View style={styles.content}>
        {/* Horizontal tabs */}
        <View style={styles.tabsContainer}>
          {(["front", "back"] as DocTab[]).map((tab) => {
            const isTabActive = activeTab === tab;
            const hasUpload = uploadedFiles[tab];
            const getLabel = () => {
              if (tab === "front") return "Front required";
              return "Back optional";
            };

            return (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabItem,
                  isTabActive && styles.tabItemActive,
                  hasUpload && styles.tabItemWithUpload,
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <BaseText
                  style={[
                    styles.tabText,
                    isTabActive && styles.tabTextActive,
                    hasUpload && !isTabActive && { color: Colors.primary },
                  ]}
                >
                  {getLabel()}
                </BaseText>
                {hasUpload && (
                  <View style={styles.tabIndicator}>
                    <Ionicons
                      name="checkmark-circle"
                      size={12}
                      color={Colors.primary}
                    />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Dynamic upload placeholders */}
        {activeTab === "front" && renderUploadPlaceholder("front", "front")}
        {activeTab === "back" && renderUploadPlaceholder("back", "back")}

        <View style={styles.guidelines}>
          <BaseText style={styles.guidelinesTitle}>Requirements:</BaseText>
          <View style={styles.bulletRow}>
            <Ionicons name="checkbox" size={16} color={Colors.primary} />
            <BaseText style={styles.bulletText}>
              Government-issued valid ID
            </BaseText>
          </View>
          <View style={styles.bulletRow}>
            <Ionicons name="checkbox" size={16} color={Colors.primary} />
            <BaseText style={styles.bulletText}>
              All 4 corners of document must be in frame
            </BaseText>
          </View>
          <View style={styles.bulletRow}>
            <Ionicons name="checkbox" size={16} color={Colors.primary} />
            <BaseText style={styles.bulletText}>
              Text must be fully readable (no blur/glare)
            </BaseText>
          </View>
        </View>
      </View>

      <BaseButton
        title="Upload and continue"
        disabled={!canContinue}
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
    marginTop: 8,
  },
  tabsContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    flexDirection: "row",
    gap: 4,
  },
  tabItemActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabItemWithUpload: {
    borderColor: "rgba(94, 213, 168, 0.3)",
  },
  tabText: {
    fontSize: 11,
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  tabTextActive: {
    color: Colors.secondary,
    fontFamily: FontFamily.bold,
  },
  tabIndicator: {
    position: "absolute",
    top: 4,
    right: 4,
  },
  uploadCard: {
    height: 240,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  uploadCardActive: {
    borderColor: Colors.primary,
    backgroundColor: "rgba(94, 213, 168, 0.03)",
    borderStyle: "solid",
  },
  uploadPlaceholderContent: {
    alignItems: "center",
    padding: 20,
  },
  uploadCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  uploadPlaceholderTitle: {
    fontSize: 16,
    color: Colors.white,
    marginBottom: 6,
  },
  uploadPlaceholderSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  uploadedContent: {
    alignItems: "center",
    padding: 20,
  },
  uploadedCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(94, 213, 168, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  uploadedTitle: {
    fontSize: 16,
    color: Colors.primary,
    marginBottom: 6,
  },
  uploadedSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  guidelines: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  guidelinesTitle: {
    fontSize: 14,
    fontFamily: FontFamily.bold,
    color: Colors.white,
    marginBottom: 4,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  bulletText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  continueButton: {
    marginVertical: 24,
  },
});
