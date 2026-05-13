import profileImage from "@/assets/images/avatar.jpg";
import { Colors } from "@/constants";
import { Image } from "expo-image";
import type { Href } from "expo-router";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import type { SvgProps } from "react-native-svg";
import { BaseTouchableOpacity } from "./BaseTouchableOpacity";

export interface HeaderButtonProps {
  icon: React.FC<SvgProps>;
  link: Href;
}

interface UserHeaderProps {
  userButtons: HeaderButtonProps[];
}

const HeaderButton = ({ icon, link }: HeaderButtonProps) => {
  const Icon = icon;

  return (
    <Link href={link} asChild>
      <BaseTouchableOpacity>
        <Icon width={44} height={44} />
      </BaseTouchableOpacity>
    </Link>
  );
};

export const UserHeader = ({ userButtons }: UserHeaderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Image
          source={profileImage}
          style={styles.profile}
          contentFit="cover"
        />
      </View>

      <View style={{ flexDirection: "row", gap: 10 }}>
        {userButtons.map((button, index) => (
          <HeaderButton key={index} {...button} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: Colors.secondary,
  },
  profile: {
    width: 36,
    height: 36,
    borderRadius: 25,
  },
});
