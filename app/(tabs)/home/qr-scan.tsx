import NotificationIcon from "@/assets/icons/main/notification.svg";
import QrIcon from "@/assets/icons/main/scanner.svg";
import SearchIcon from "@/assets/icons/main/search.svg";
import { BaseText, ScreenContainer, UserHeader } from "@/components/ui";
import { QrMode, ScanMode } from "@/features/home/components";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

const headerButtons = [
  {
    link: "/home/search",
    icon: SearchIcon,
  },
  {
    link: "/home/qr-scan",
    icon: QrIcon,
  },
  {
    link: "/home/notifications",
    icon: NotificationIcon,
  },
] as const;

export default function QrScanScreen() {
  const [mode, setMode] = useState<"scan" | "qr">("scan");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText("n2e5dirgMNYdQskfiP5zj39VYemXareK4C");
      }
    } catch (err) {
      // safe fallback if clipboard API is restricted
    }
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <ScreenContainer withPadding={false} scrollable={mode === "qr"}>
      {/* Universal user profile header */}
      <UserHeader userButtons={headerButtons as any} />

      {mode === "scan" ? (
        <ScanMode onModeChange={setMode} />
      ) : (
        <QrMode onModeChange={setMode} onCopyAddress={handleCopy} />
      )}

      {/* Elegant Toast notification when copied */}
      {copied && (
        <View style={styles.toast}>
          <BaseText variant="bold" size="sm" color="#1B232A">
            Address copied!
          </BaseText>
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    backgroundColor: "#5ED5A8",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
    zIndex: 9999,
  },
});
