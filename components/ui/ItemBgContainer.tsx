import { Colors } from "@/constants";
import { StyleSheet, View } from "react-native";

export const ItemBgContainer = ({
  paddingVertical = 15,
  paddingHorizontal = 18,
  children,
}: {
  paddingVertical?: number;
  paddingHorizontal?: number;
  children: React.ReactNode;
}) => {
  return (
    <View style={[styles.container, { paddingVertical, paddingHorizontal }]}>
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
