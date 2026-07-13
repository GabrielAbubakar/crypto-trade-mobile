import FaceBook from "@/assets/icons/auth/fb.svg";
import Google from "@/assets/icons/auth/tMinusgoogle.svg";
import { Colors } from "@/core/constants";
import React from "react";
import { StyleSheet, View } from "react-native";
import { BaseText } from '@/components/ui';
import { BaseTouchableOpacity } from '@/components/ui';

interface SocialLoginSectionProps {
  label?: string;
}

export const SocialLoginSection: React.FC<SocialLoginSectionProps> = ({
  label = "Or login with",
}) => {
  return (
    <View style={styles.socialSection}>
      <BaseText style={styles.socialLabel}>{label}</BaseText>
      <View style={styles.socialButtons}>
        <BaseTouchableOpacity style={styles.socialButton}>
          <FaceBook width={26} height={26} />
          <BaseText style={styles.socialButtonText}>Facebook</BaseText>
        </BaseTouchableOpacity>
        <BaseTouchableOpacity style={styles.socialButton}>
          <Google width={26} height={26} />
          <BaseText style={styles.socialButtonText}>Google</BaseText>
        </BaseTouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  socialSection: {
    marginTop: 20,
    alignItems: "center",
  },
  socialLabel: {
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  socialButtons: {
    flexDirection: "row",
    gap: 15,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 15,
    flex: 1,
    justifyContent: "center",
  },
  socialButtonText: {
    color: "#000",
    marginLeft: 10,
    fontWeight: "600",
  },
});
