import { Colors } from "@/constants";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { BaseText } from "../ui";

interface OnboardingItemProps {
  image: React.FC<{ width: number; height: number }>;
  title: string;
  description: string;
}

export const OnboardingItem = ({ item }: { item: OnboardingItemProps }) => {
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.container, { width }]}>
      <item.image width={width * 0.8} height={369} />
      <BaseText style={styles.title}>{item.title}</BaseText>
      <BaseText style={styles.description}>{item.description}</BaseText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    color: Colors.textPrimary,
    marginTop: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: Colors.textTertiary,
    marginTop: 20,
    textAlign: "center",
  },
});
