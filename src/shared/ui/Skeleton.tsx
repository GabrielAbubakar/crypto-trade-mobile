import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  interpolate,
} from "react-native-reanimated";

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  backgroundColor?: string;
  style?: any;
}

/**
 * Base Skeleton Loader Component
 * Displays a shimmer animation for loading states
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = 16,
  borderRadius = 4,
  backgroundColor = "rgba(255, 255, 255, 0.1)",
  style,
}) => {
  const shimmerAnim = useSharedValue(0);

  useEffect(() => {
    shimmerAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500 }),
        withTiming(0, { duration: 1500 })
      ),
      -1, // infinite loop
      false // do not reverse, sequence already handles it
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      shimmerAnim.value,
      [0, 0.5, 1],
      [0.3, 1, 0.3]
    );

    return {
      opacity,
      backgroundColor,
      width: width as any,
      height: height as any,
      borderRadius,
    };
  });

  return <Animated.View style={[animatedStyle, style]} />;
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "#E8E8E8",
  },
});
