import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

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
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 1, 0.3],
  });

  return (
    <Animated.View
      style={[
        {
          backgroundColor,
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "#E8E8E8",
  },
});
