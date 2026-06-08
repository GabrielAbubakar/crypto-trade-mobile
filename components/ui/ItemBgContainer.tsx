import { Colors } from "@/constants";
import type { ViewProps } from "react-native";
import { StyleSheet, View } from "react-native";

export const ItemBgContainer = ({
  paddingVertical = 15,
  paddingHorizontal = 18,
  style,
  children,
}: {
  paddingVertical?: number;
  paddingHorizontal?: number;
  style?: ViewProps["style"];
  children: React.ReactNode;
}) => {
  return (
    <View
      style={[styles.container, { paddingVertical, paddingHorizontal }, style]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
  },
});
