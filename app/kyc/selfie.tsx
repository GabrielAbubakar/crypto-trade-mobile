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

export default function KYCSelfie() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [captured, setCaptured] = useState(false);

  const handleCapture = () => {
    setCaptured((prev) => !prev);
  };

  const handleContinue = () => {
    router.push({
      pathname: "/kyc/review",
      params: {
        ...params,
        selfieUploaded: "yes",
      },
    });
  };

  return (
    <ScreenContainer scrollable>
      <BackHeader title="Selfie check" />

      <BaseText style={styles.headerSubtitle}>
        Take a clear selfie so compliance can compare your face with your
        document.
      </BaseText>

      <KycProgressSteps currentStep={2} />

      <View style={styles.content}>
        {/* Circular camera match area */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.cameraCircle, captured && styles.cameraCircleCaptured]}
          onPress={handleCapture}
        >
          {captured ? (
            <View style={styles.capturedContainer}>
              <Ionicons
                name="checkmark-circle"
                size={48}
                color={Colors.primary}
              />
              <BaseText variant="bold" style={styles.capturedText}>
                Selfie captured!
              </BaseText>
              <BaseText style={styles.tapToRetake}>Tap to retake</BaseText>
            </View>
          ) : (
            <View style={styles.cameraPlaceholder}>
              <Ionicons
                name="camera-outline"
                size={40}
                color={Colors.primary}
              />
              <BaseText variant="medium" style={styles.cameraText}>
                Face match
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
        title="Upload selfie"
        disabled={!captured}
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
