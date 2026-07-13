import { Colors } from "@/core/constants";
import React from "react";
import type { ViewStyle } from "react-native";
import { Modal, Pressable, StyleSheet, View } from "react-native";

interface BaseModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  animationType?: "none" | "slide" | "fade";
  transparent?: boolean;
  modalStyle?: ViewStyle;
  contentStyle?: ViewStyle;
}

export const BaseModal: React.FC<BaseModalProps> = ({
  visible,
  onClose,
  children,
  animationType = "fade",
  transparent = true,
  modalStyle,
  contentStyle,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={transparent}
      animationType={animationType}
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={[styles.modal, modalStyle]}>
          <View style={[styles.content, contentStyle]}>{children}</View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modal: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: Colors.secondary,
    borderRadius: 24,
    overflow: "hidden",
  },
  content: {
    padding: 24,
  },
});
