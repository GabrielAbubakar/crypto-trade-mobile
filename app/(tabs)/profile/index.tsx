import profileImage from "@/assets/images/avatar.jpg";
import { BackHeader, MenuItem, ScreenContainer } from "@/components";
import { Title } from "@/components/ui/BaseText";
import { Colors } from "@/constants";
import { useGetProfileQuery } from "@/store";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
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
      pathname: "/profile/edit",
      params: { focusField: field },
    });
  };

  return (
    <ScreenContainer style={styles.container} withPadding={false}>
      {/* Top Header Background */}
      <LinearGradient
        colors={["#1F2B30", "#1A2128"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.gradientBox}
      >
        <BackHeader title="Profile" />
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
    marginTop: -55, // Pulls the avatar up so it overlaps the border halfway
    marginBottom: 20,
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
    backgroundColor: Colors.white,
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
    paddingHorizontal: 24,
  },
  gradientBox: {
    paddingTop: 16,
    paddingBottom: 100,
    paddingHorizontal: 24,
  },
});
