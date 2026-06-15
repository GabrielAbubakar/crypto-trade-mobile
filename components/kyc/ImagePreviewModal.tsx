import { BaseModal, BaseText } from "@/components/ui";
import { Colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface ImagePreviewModalProps {
  visible: boolean;
  onClose: () => void;
  imageUrl?: string;
  title?: string;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  visible,
  onClose,
  imageUrl,
  title,
}) => {
  return (
    <BaseModal visible={visible} onClose={onClose}>
      <View style={styles.modalHeader}>
        <BaseText variant="bold" style={styles.modalTitle}>
          {title}
        </BaseText>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>
      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={styles.previewImage}
          contentFit="contain"
        />
      )}
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    color: Colors.white,
  },
  closeButton: {
    padding: 4,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
  },
  previewImage: {
    width: "100%",
    height: 300,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
});
