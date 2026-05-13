import React from "react";
import { ScreenContainer, BaseText } from "@/components";
import { StyleSheet } from "react-native";

export default function WalletsScreen() {
  return (
    <ScreenContainer>
      <BaseText style={styles.title}>Wallets</BaseText>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: 20,
  },
});
