import Copy2Icon from "@/assets/icons/qr/copy2.svg";
import QrCodeIcon from "@/assets/icons/qr/qrCode.svg";
import SmallCameraIcon from "@/assets/icons/qr/smallCamera.svg";
import { BaseButton, BaseText, BaseTouchableOpacity } from "@/components/ui";
import { Colors } from "@/constants";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";

interface QrModeProps {
  onModeChange: (mode: "scan" | "qr") => void;
  onCopyAddress: () => void;
}

export function QrMode({ onModeChange, onCopyAddress }: QrModeProps) {
  return (
    <View style={styles.qrContentContainer}>
      <LinearGradient
        colors={["#1F2B30", "#1A2128"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={{ paddingVertical: 35 }}
      >
        {/* Currency representation selectors */}
        <View style={styles.badgeRow}>
          <BaseText size="xs" color="#777777" variant="bold">
            USD
          </BaseText>
          <BaseText
            size="xs"
            color="#5ED5A8"
            variant="bold"
            style={styles.badgeSeparator}
          >
            |
          </BaseText>
          <BaseText size="xs" color="#5ED5A8" variant="bold">
            BITS
          </BaseText>
        </View>

        {/* Big balance amount display */}
        <BaseText
          variant="bold"
          size="3xl"
          color="#FFFFFF"
          textAlign="center"
          style={styles.btcValue}
        >
          BTC 40,059.83
        </BaseText>
      </LinearGradient>

      {/* Center Card with QR Code */}
      <View style={styles.qrCardContainer}>
        <BaseText
          variant="bold"
          size="md"
          color="#FFFFFF"
          textAlign="center"
          style={styles.myQrTitle}
        >
          My QR code
        </BaseText>

        <View style={styles.qrWhiteCard}>
          <QrCodeIcon width={258} height={258} />
        </View>
      </View>

      <View style={{ paddingHorizontal: 24 }}>
        {/* Address Copy Row */}
        <BaseText
          variant="medium"
          size="xs"
          color="#777777"
          textAlign="center"
          style={styles.addressLabel}
        >
          ADDRESS
        </BaseText>

        <View style={styles.addressBox}>
          <BaseText
            size="xs"
            color="#FFFFFF"
            numberOfLines={1}
            ellipsizeMode="middle"
            style={styles.addressText}
          >
            n2e5dirgMNYdQskfiP5zj39VYemXareK4C
          </BaseText>

          <BaseTouchableOpacity
            onPress={onCopyAddress}
            style={styles.copyButton}
          >
            <Copy2Icon width={18} height={18} />
          </BaseTouchableOpacity>
        </View>

        {/* Disclaimer text */}
        <BaseText
          size="xs"
          color="#777777"
          textAlign="center"
          style={styles.disclaimer}
        >
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore
        </BaseText>

        {/* Bottom trigger back to scanning */}
        <View style={styles.bottomOutlineButtonContainer}>
          <BaseButton
            title="Scan QR code"
            variant="outline"
            leftIcon={<SmallCameraIcon width={20} height={20} />}
            onPress={() => onModeChange("scan")}
            style={styles.outlineScanBtn}
            textStyle={styles.outlineScanBtnText}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  qrContentContainer: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 100,
    backgroundColor: Colors.secondary,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeSeparator: {
    marginHorizontal: 8,
    opacity: 0.4,
  },
  btcValue: {
    marginTop: 10,
    fontFamily: "NeueMontreal-Bold",
  },
  qrCardContainer: {
    alignItems: "center",
    marginTop: 32,
    marginBottom: 24,
  },
  myQrTitle: {
    marginBottom: 16,
    color: "#C1C7CD",
  },
  qrWhiteCard: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  addressLabel: {
    letterSpacing: 1.5,
    marginBottom: 8,
    alignSelf: "center",
  },
  addressBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 16,
    paddingLeft: 16,
    paddingRight: 6,
    height: 52,
    width: "100%",
    marginBottom: 16,
  },
  addressText: {
    flex: 1,
    paddingRight: 12,
    fontFamily: "NeueMontreal-Regular",
  },
  copyButton: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(94, 213, 168, 0.1)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  disclaimer: {
    lineHeight: 18,
    color: "#777777",
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  bottomOutlineButtonContainer: {
    width: "100%",
    paddingBottom: 20,
  },
  outlineScanBtn: {
    borderColor: "#5ED5A8",
    borderWidth: 1,
    backgroundColor: "transparent",
    width: "100%",
  },
  outlineScanBtnText: {
    color: "#5ED5A8",
  },
});
