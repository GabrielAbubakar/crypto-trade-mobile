import { KycProgressSteps } from "@/components/kyc/KycProgressSteps";
import {
  BackHeader,
  BaseButton,
  BaseText,
  ScreenContainer,
} from "@/components/ui";
import { Colors, FontFamily } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type DocTab = "front" | "back" | "passport";

export default function KYCDocument() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<DocTab>("front");
  const [uploadedFiles, setUploadedFiles] = useState<Record<DocTab, boolean>>({
    front: false,
    back: false,
    passport: false,
  });

  const handleUpload = (tab: DocTab) => {
    // Mock the upload status toggling
    setUploadedFiles((prev) => ({
      ...prev,
      [tab]: !prev[tab],
    }));
  };

  const handleContinue = () => {
    router.push({
      pathname: "/kyc/selfie",
      params: {
        ...params,
        frontUploaded: uploadedFiles.front ? "yes" : "no",
        backUploaded: uploadedFiles.back ? "yes" : "no",
        passportUploaded: uploadedFiles.passport ? "yes" : "no",
        hasDocumentImage: "yes",
      },
    });
  };

  // We require either Front to be uploaded OR Passport to be uploaded
  const canContinue = uploadedFiles.front || uploadedFiles.passport;

  const renderUploadPlaceholder = (tab: DocTab, label: string) => {
    const isUploaded = uploadedFiles[tab];

    return (
      <TouchableOpacity
        style={[styles.uploadCard, isUploaded && styles.uploadCardActive]}
        onPress={() => handleUpload(tab)}
      >
        {isUploaded ? (
          <View style={styles.uploadedContent}>
            <View style={styles.uploadedCircle}>
              <Ionicons name="checkmark" size={32} color={Colors.primary} />
            </View>
            <BaseText variant="bold" style={styles.uploadedTitle}>
              {label} uploaded
            </BaseText>
            <BaseText style={styles.uploadedSubtitle}>
              Tap to delete or re-upload
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
          {(["front", "back", "passport"] as DocTab[]).map((tab) => {
            const isTabActive = activeTab === tab;
            const hasUpload = uploadedFiles[tab];
            const getLabel = () => {
              if (tab === "front") return "Front required";
              if (tab === "back") return "Back optional";
              return "Passport page";
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
        {activeTab === "passport" &&
          renderUploadPlaceholder("passport", "passport page")}

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
