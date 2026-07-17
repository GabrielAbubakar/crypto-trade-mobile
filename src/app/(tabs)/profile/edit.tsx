import profileImage from "@/assets/images/avatar.jpg";
import { BackHeader, BaseButton, ScreenContainer } from "@/shared/ui";
import { Caption, Subtitle } from "@/shared/ui/BaseText";
import { BaseTouchableOpacity } from "@/shared/ui/BaseTouchableOpacity";
import { Colors } from "@/shared/constants";
import { useUpdateProfileMutation } from "@/store/store";
import { showToast } from "@/shared/utils";
import { useGetProfileQuery } from "@/features/profile/api/profileApi";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

export default function EditProfileScreen() {
  const router = useRouter();
  const { data, isLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const { focusField } = useLocalSearchParams<{ focusField?: string }>();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password] = useState("••••••••");
  const [mobile, setMobile] = useState("");

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const usernameInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const mobileInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!data) return;

    setUsername(data.fullName ?? "");
    setEmail(data.email ?? "");
    setMobile(data.phone ?? "");
  }, [data]);

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

  async function handleSave() {
    try {
      await updateProfile({
        fullName: username,
      }).unwrap();

      showToast("success", "Profile updated successfully");
      router.back();
    } catch {
      showToast("error", "Unable to update profile. Please try again.");
    }
  }

  return (
    <ScreenContainer
      scrollable
      avoidKeyboard
      style={styles.container}
      withPadding={false}
    >
      {/* Top Header Background */}
      <LinearGradient
        colors={["#1F2B30", "#1A2128"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.gradientBox}
      >
        <BackHeader title="Edit Profile" />
      </LinearGradient>

      {/* Overlapping Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={["#5ED5A8", "#8B9DFE"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBorder}
          >
            <View style={styles.imageWrapper}>
              <Image
                source={profileImage}
                style={styles.avatar}
                contentFit="cover"
              />
            </View>
          </LinearGradient>
          <BaseTouchableOpacity activeOpacity={0.8} style={styles.cameraButton}>
            <Feather name="camera" size={15} color={Colors.white} />
          </BaseTouchableOpacity>
        </View>
        <Subtitle style={styles.usernameText}>
          {isLoading ? "Loading..." : username || "User"}
        </Subtitle>
      </View>

      <View style={styles.form}>
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

        <View style={styles.inputGroup}>
          <Caption style={styles.label}>Email</Caption>
          <TextInput
            ref={emailInputRef}
            style={[
              styles.underlineInput,
              styles.readOnlyInput,
              focusedField === "email" && styles.readOnlyInput,
            ]}
            value={email}
            editable={false}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={Colors.textSecondary}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Caption style={styles.label}>Password</Caption>
          <TextInput
            ref={passwordInputRef}
            style={[
              styles.underlineInput,
              styles.readOnlyInput,
              focusedField === "password" && styles.readOnlyInput,
            ]}
            value={password}
            editable={false}
            secureTextEntry
            autoCapitalize="none"
            placeholderTextColor={Colors.textSecondary}
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField(null)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Caption style={styles.label}>Mobile Number</Caption>
          <TextInput
            ref={mobileInputRef}
            style={[
              styles.underlineInput,
              styles.readOnlyInput,
              focusedField === "mobile" && styles.readOnlyInput,
            ]}
            value={mobile}
            editable={false}
            keyboardType="phone-pad"
            placeholderTextColor={Colors.textSecondary}
            onFocus={() => setFocusedField("mobile")}
            onBlur={() => setFocusedField(null)}
          />
        </View>
      </View>

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
          isLoading={isUpdating}
          onPress={handleSave}
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
    marginTop: -55, // Pulls the avatar up so it overlaps the border halfway
    marginBottom: 20,
  },
  avatarContainer: {
    width: 110,
    height: 110,
    position: "relative",
    marginBottom: 12,
  },
  gradientBorder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    padding: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  imageWrapper: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: Colors.secondary,
    padding: 2,
    overflow: "hidden",
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
    paddingHorizontal: 24, // Provide horizontal padding since root container no longer has padding
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
  readOnlyInput: {
    opacity: 0.45,
    color: Colors.textSecondary,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 15,
    marginTop: 48,
    marginBottom: 120,
    paddingHorizontal: 24, // Provide horizontal padding since root container no longer has padding
  },
  gradientBox: {
    paddingTop: 16,
    paddingBottom: 100,
    paddingHorizontal: 24,
  },
  cancelBtn: {
    flex: 1,
    paddingHorizontal: 0,
  },
  saveBtn: {
    flex: 1,
    paddingHorizontal: 0,
  },
});
