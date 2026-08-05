import { Colors } from "@/shared/constants";
import React from "react";
import type {
    StyleProp,
    TextInputProps,
    ViewStyle
} from "react-native";
import {
    StyleSheet,
    TextInput,
    View
} from "react-native";
import { BaseText } from "./BaseText";

interface BaseInputProps extends TextInputProps {
  rightIcon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  error?: string;
}

export const BaseInput = React.forwardRef<TextInput, BaseInputProps>(
  ({ rightIcon, containerStyle, style, error, ...props }, ref) => {
    return (
      <View style={styles.wrapper}>
        <View
          style={[
            styles.container,
            error ? styles.containerError : null,
            containerStyle,
          ]}
        >
          <TextInput
            ref={ref}
            style={[styles.input, style]}
            placeholderTextColor={Colors.textSecondary}
            {...props}
            value={props.value ?? ""}
          />
          {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
        </View>
        {error ? <BaseText style={styles.errorText}>{error}</BaseText> : null}
      </View>
    );
  },
);

BaseInput.displayName = "BaseInput";

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F3F7",
    borderRadius: 15,
    paddingHorizontal: 20,
    height: 63,
    borderWidth: 1,
    borderColor: "transparent",
  },
  containerError: {
    borderColor: Colors.error,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  iconContainer: {
    marginLeft: 10,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
