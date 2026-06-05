import profileImage from "@/assets/images/avatar.jpg";
import {
  BackHeader,
  BaseButton,
  ProfileOptionCard,
  ScreenContainer,
} from "@/components";
import { BaseText, Title } from "@/components/ui/BaseText";
import { Colors } from "@/constants";
import {
  logout,
  useAppDispatch,
  useGetNotificationsQuery,
  useGetPriceAlertsQuery,
  useGetProfileQuery,
} from "@/store";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data, isLoading } = useGetProfileQuery();
  const { data: alerts } = useGetPriceAlertsQuery();
  const { data: notificationsData } = useGetNotificationsQuery();

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/(auth)");
  };

  const activeAlertsCount = alerts?.filter((a) => a.isActive).length ?? 0;
  const unreadNotificationsCount =
    notificationsData?.data?.filter((n: any) => !n.isRead).length ?? 0;

  return (
    <ScreenContainer style={styles.container} scrollable withPadding={false}>
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
        <BaseText color={Colors.textSecondary} style={{ marginBottom: 8 }}>
          {data?.email}
        </BaseText>
        <BaseText
          color={Colors.primary}
          size="xs"
          style={{
            paddingVertical: 4,
            paddingHorizontal: 16,
            borderRadius: 20,
            backgroundColor: "#23362F",
          }}
        >
          {data?.emailVerified ? "Verified" : "Not Verified"}
        </BaseText>
      </View>

      {/* Profile Options Cards List */}
      <View style={styles.menuList}>
        <ProfileOptionCard
          title="Edit profile"
          description="Name, email, phone"
          icon={<Ionicons name="person-outline" size={20} color="#5ED5A8" />}
          onPress={() => router.push("/profile/edit")}
        />
        <ProfileOptionCard
          title="Security"
          description="2FA, PIN, recovery codes"
          icon={
            <Ionicons name="lock-closed-outline" size={20} color="#5ED5A8" />
          }
          onPress={() => router.push("/profile/security")}
        />
        <ProfileOptionCard
          title="Price alerts"
          description={`${activeAlertsCount} active alerts`}
          icon={
            <Ionicons name="notifications-outline" size={20} color="#5ED5A8" />
          }
          value={activeAlertsCount.toString()}
          onPress={() => router.push("/profile/price-alerts")}
        />
        <ProfileOptionCard
          title="Notifications"
          description={`${unreadNotificationsCount} unread messages`}
          icon={
            <Ionicons name="chatbubble-outline" size={20} color="#5ED5A8" />
          }
          value={unreadNotificationsCount.toString()}
          onPress={() => router.push("/profile/notifications")}
        />
        <ProfileOptionCard
          title="Watchlist"
          description={
            data?.watchlist?.length ? data.watchlist.join(", ") : "None"
          }
          icon={<Ionicons name="star-outline" size={20} color="#5ED5A8" />}
          onPress={() => router.push("/profile/watchlist")}
        />

        <BaseButton
          title="Logout"
          variant="cancel"
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondary,
    paddingBottom: 80,
  },
  profileSection: {
    alignItems: "center",
    marginTop: -55,
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
    paddingBottom: 40,
  },
  gradientBox: {
    paddingTop: 16,
    paddingBottom: 100,
    paddingHorizontal: 24,
  },
  logoutButton: {
    marginTop: 20,
    width: "100%",
  },
});
