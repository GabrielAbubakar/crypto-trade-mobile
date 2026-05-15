import profileImage from "@/assets/images/avatar.jpg";
import { BackHeader, BaseButton, ScreenContainer } from "@/components";
import { Caption, Subtitle } from "@/components/ui/BaseText";
import { BaseTouchableOpacity } from "@/components/ui/BaseTouchableOpacity";
import { Colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

export default function EditProfileScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("User1234");
  const [email, setEmail] = useState("Example@mail.com");
  const [password, setPassword] = useState("************");
  const [mobile, setMobile] = useState("+1 234 567 8900");

  return (
    <ScreenContainer scrollable>
      <BackHeader title="Edit Profile" />

      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Image
            source={profileImage}
            style={styles.avatar}
            contentFit="cover"
          />
          <BaseTouchableOpacity style={styles.cameraButton}>
            <Ionicons name="camera-outline" size={18} color={Colors.white} />
          </BaseTouchableOpacity>
        </View>
        <Subtitle style={styles.usernameText}>User1234</Subtitle>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Caption style={styles.label}>Username</Caption>
          <TextInput
            style={styles.underlineInput}
            value={username}
            onChangeText={setUsername}
            placeholderTextColor={Colors.textSecondary}
          />
        </View>

        <View style={styles.inputGroup}>
          <Caption style={styles.label}>Email</Caption>
          <TextInput
            style={styles.underlineInput}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor={Colors.textSecondary}
          />
        </View>

        <View style={styles.inputGroup}>
          <Caption style={styles.label}>Password</Caption>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={[styles.underlineInput, { flex: 1 }]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor={Colors.textSecondary}
            />
            <Ionicons name="eye-off-outline" size={20} color={Colors.white} />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Caption style={styles.label}>Mobile Number</Caption>
          <TextInput
            style={styles.underlineInput}
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
            placeholderTextColor={Colors.textSecondary}
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <BaseButton
          title="Cancel"
          variant="secondary"
          style={styles.button}
          onPress={() => router.back()}
        />
        <BaseButton
          title="Save Changes"
          variant="primary"
          style={styles.button}
          onPress={() => router.back()}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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
    bottom: 0,
    right: 0,
    backgroundColor: Colors.white,
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
  },
  form: {
    paddingTop: 10,
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    color: Colors.textSecondary,
  },
  underlineInput: {
    color: Colors.textPrimary,
    fontSize: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.textSecondary,
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 15,
    marginTop: 40,
    marginBottom: 20,
  },
  button: {
    flex: 1,
  },
});
