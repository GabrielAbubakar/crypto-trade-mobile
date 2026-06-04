import { BackHeader, BaseButton, ScreenContainer } from "@/components";
import { BaseText } from "@/components/ui/BaseText";
import { Colors } from "@/constants";
import { showSuccessToast } from "@/utils";
import React, { useState } from "react";
import { StyleSheet, View, Clipboard } from "react-native";

export default function RecoveryCodesScreen() {
  const initialCodes = [
    "CRT-2800", "CRT-2837",
    "CRT-3074", "CRT-3211",
    "CRT-3348", "CRT-3485",
    "CRT-3622", "CRT-3759"
  ];
  const [codes, setCodes] = useState(initialCodes);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerate = () => {
    setIsRegenerating(true);
    // Generate new random codes
    setTimeout(() => {
      const newCodes = Array.from({ length: 8 }).map(() => {
        const rand = Math.floor(1000 + Math.random() * 9000);
        return `CRT-${rand}`;
      });
      setCodes(newCodes);
      setIsRegenerating(false);
      showSuccessToast("Backup recovery codes regenerated!");
    }, 1000);
  };

  const handleCopyAll = () => {
    Clipboard.setString(codes.join("\n"));
    showSuccessToast("All recovery codes copied to clipboard!");
  };

  return (
    <ScreenContainer style={styles.container} withPadding={true}>
      <BackHeader title="Recovery codes" />

      <BaseText color="#8594A6" style={styles.subtitle}>
        Save these once. Each code can only be used one time.
      </BaseText>

      {/* Grid of Codes */}
      <View style={styles.grid}>
        {codes.map((code, index) => (
          <View key={index} style={styles.codeCard}>
            <BaseText variant="bold" color="#FFFFFF" style={styles.codeText}>
              {code}
            </BaseText>
          </View>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <BaseButton
          title="Copy codes"
          onPress={handleCopyAll}
          style={styles.copyButton}
        />
        <BaseButton
          title="Regenerate codes"
          variant="secondary"
          onPress={handleRegenerate}
          isLoading={isRegenerating}
          style={styles.regenerateButton}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondary,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 32,
    lineHeight: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 40,
  },
  codeCard: {
    width: "47%",
    backgroundColor: "#141820",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  codeText: {
    fontSize: 15,
    letterSpacing: 0.5,
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 40,
  },
  copyButton: {
    width: "100%",
  },
  regenerateButton: {
    width: "100%",
  },
});
