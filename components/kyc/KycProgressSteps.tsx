import { Colors, FontFamily } from "@/constants";
import React from "react";
import { StyleSheet, View } from "react-native";
import { BaseText } from "../ui/BaseText";

interface KycProgressStepsProps {
  currentStep: 0 | 1 | 2 | 3;
}

export const KycProgressSteps: React.FC<KycProgressStepsProps> = ({
  currentStep,
}) => {
  const steps = [
    { id: 1, label: "Identity" },
    { id: 2, label: "Document" },
    { id: 3, label: "Review" },
  ];

  return (
    <View style={styles.container}>
      {/* Background Line */}
      <View style={styles.lineBg} />

      {/* Active Line Progress */}
      <View
        style={[
          styles.lineActive,
          {
            width: currentStep <= 1 ? "0%" : currentStep === 2 ? "50%" : "100%",
          },
        ]}
      />

      <View style={styles.stepsContainer}>
        {steps.map((step) => {
          const isActive = currentStep >= step.id;
          const isCurrent = currentStep === step.id;

          return (
            <View key={step.id} style={styles.stepItem}>
              <View
                style={[
                  styles.circle,
                  isActive ? styles.circleActive : styles.circleInactive,
                  isCurrent && styles.circleCurrent,
                ]}
              >
                <BaseText
                  style={[
                    styles.stepNumber,
                    {
                      color: isActive ? Colors.secondary : Colors.textSecondary,
                    },
                  ]}
                >
                  {step.id}
                </BaseText>
              </View>
              <BaseText
                style={[
                  styles.label,
                  {
                    color: isActive ? Colors.primary : Colors.textSecondary,
                    fontFamily: isActive ? FontFamily.bold : FontFamily.regular,
                  },
                ]}
              >
                {step.label}
              </BaseText>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
    position: "relative",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  lineBg: {
    position: "absolute",
    height: 2,
    backgroundColor: Colors.graySteps,
    top: 15,
    left: 45,
    right: 45,
  },
  lineActive: {
    position: "absolute",
    height: 2,
    backgroundColor: Colors.primary,
    top: 15,
    left: 45,
    maxWidth: "80%", // to fit right boundary
  },
  stepsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stepItem: {
    alignItems: "center",
    width: 60,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  circleActive: {
    backgroundColor: Colors.primary,
  },
  circleInactive: {
    backgroundColor: Colors.grayStepsAlt,
  },
  circleCurrent: {
    borderWidth: 2,
    borderColor: Colors.white,
  },
  stepNumber: {
    fontSize: 12,
    fontFamily: FontFamily.bold,
  },
  label: {
    fontSize: 11,
    marginTop: 8,
  },
});
