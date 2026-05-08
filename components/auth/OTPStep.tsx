import React, { useRef, useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants";
import { BaseButton, BaseInput, BaseText, ScreenContainer } from "../ui";

const { width } = Dimensions.get("window");

interface OTPStepProps {
  onVerify: () => void;
  onBack: () => void;
}

export const OTPStep: React.FC<OTPStepProps> = ({ onVerify, onBack }) => {
  const [code, setCode] = useState(["", "", "", ""]);
  const inputs = useRef<any[]>([]);

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 3) {
      inputs.current[index + 1].focus();
    }
  };

  return (
    <ScreenContainer withPadding={false} style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={Colors.white} />
        <BaseText style={styles.backButtonText}>Verification</BaseText>
      </TouchableOpacity>

      <View style={styles.otpContent}>
        <BaseText style={styles.otpTitle}>Enter your code</BaseText>
        <BaseText style={styles.otpSubtitle}>
          Please type the code we sent to {"\n"}
          <BaseText style={{ color: Colors.primary }}>+1 234 456 7890</BaseText>
        </BaseText>

        <View style={styles.otpInputContainer}>
          {code.map((digit, i) => (
            <BaseInput
              key={i}
              ref={(ref: TextInput) => {
                inputs.current[i] = ref;
              }}
              style={styles.otpInput}
              containerStyle={styles.otpInputBox}
              maxLength={1}
              keyboardType="number-pad"
              value={digit}
              onChangeText={(text) => handleCodeChange(text, i)}
              textAlign="center"
            />
          ))}
        </View>

        <BaseText style={styles.resendText}>Resend code (30)</BaseText>
        <TouchableOpacity>
          <BaseText style={styles.resendLink}>Resend Link</BaseText>
        </TouchableOpacity>

        <BaseButton
          title="Continue"
          onPress={onVerify}
          style={styles.otpButton}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  backButtonText: {
    color: Colors.white,
    fontSize: 18,
    marginLeft: 15,
    fontWeight: "600",
  },
  otpContent: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 40,
  },
  otpTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.white,
    marginBottom: 10,
  },
  otpSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: 40,
  },
  otpInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  otpInputBox: {
    width: width * 0.18,
    height: 60,
    backgroundColor: "#1B232A",
    borderWidth: 1,
    borderColor: "#2A353D",
  },
  otpInput: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.white,
  },
  resendText: {
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 10,
  },
  resendLink: {
    color: Colors.primary,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 40,
  },
  otpButton: {
    height: 56,
  },
});
