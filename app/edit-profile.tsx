import profileImage from "@/assets/images/avatar.jpg";
import { BackHeader, BaseButton, ScreenContainer } from "@/components";
import { Caption, Subtitle } from "@/components/ui/BaseText";
import { BaseTouchableOpacity } from "@/components/ui/BaseTouchableOpacity";
import { Colors } from "@/constants";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

export default function EditProfileScreen() {
  const router = useRouter();
  const { focusField } = useLocalSearchParams<{ focusField?: string }>();

  // State values for form fields
  const [username, setUsername] = useState("Username1234");
  const [email, setEmail] = useState("example@mail.com");
  const [password, setPassword] = useState("mypassword123");
  const [mobile, setMobile] = useState("+1 234 567 8900");

  // Track password visibility state
  const [passwordHidden, setPasswordHidden] = useState(true);

  // Track focused states for active styling transitions
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Refs for each input field
  const usernameInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const mobileInputRef = useRef<TextInput>(null);

  // Trigger auto-focus based on search params
  useEffect(() => {
    if (!focusField) return;

    const timer = setTimeout(() => {
      if (focusField === "username") {
        usernameInputRef.current?.focus();
      } else if (focusField === "email") {
        emailInputRef.current?.focus();
      } else if (focusField === "password") {
        passwordInputRef.current?.focus();
      } else if (focusField === "mobile") {
        mobileInputRef.current?.focus();
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [focusField]);

  return (
    <ScreenContainer scrollable style={styles.container}>
      <BackHeader title="Edit Profile" />

      {/* Profile Section (Avatar & Camera Badge overlay) */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Image
            source={profileImage}
            style={styles.avatar}
            contentFit="cover"
          />
          <BaseTouchableOpacity activeOpacity={0.8} style={styles.cameraButton}>
            <Feather name="camera" size={15} color={Colors.white} />
          </BaseTouchableOpacity>
        </View>
        <Subtitle style={styles.usernameText}>User1234</Subtitle>
      </View>

      {/* Underlined Forms List */}
      <View style={styles.form}>
        {/* Username */}
        <View style={styles.inputGroup}>
          <Caption style={styles.label}>Username</Caption>
          <TextInput
            ref={usernameInputRef}
            style={[
              styles.underlineInput,
              focusedField === "username" && styles.underlineInputActive,
            ]}
            value={username}
            onChangeText={setUsername}
            placeholderTextColor={Colors.textSecondary}
            onFocus={() => setFocusedField("username")}
            onBlur={() => setFocusedField(null)}
          />
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Caption style={styles.label}>Email</Caption>
          <TextInput
            ref={emailInputRef}
            style={[
              styles.underlineInput,
              focusedField === "email" && styles.underlineInputActive,
            ]}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={Colors.textSecondary}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
          />
        </View>

        {/* Password */}
        <View style={styles.inputGroup}>
          <Caption style={styles.label}>Password</Caption>
          <View style={styles.passwordWrapper}>
            <TextInput
              ref={passwordInputRef}
              style={[
                styles.underlineInput,
                { flex: 1 },
                focusedField === "password" && styles.underlineInputActive,
              ]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={passwordHidden}
              autoCapitalize="none"
              placeholderTextColor={Colors.textSecondary}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
            />
            <BaseTouchableOpacity
              activeOpacity={0.7}
              onPress={() => setPasswordHidden((prev) => !prev)}
              style={styles.eyeBtn}
            >
              <Feather
                name={passwordHidden ? "eye-off" : "eye"}
                size={18}
                color={
                  focusedField === "password"
                    ? Colors.primary
                    : "rgba(255, 255, 255, 0.4)"
                }
              />
            </BaseTouchableOpacity>
          </View>
        </View>

        {/* Mobile Number */}
        <View style={styles.inputGroup}>
          <Caption style={styles.label}>Mobile Number</Caption>
          <TextInput
            ref={mobileInputRef}
            style={[
              styles.underlineInput,
              focusedField === "mobile" && styles.underlineInputActive,
            ]}
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
            placeholderTextColor={Colors.textSecondary}
            onFocus={() => setFocusedField("mobile")}
            onBlur={() => setFocusedField(null)}
          />
        </View>
      </View>

      {/* Button Cancel / Save Row */}
      <View style={styles.buttonContainer}>
        <BaseButton
          title="Cancel"
          variant="secondary"
          style={styles.cancelBtn}
          onPress={() => router.back()}
        />
        <BaseButton
          title="Save Changes"
          variant="primary"
          style={styles.saveBtn}
          onPress={() => router.back()}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondary,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.primary,
    padding: 2,
    position: "relative",
    marginBottom: 12,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  cameraButton: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#2E3A45",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.secondary,
  },
  usernameText: {
    color: Colors.textPrimary,
    fontWeight: "bold",
    fontSize: 18,
  },
  form: {
    paddingTop: 10,
    gap: 24,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    color: "#777777",
    fontSize: 13,
  },
  underlineInput: {
    color: Colors.textPrimary,
    fontSize: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.15)",
  },
  underlineInputActive: {
    borderBottomColor: Colors.primary,
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  eyeBtn: {
    position: "absolute",
    right: 0,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 15,
    marginTop: 48,
    marginBottom: 120, // extra spacing so the float bottom tab doesn't cut it off
  },
  cancelBtn: {
    flex: 1,
    height: 52,
  },
  saveBtn: {
    flex: 1,
    height: 52,
  },
});
