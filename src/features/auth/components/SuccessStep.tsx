import SuccessGraphic from "@/assets/images/success-created.svg";
import { Colors } from "@/shared/constants";
import React from "react";
import { StyleSheet, View } from "react-native";
import { BaseButton, BaseText, ScreenContainer } from '@/shared/ui';

interface SuccessStepProps {
  onFinish: () => void;
}

export const SuccessStep: React.FC<SuccessStepProps> = ({ onFinish }) => {
  return (
    <ScreenContainer withPadding={false} style={styles.successContainer}>
      <View style={styles.successContent}>
        <SuccessGraphic width={200} height={200} />
        <BaseText style={styles.successTitle}>
          Your account has been {"\n"}successfully created!
        </BaseText>
        <BaseButton
          title="Get Started"
          onPress={onFinish}
          style={styles.successButton}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  successContainer: {
    flex: 1,
    backgroundColor: Colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  successContent: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.white,
    textAlign: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  successButton: {
    width: "100%",
    height: 56,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
});
