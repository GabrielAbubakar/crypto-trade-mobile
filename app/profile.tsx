import profileImage from "@/assets/images/avatar.jpg";
import { BackHeader, MenuItem, ScreenContainer } from "@/components";
import { Colors } from "@/constants";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Header, Title } from "@/components/ui/BaseText";

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <BackHeader title="Profile" />
      
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={["#5ED5A8", "#1B232A"]}
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
        <Title style={styles.username}>User1234</Title>
      </View>

      <View style={styles.menuList}>
        <MenuItem
          label="Username"
          value="Username1234"
          onPress={() => router.push("/edit-profile")}
        />
        <MenuItem
          label="Email"
          value="example@mail.com"
          onPress={() => router.push("/edit-profile")}
        />
        <MenuItem
          label="Mobile Number"
          value="+1 234 567 8900"
          onPress={() => router.push("/edit-profile")}
        />
        <MenuItem
          label="Password"
          value="********"
          onPress={() => router.push("/edit-profile")}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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
