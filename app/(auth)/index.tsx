import { BaseText, ScreenContainer } from "@/components";
import React from "react";
import { StyleSheet } from "react-native";

export default function AuthIndexScreen() {
  return (
    <ScreenContainer>
      <BaseText style={styles.title}>Signin</BaseText>
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
