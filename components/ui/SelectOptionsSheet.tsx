import { Colors, FontFamily } from "@/core/constants";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { BaseText } from "./BaseText";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectOptionsSheetProps {
  title: string;
  options: SelectOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  onDismiss?: () => void;
}

export const SelectOptionsSheet = React.forwardRef<
  BottomSheetModal,
  SelectOptionsSheetProps
>(({ title, options, selectedValue, onSelect, onDismiss }, ref) => {
  const snapPoints = useMemo(() => ["45%", "70%"], []);

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      onDismiss={onDismiss}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.sheetHandle}
      maxDynamicContentSize={400}
    >
      <BottomSheetScrollView
        style={styles.sheetContainer}
        contentContainerStyle={styles.optionsContainer}
        showsVerticalScrollIndicator={false}
      >
        <BaseText style={styles.sheetTitle}>{title}</BaseText>
        {options.map((option) => {
          const isActive =
            selectedValue.toUpperCase() === option.value.toUpperCase();
          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => onSelect(option.value)}
              style={[
                styles.optionButton,
                isActive && styles.optionButtonActive,
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.optionTextContainer}>
                <BaseText
                  style={[
                    styles.optionText,
                    isActive && styles.optionTextActive,
                  ]}
                >
                  {option.value}
                </BaseText>
                {option.label ? (
                  <BaseText style={styles.optionSubtext}>
                    {option.label}
                  </BaseText>
                ) : null}
              </View>
              {isActive && (
                <Ionicons name="checkmark" size={20} color={Colors.primary} />
              )}
            </TouchableOpacity>
          );
        })}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

SelectOptionsSheet.displayName = "SelectOptionsSheet";

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: Colors.secondary,
  },
  sheetHandle: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    width: 60,
    height: 4,
  },
  sheetContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: Colors.secondary,
    flex: 1,
  },
  sheetTitle: {
    fontSize: 18,
    color: Colors.white,
    fontFamily: FontFamily.bold,
    marginBottom: 20,
    textAlign: "center",
  },
  optionsContainer: {
    gap: 12,
    paddingBottom: 20,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  optionButtonActive: {
    backgroundColor: "rgba(94, 213, 168, 0.08)",
    borderColor: "rgba(94, 213, 168, 0.3)",
  },
  optionTextContainer: {
    flexDirection: "column",
    gap: 2,
  },
  optionText: {
    fontSize: 16,
    color: Colors.white,
    fontFamily: FontFamily.bold,
  },
  optionTextActive: {
    color: Colors.primary,
  },
  optionSubtext: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: FontFamily.regular,
  },
});
