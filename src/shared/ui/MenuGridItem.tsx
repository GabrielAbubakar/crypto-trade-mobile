import React from "react";
import { StyleSheet, View } from "react-native";
import type { SvgProps } from "react-native-svg";
import { Body } from "./BaseText";
import { BaseTouchableOpacity } from "./BaseTouchableOpacity";

interface MenuGridItemProps {
  label: string;
  Icon: React.FC<SvgProps>;
  onPress?: () => void;
}

export const MenuGridItem: React.FC<MenuGridItemProps> = ({
  label,
  Icon,
  onPress,
}) => {
  return (
    <BaseTouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.iconWrapper}>
        <Icon width={36} height={36} />
      </View>
      <Body size="xs" color="#C1C7CD" textAlign="center" style={styles.label}>
        {label}
      </Body>
    </BaseTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "25%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  iconWrapper: {
    // marginBottom: 8,
    // Optional: Add glow effect if needed
  },
  label: {
    marginTop: 4,
  },
});
