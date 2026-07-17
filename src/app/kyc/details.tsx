import {
    BackHeader,
    BaseButton,
    BaseInput,
    BaseText,
    ScreenContainer,
} from "@/shared/ui";
import { Colors, FontFamily } from "@/shared/constants";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { KycProgressSteps } from "@/features/kyc/components/KycProgressSteps";
import { kycDetailsSchema } from "@/features/kyc/schemas/kyc.schema";
import { setKycDetails } from "@/features/kyc/slices/kycSlice";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useForm, useStore } from "@tanstack/react-form";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
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

  const sheetRef = useRef<BottomSheetModal>(null);

  const form = useForm({
    defaultValues: {
      legalName: kycState.legalName || "",
      country: kycState.country || "Nigeria",
      documentType: kycState.documentType || "",
      documentNumber: kycState.documentNumber || "",
    },
    validators: {
      onChange: kycDetailsSchema,
    },
    onSubmit: async ({ value }) => {
      dispatch(
        setKycDetails({
          legalName: value.legalName,
          country: value.country,
          documentType: value.documentType,
          documentNumber: value.documentNumber,
        }),
      );
      router.push("/kyc/document");
    },
  });

  const formValues = useStore(form.baseStore, (state: any) => state.values);
  const currentDocType = formValues.documentType;

  const isFormValid =
    formValues.legalName.trim().length >= 2 &&
    formValues.country.trim().length >= 1 &&
    ["passport", "national_id", "drivers_license"].includes(
      formValues.documentType,
    ) &&
    formValues.documentNumber.trim().length >= 3;

  const handleOpenSheet = () => {
    sheetRef.current?.present();
  };

  const handleSelectOption = (value: string) => {
    form.setFieldValue("documentType", value);
    form.validate("change");
    sheetRef.current?.dismiss();
  };

  const getDocTypeLabel = (val: string) => {
    const option = docTypeOptions.find((o) => o.value === val);
    return option ? option.label : val;
  };

  return (
    <ScreenContainer avoidKeyboard keyboardVerticalOffset={20} scrollable>
      <BackHeader title="Identity details" />

      <BaseText style={styles.headerSubtitle}>
        Enter details exactly as they appear on your document.
      </BaseText>

      <KycProgressSteps currentStep={1} />

      <View style={styles.content}>
        {/* Legal Name */}
        <View style={styles.inputGroup}>
          <BaseText style={styles.inputLabel}>Legal name</BaseText>
          <form.Field name="legalName">
            {(field) => (
              <BaseInput
                placeholder="Enter your legal name"
                value={field.state.value}
                onChangeText={field.handleChange}
                containerStyle={styles.inputStyle}
                error={
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
                    ? field.state.meta.errors
                        .map((err: any) =>
                          typeof err === "string" ? err : err.message,
                        )
                        .join(", ")
                    : undefined
                }
              />
            )}
          </form.Field>
        </View>

        {/* Country */}
        <View style={styles.inputGroup}>
          <BaseText style={styles.inputLabel}>Country</BaseText>
          <form.Field name="country">
            {(field) => (
              <BaseInput
                placeholder="Enter your country"
                value={field.state.value}
                onChangeText={field.handleChange}
                editable={false}
                containerStyle={styles.inputStyle}
              />
            )}
          </form.Field>
        </View>

        {/* Document Type */}
        <View style={styles.inputGroup}>
          <BaseText style={styles.inputLabel}>Document type</BaseText>
          <form.Field name="documentType">
            {(field) => (
              <TouchableOpacity onPress={handleOpenSheet} activeOpacity={0.8}>
                <View pointerEvents="none">
                  <BaseInput
                    placeholder="Select document type"
                    value={getDocTypeLabel(field.state.value)}
                    editable={false}
                    containerStyle={styles.inputStyle}
                    rightIcon={
                      <Ionicons
                        name="chevron-down"
                        size={20}
                        color={Colors.textSecondary}
                      />
                    }
                    error={
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0
                        ? field.state.meta.errors
                            .map((err: any) =>
                              typeof err === "string" ? err : err.message,
                            )
                            .join(", ")
                        : undefined
                    }
                  />
                </View>
              </TouchableOpacity>
            )}
          </form.Field>
        </View>

        {/* Document Number */}
        <View style={styles.inputGroup}>
          <BaseText style={styles.inputLabel}>Document number</BaseText>
          <form.Field name="documentNumber">
            {(field) => (
              <BaseInput
                placeholder="Enter document number"
                value={field.state.value}
                onChangeText={field.handleChange}
                containerStyle={styles.inputStyle}
                error={
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
                    ? field.state.meta.errors
                        .map((err: any) =>
                          typeof err === "string" ? err : err.message,
                        )
                        .join(", ")
                    : undefined
                }
              />
            )}
          </form.Field>
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
        onPress={() => form.handleSubmit()}
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
              const isActive = currentDocType === option.value;
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
