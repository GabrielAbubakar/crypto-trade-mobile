import { Colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  FadeOutRight,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { BaseText } from "./BaseText";
import { BaseTouchableOpacity } from "./BaseTouchableOpacity";

interface SwipeableRowProps {
  children: React.ReactNode;
  onEdit: () => void;
  onDelete: () => void;
}

export const SwipeableRow: React.FC<SwipeableRowProps> = ({
  children,
  onEdit,
  onDelete,
}) => {
  const translateX = useSharedValue(0);
  const BUTTON_WIDTH = 80;

  const SPRING_CONFIG = {
    damping: 20,
    stiffness: 100,
    overshootClamping: true,
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10]) // Cancel gesture if moving vertically
    .onChange((event) => {
      const nextX = translateX.value + event.changeX;
      // Clamp between -BUTTON_WIDTH (delete on right) and BUTTON_WIDTH (edit on left)
      translateX.value = Math.max(-BUTTON_WIDTH, Math.min(BUTTON_WIDTH, nextX));
    })
    .onEnd(() => {
      if (translateX.value < -BUTTON_WIDTH / 2) {
        translateX.value = withSpring(-BUTTON_WIDTH, SPRING_CONFIG);
      } else if (translateX.value > BUTTON_WIDTH / 2) {
        translateX.value = withSpring(BUTTON_WIDTH, SPRING_CONFIG);
      } else {
        translateX.value = withSpring(0, SPRING_CONFIG);
      }
    });

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const rCardStyle = useAnimatedStyle(() => {
    const progress = Math.min(1, Math.abs(translateX.value) / BUTTON_WIDTH);
    const borderRadius = 20 * (1 - progress);
    return {
      borderRadius,
    };
  });

  const rLeftBtnStyle = useAnimatedStyle(() => {
    const opacity = translateX.value > 0 ? translateX.value / BUTTON_WIDTH : 0;
    const scale = translateX.value > 0 ? Math.min(1, translateX.value / BUTTON_WIDTH) : 0.6;
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  const rRightBtnStyle = useAnimatedStyle(() => {
    const opacity = translateX.value < 0 ? -translateX.value / BUTTON_WIDTH : 0;
    const scale = translateX.value < 0 ? Math.min(1, -translateX.value / BUTTON_WIDTH) : 0.6;
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  const closeRow = () => {
    "worklet";
    translateX.value = withSpring(0, SPRING_CONFIG);
  };

  const handleEditPress = () => {
    closeRow();
    onEdit();
  };

  const handleDeletePress = () => {
    closeRow();
    onDelete();
  };

  const animatedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const element = child as React.ReactElement<any>;
      return React.cloneElement(element, {
        style: [element.props.style, rCardStyle],
      });
    }
    return child;
  });

  return (
    <Animated.View
      layout={LinearTransition}
      exiting={FadeOutRight.duration(500)}
      style={styles.container}>
      {/* Background/Underlay view holding edit and delete buttons */}
      <View style={styles.underlay}>
        {/* Edit Button Area (Left side) */}
        <View style={styles.leftBtnContainer}>
          <Animated.View style={[styles.animatedBtnWrapper, rLeftBtnStyle]}>
            <BaseTouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={handleEditPress}
            >
              <Ionicons name="pencil-outline" size={20} color={Colors.white} />
              <BaseText variant="bold" size="xs" color={Colors.white} style={styles.btnText}>
                Edit
              </BaseText>
            </BaseTouchableOpacity>
          </Animated.View>
        </View>

        {/* Delete Button Area (Right side) */}
        <View style={styles.rightBtnContainer}>
          <Animated.View style={[styles.animatedBtnWrapper, rRightBtnStyle]}>
            <BaseTouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={handleDeletePress}
            >
              <Ionicons name="trash-outline" size={20} color={Colors.white} />
              <BaseText variant="bold" size="xs" color={Colors.white} style={styles.btnText}>
                Delete
              </BaseText>
            </BaseTouchableOpacity>
          </Animated.View>
        </View>
      </View>

      {/* Foreground view with the gesture detector and the option card */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.foreground, rStyle]}>
          {animatedChildren}
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  underlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 20,
    overflow: "hidden",
  },
  leftBtnContainer: {
    width: 80,
    height: "100%",
  },
  rightBtnContainer: {
    width: 80,
    height: "100%",
  },
  animatedBtnWrapper: {
    width: "100%",
    height: "100%",
  },
  actionButton: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  deleteButton: {
    backgroundColor: Colors.error,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  btnText: {
    marginTop: 4,
  },
  foreground: {
    zIndex: 1,
  },
});
