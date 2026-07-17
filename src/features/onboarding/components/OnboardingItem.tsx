import { Colors } from "@/shared/constants";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { BaseText } from '@/shared/ui';

interface OnboardingItemProps {
  image: React.FC<{ width: number; height: number }>;
  title: string;
  description: string;
}

export const OnboardingItem = ({ item }: { item: OnboardingItemProps }) => {
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.container, { width }]}>
      <View style={styles.imageContainer}>
        <item.image width={width * 0.8} height={369} />
        <LinearGradient
          colors={["transparent", Colors.background]}
          style={styles.gradient}
        />
      </View>
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
  imageContainer: {
    width: "100%",
    alignItems: "center",
    position: "relative",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
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
