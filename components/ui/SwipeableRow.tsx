import { Colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
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
        translateX.value = withSpring(-BUTTON_WIDTH, { damping: 18, stiffness: 120 });
      } else if (translateX.value > BUTTON_WIDTH / 2) {
        translateX.value = withSpring(BUTTON_WIDTH, { damping: 18, stiffness: 120 });
      } else {
        translateX.value = withSpring(0, { damping: 18, stiffness: 120 });
      }
    });

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

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
    translateX.value = withSpring(0, { damping: 18, stiffness: 120 });
  };

  const handleEditPress = () => {
    closeRow();
    onEdit();
  };

  const handleDeletePress = () => {
    closeRow();
    onDelete();
  };

  return (
    <View style={styles.container}>
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
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
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
