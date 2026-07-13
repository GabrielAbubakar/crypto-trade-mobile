import LargeCameraIcon from "@/assets/icons/qr/camera.svg";
import QrCode1Icon from "@/assets/icons/qr/qr-code1.svg";
import SmallCameraIcon from "@/assets/icons/qr/smallCamera.svg";
import { BaseButton, BaseText } from "@/components/ui";
import { Colors } from "@/core/constants";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

interface ScanModeProps {
  onModeChange: (mode: "scan" | "qr") => void;
}

export function ScanMode({ onModeChange }: ScanModeProps) {
  return (
    <View style={styles.scanContentContainer}>
      {/* Header instructions block */}
      <View style={styles.scanTitleRow}>
        <View style={styles.scanIndicatorWrapper}>
          <SmallCameraIcon />
        </View>
        <BaseText variant="bold" size="lg" color="#FFFFFF">
          Scan QR code
        </BaseText>
      </View>

      <BaseText
        size="sm"
        color="#A0A5AD"
        textAlign="center"
        style={styles.scanSubtitle}
      >
        Scan the QR code and it automatically recognize it.
      </BaseText>

      {/* Centered Camera viewport */}
      <View style={styles.viewportContainer}>
        {/* Viewfinder corner lines */}
        <View style={[styles.corner, styles.topLeft]} />
        <View style={[styles.corner, styles.topRight]} />
        <View style={[styles.corner, styles.bottomLeft]} />
        <View style={[styles.corner, styles.bottomRight]} />

        {/* Central camera illustration overlay */}
        <LargeCameraIcon width={182} height={182} style={styles.largeCamera} />
      </View>

      {/* Action trigger buttons */}
      <View style={styles.actionBlock}>
        <BaseButton
          title="Show QR code"
          variant="primary"
          leftIcon={<QrCode1Icon width={22} height={22} fill="#1B232A" />}
          onPress={() => onModeChange("qr")}
          style={styles.showQrButton}
        />

        <BaseButton
          title="Cancel"
          style={styles.cancelButton}
          textStyle={styles.cancelButtonText}
          onPress={() => router.back()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scanContentContainer: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 100,
    paddingHorizontal: 24,
    backgroundColor: Colors.secondary,
  },
  scanTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  scanIndicatorWrapper: {
    width: 22,
    height: 22,
  },
  scanSubtitle: {
    marginTop: 8,
    lineHeight: 18,
    maxWidth: "80%",
    alignSelf: "center",
    marginBottom: 30,
  },
  viewportContainer: {
    aspectRatio: 1,
    width: "100%",
    backgroundColor: "#161C22",
    borderColor: "rgba(255, 255, 255, 0.04)",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  corner: {
    position: "absolute",
    width: 28,
    height: 28,
    borderColor: "#FFFFFF",
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 4,
  },
  largeCamera: {},
  actionBlock: {
    gap: 16,
  },
  showQrButton: {
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    width: "100%",
  },
  cancelButtonText: {
    color: "#A0A5AD",
  },
});
