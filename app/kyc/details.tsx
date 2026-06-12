import { KycProgressSteps } from "@/components/kyc/KycProgressSteps";
import {
  BackHeader,
  BaseButton,
  BaseInput,
  BaseText,
  ScreenContainer,
} from "@/components/ui";
import { Colors, FontFamily } from "@/constants";
import { setKycDetails, useAppDispatch, useAppSelector } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const docTypeOptions = [
  { label: "Passport", value: "passport" },
  { label: "National ID", value: "national_id" },
  { label: "Drivers License", value: "drivers_license" },
];

export default function KYCDetails() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const kycState = useAppSelector((state) => state.kyc);

  const [name, setName] = useState(kycState.legalName);
  const [country, setCountry] = useState(kycState.country);
  const [docType, setDocType] = useState(kycState.documentType);
  const [docNumber, setDocNumber] = useState(kycState.documentNumber);

  const sheetRef = useRef<BottomSheetModal>(null);
  // const snapPoints = useMemo(() => ["40%"], []);

  const handleOpenSheet = () => {
    sheetRef.current?.present();
  };

  const handleSelectOption = (value: string) => {
    setDocType(value);
    sheetRef.current?.dismiss();
  };

  const getDocTypeLabel = (val: string) => {
    const option = docTypeOptions.find((o) => o.value === val);
    return option ? option.label : val;
  };

  const handleContinue = () => {
    dispatch(
      setKycDetails({
        legalName: name,
        country,
        documentType: docType,
        documentNumber: docNumber,
      }),
    );
    router.push("/kyc/document");
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
            editable={false}
            containerStyle={styles.inputStyle}
          />
        </View>

        {/* Document Type */}
        <View style={styles.inputGroup}>
          <BaseText style={styles.inputLabel}>Document type</BaseText>
          <TouchableOpacity onPress={handleOpenSheet} activeOpacity={0.8}>
            <View pointerEvents="none">
              <BaseInput
                placeholder="Select document type"
                value={getDocTypeLabel(docType)}
                editable={false}
                containerStyle={styles.inputStyle}
                rightIcon={
                  <Ionicons
                    name="chevron-down"
                    size={20}
                    color={Colors.textSecondary}
                  />
                }
              />
            </View>
          </TouchableOpacity>
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

      <BottomSheetModal
        ref={sheetRef}
        index={0}
        // snapPoints={snapPoints}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.sheetHandle}
      >
        <BottomSheetView style={styles.sheetContainer}>
          <BaseText style={styles.sheetTitle}>Select Document Type</BaseText>
          <View style={styles.optionsContainer}>
            {docTypeOptions.map((option) => {
              const isActive = docType === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => handleSelectOption(option.value)}
                  style={[
                    styles.optionButton,
                    isActive && styles.optionButtonActive,
                  ]}
                  activeOpacity={0.7}
                >
                  <BaseText
                    style={[
                      styles.optionText,
                      isActive && styles.optionTextActive,
                    ]}
                  >
                    {option.label}
                  </BaseText>
                  {isActive && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={Colors.primary}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
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
    flexGrow: 1,
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
  sheetBackground: {
    backgroundColor: Colors.secondary,
  },
  sheetHandle: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    width: 60,
    height: 4,
  },
  sheetContainer: {
    padding: 24,
    backgroundColor: Colors.secondary,
    flex: 1,
  },
  sheetTitle: {
    fontSize: 18,
    color: Colors.white,
    fontFamily: FontFamily.bold,
    marginBottom: 20,
    textAlign: "center",
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  optionButtonActive: {
    backgroundColor: "rgba(94, 213, 168, 0.08)",
    borderColor: "rgba(94, 213, 168, 0.3)",
  },
  optionText: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontFamily: FontFamily.medium,
  },
  optionTextActive: {
    color: Colors.primary,
    fontFamily: FontFamily.bold,
  },
});
