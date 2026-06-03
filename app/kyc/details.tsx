import { KycProgressSteps } from "@/components/kyc/KycProgressSteps";
import {
  BackHeader,
  BaseButton,
  BaseInput,
  BaseText,
  ScreenContainer,
} from "@/components/ui";
import { Colors, FontFamily } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function KYCDetails() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [docType, setDocType] = useState("");
  const [docNumber, setDocNumber] = useState("");

  const handleContinue = () => {
    // Navigate to next step and pass parameters along
    router.push({
      pathname: "/kyc/document",
      params: {
        name,
        country,
        docType,
        docNumber,
      },
    });
  };

  const isFormValid =
    name.trim() && country.trim() && docType.trim() && docNumber.trim();

  return (
    <ScreenContainer scrollable>
      <BackHeader title="Identity details" />

      <BaseText style={styles.headerSubtitle}>
        Enter details exactly as they appear on your document.
      </BaseText>

      <KycProgressSteps currentStep={1} />

      <View style={styles.content}>
        {/* Legal Name */}
        <View style={styles.inputGroup}>
          <BaseText style={styles.inputLabel}>Legal name</BaseText>
          <BaseInput
            placeholder="Enter your legal name"
            value={name}
            onChangeText={setName}
            containerStyle={styles.inputStyle}
          />
        </View>

        {/* Country */}
        <View style={styles.inputGroup}>
          <BaseText style={styles.inputLabel}>Country</BaseText>
          <BaseInput
            placeholder="Enter your country"
            value={country}
            onChangeText={setCountry}
            containerStyle={styles.inputStyle}
          />
        </View>

        {/* Document Type */}
        <View style={styles.inputGroup}>
          <BaseText style={styles.inputLabel}>Document type</BaseText>
          <BaseInput
            placeholder="Passport, National ID, Drivers License..."
            value={docType}
            onChangeText={setDocType}
            containerStyle={styles.inputStyle}
          />
        </View>

        {/* Document Number */}
        <View style={styles.inputGroup}>
          <BaseText style={styles.inputLabel}>Document number</BaseText>
          <BaseInput
            placeholder="Enter document number"
            value={docNumber}
            onChangeText={setDocNumber}
            containerStyle={styles.inputStyle}
          />
        </View>

        {/* Warning card */}
        <View style={styles.warningCard}>
          <Ionicons
            name="warning-outline"
            size={20}
            color="#D4AF37"
            style={styles.warningIcon}
          />
          <BaseText style={styles.warningText}>
            Mismatched details can delay approval or require resubmission.
          </BaseText>
        </View>
      </View>

      <BaseButton
        title="Continue"
        disabled={!isFormValid}
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
    gap: 16,
    marginTop: 8,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: FontFamily.medium,
  },
  inputStyle: {
    backgroundColor: "#161C22",
    height: 56,
  },
  warningCard: {
    flexDirection: "row",
    backgroundColor: "rgba(212, 175, 55, 0.08)",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.2)",
    alignItems: "center",
    marginTop: 10,
  },
  warningIcon: {
    marginRight: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  continueButton: {
    marginVertical: 24,
  },
});
