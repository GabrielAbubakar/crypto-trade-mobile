import Background from "@/assets/images/auth-background.png";
import SuccessCreated from "@/assets/images/success-created.svg";
import { BaseButton, BaseText, ScreenContainer } from "@/components";
import { Colors } from "@/constants";
import { setCredentials, useAppDispatch, useVerifyOTPMutation } from "@/store";
import { showInfoToast } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function OTPScreen() {
  const dispatch = useAppDispatch();
  const { identifier, code } = useLocalSearchParams<{
    identifier: string;
    code: string;
  }>();
  const [verifyOtp, { isLoading: verifyOtpLoading }] = useVerifyOTPMutation();
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [verificationData, setVerificationData] = useState<any>(null);

  const ref1 = useRef<TextInput>(null);
  const ref2 = useRef<TextInput>(null);
  const ref3 = useRef<TextInput>(null);
  const ref4 = useRef<TextInput>(null);
  const ref5 = useRef<TextInput>(null);
  const ref6 = useRef<TextInput>(null);

  const inputRefs = useMemo(() => [ref1, ref2, ref3, ref4, ref5, ref6], []);

  const handleChangeText = (text: string, index: number) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    const newDigits = [...digits];
    newDigits[index] = cleaned;
    setDigits(newDigits);

    if (error) setError("");

    // Move to next input if filled
    if (cleaned && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleContinue = async () => {
    const code = digits.join("");
    if (code.length < 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }
    setError("");

    try {
      const res = await verifyOtp({ email: identifier, code }).unwrap();
      setVerificationData(res);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err?.data?.message || "Verification failed");
      console.log(err);
    }
  };

  const handleResend = () => {
    setTimer(30);
    setDigits(["", "", "", "", ""]);
    setError("");
    inputRefs[0].current?.focus();
  };

  const handleGetStarted = () => {
    if (verificationData) {
      // Dispatch tokens to state and persist it
      dispatch(
        setCredentials({
          user: verificationData.user,
          accessToken: verificationData.accessToken,
          refreshToken: verificationData.refreshToken,
        }),
      );
    }
    router.replace("/(tabs)/home");
  };

  // Countdown timer for Resend Link
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Auto-focus first input box on mount
  useEffect(() => {
    const focusTimeout = setTimeout(() => {
      inputRefs[0].current?.focus();
    }, 150);

    return () => clearTimeout(focusTimeout);
  }, [inputRefs]);

  useEffect(() => {
    showInfoToast(`OTP code: ${code}`);
    console.log(code, "codeee");
  }, [code]);

  // SUCCESSFUL REGISTRATION VIEW
  if (isSuccess) {
    return (
      <ScreenContainer
        scrollable={false}
        withPadding={true}
        style={styles.successContainer}
      >
        <View style={styles.successContent}>
          <View style={styles.svgWrapper}>
            <SuccessCreated width={220} height={220} />
            <LinearGradient
              colors={["transparent", Colors.background]}
              style={styles.gradient}
            />
          </View>
          <BaseText variant="bold" style={styles.successTitle}>
            Your account has been successfully created!
          </BaseText>
          <BaseButton
            title="Get Started"
            onPress={handleGetStarted}
            style={styles.getStartedButton}
          />
        </View>
      </ScreenContainer>
    );
  }

  // OTP VERIFICATION VIEW
  return (
    <ScreenContainer
      scrollable={false}
      withPadding={true}
      style={styles.container}
    >
      <Image
        source={Background}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "120%",
        }}
      />
      <View
        style={{ flex: 1 }}
      >
        {/* Back Button Header */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
          <BaseText variant="bold" style={styles.backButtonText}>
            Verification
          </BaseText>
        </TouchableOpacity>

        <View style={styles.content}>
          <BaseText variant="bold" style={styles.title}>
            Enter your code
          </BaseText>
          <BaseText style={styles.subtitle}>
            Please type the code we sent to{"\n"}
            <BaseText style={styles.mobileText}>
              {identifier || "+1 234 567 8900"}
            </BaseText>
          </BaseText>

          {/* OTP Digit Blocks */}
          <View style={styles.otpInputContainer}>
            {digits.map((digit, index) => (
              <View key={index} style={styles.otpInputBox}>
                <TextInput
                  ref={inputRefs[index]}
                  style={styles.otpInput}
                  keyboardType="numeric"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleChangeText(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  placeholderTextColor="#4E586E"
                  placeholder="-"
                />
              </View>
            ))}
          </View>

          {error ? <BaseText style={styles.errorText}>{error}</BaseText> : null}

          {/* Timer or Resend Link */}
          <View style={styles.resendContainer}>
            {timer > 0 ? (
              <BaseText style={styles.resendTimerText}>
                Resend code ({timer})
              </BaseText>
            ) : (
              <TouchableOpacity onPress={handleResend}>
                <BaseText style={styles.resendLinkText}>Resend Link</BaseText>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <BaseButton
          title="Continue"
          onPress={handleContinue}
          isLoading={verifyOtpLoading}
          style={styles.submitButton}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
    paddingTop: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  backButtonText: {
    color: Colors.white,
    fontSize: 16,
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    color: Colors.white,
    marginBottom: 10,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#A7AFB7",
    lineHeight: 20,
    marginBottom: 40,
  },
  mobileText: {
    color: Colors.primary,
  },
  otpInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  otpInputBox: {
    width: 50,
    height: 50,
    backgroundColor: "#161C22",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#252E38",
  },
  otpInput: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.white,
    textAlign: "center",
    width: "100%",
    height: "100%",
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    textAlign: "center",
    marginBottom: 10,
  },
  resendContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  resendTimerText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  resendLinkText: {
    fontSize: 14,
    color: Colors.primary,
  },
  submitButton: {
    height: 56,
    borderRadius: 15,
    marginBottom: 30,
  },

  // Success screen styles
  successContainer: {
    flex: 1,
    backgroundColor: Colors.secondary,
    paddingVertical: 40,
    paddingTop: 80,
  },
  successContent: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
  },
  svgWrapper: {
    marginBottom: 40,
  },
  successTitle: {
    fontSize: 28,
    color: Colors.white,
    textAlign: "center",
    lineHeight: 36,
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
  },
  getStartedButton: {
    height: 56,
    borderRadius: 15,
    marginTop: 40,
    width: "100%",
  },
});
