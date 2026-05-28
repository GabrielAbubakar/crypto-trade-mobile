import profileImage from "@/assets/images/avatar.jpg";
import { BackHeader, MenuItem, ScreenContainer } from "@/components";
import { Title } from "@/components/ui/BaseText";
import { Colors } from "@/constants";
import { useGetProfileQuery } from "@/store";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const { data, isLoading } = useGetProfileQuery();

  const handleFieldEdit = (
    field: "username" | "email" | "mobile" | "password",
  ) => {
    router.push({
      pathname: "/edit-profile",
      params: { focusField: field },
    });
  };

  return (
    <ScreenContainer scrollable style={styles.container}>
      <BackHeader title="Profile" />

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.imageWrapper}>
            <Image
              source={profileImage}
              style={styles.avatar}
              contentFit="cover"
            />
          </View>
        </View>
        <Title variant="bold" style={styles.username}>
          {isLoading ? "Loading..." : data?.fullName}
        </Title>
      </View>

      {/* Profile Details List */}
      <View style={styles.menuList}>
        <MenuItem
          label="Username"
          value={isLoading ? "Loading..." : data?.fullName}
          onPress={() => handleFieldEdit("username")}
        />
        <MenuItem
          label="Email"
          value={isLoading ? "Loading..." : data?.email}
          onPress={() => handleFieldEdit("email")}
        />
        <MenuItem
          label="Mobile Number"
          value={isLoading ? "Loading..." : data?.phone}
          onPress={() => handleFieldEdit("mobile")}
        />
        <MenuItem
          label="Password"
          value="••••••••"
          onPress={() => handleFieldEdit("password")}
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
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  avatarContainer: {
    marginBottom: 16,
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
  username: {
    color: Colors.textPrimary,
    fontSize: 20,
  },
  menuList: {
    marginTop: 10,
  },
});
