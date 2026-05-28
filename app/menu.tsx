import CopyIcon from "@/assets/icons/home/copy.svg";
import profileImage from "@/assets/images/avatar.jpg";
import {
  BackHeader,
  BaseButton,
  BaseTouchableOpacity,
  MenuGridItem,
  ScreenContainer,
} from "@/components";
import { Body, Subtitle, Title } from "@/components/ui/BaseText";
import {
  Colors,
  COMMON_MENU_ITEMS,
  FINANCE_MENU_ITEMS,
  TRADE_MENU_ITEMS,
} from "@/constants";
import { useGetProfileQuery } from "@/store";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function MenuScreen() {
  const router = useRouter();
  const { data, isLoading } = useGetProfileQuery();

  return (
    <ScreenContainer scrollable withPadding={false}>
      <LinearGradient
        colors={["#1F2B30", "#1A2128"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.gradientBox}
      >
        <BackHeader title="Menu" />
        {isLoading ? (
          <Body>Loading profile...</Body>
        ) : (
          <View style={styles.profileSection}>
            <BaseTouchableOpacity
              style={styles.userInfo}
              onPress={() => router.push("/profile")}
            >
              <Image source={profileImage} style={styles.avatar} />
              <View style={styles.userDetails}>
                <Title style={styles.username}>{data?.fullName}</Title>
                <View style={styles.idContainer}>
                  <Body size="xs" color={Colors.textSecondary}>
                    {data?.phone}
                  </Body>
                  <CopyIcon width={14} height={14} style={styles.copyIcon} />
                </View>
              </View>
            </BaseTouchableOpacity>

            <BaseButton
              title="Settings"
              variant="primary"
              size="small"
              onPress={() => router.push("/settings")}
              style={styles.editButton}
            />
          </View>
        )}
      </LinearGradient>

      <Section title="Common">
        <View style={styles.grid}>
          {COMMON_MENU_ITEMS.map((item) => (
            <MenuGridItem key={item.label} {...item} />
          ))}
        </View>
      </Section>

      <Section title="Trade">
        <View style={styles.grid}>
          {TRADE_MENU_ITEMS.map((item) => (
            <MenuGridItem key={item.label} {...item} />
          ))}
        </View>
      </Section>

      <Section title="Finance">
        <View style={styles.grid}>
          {FINANCE_MENU_ITEMS.map((item) => (
            <MenuGridItem key={item.label} {...item} />
          ))}
        </View>
      </Section>
    </ScreenContainer>
  );
}

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View style={styles.section}>
    <Subtitle style={styles.sectionTitle}>{title}</Subtitle>
    {children}
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  gradientBox: {
    paddingBottom: 14,
    marginBottom: 25,
    paddingHorizontal: 20,
    gap: 16,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  userDetails: {
    gap: 2,
  },
  username: {
    fontSize: 18,
  },
  idContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  copyIcon: {
    opacity: 0.6,
  },
  editButton: {
    minWidth: 100,
    height: 36,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: Colors.textSecondary,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
