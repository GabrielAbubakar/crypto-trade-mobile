import { BaseText } from "@/shared/ui";
import React from "react";
import { StyleSheet, View } from "react-native";

interface AuthFormProps {
  title: string;
}

export default function AuthForm({ title }: AuthFormProps) {
  return (
    <View>
      <BaseText style={styles.title}>{title}</BaseText>
    </View>
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
