import { BaseText } from "@/components/ui/BaseText";
import { Colors, FontFamily } from "@/core/constants";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import type { StyleProp, ViewStyle } from "react-native";
import {
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";


interface TradeInputCardProps {
  label: string;
  assetSymbol: string;
  isAssetClickable?: boolean;
  onAssetPress?: () => void;
  input: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

export const TradeInputCard: React.FC<TradeInputCardProps> = ({
  label,
  assetSymbol,
  isAssetClickable = false,
  onAssetPress,
  input,
  containerStyle,
}) => {
  return (
    <View style={[styles.inputCard, containerStyle]}>
      <View style={styles.row}>
        <View style={styles.inputCol}>
          <BaseText style={styles.inputLabel}>{label}</BaseText>
          {input}
        </View>

        {isAssetClickable ? (
          <TouchableOpacity
            style={styles.assetSelector}
            onPress={onAssetPress}
            activeOpacity={0.7}
          >
            <View style={styles.assetSelectorInner}>
              <BaseText variant="bold" style={styles.assetText}>
                {assetSymbol}
              </BaseText>
              <Ionicons name="chevron-down" size={16} color={Colors.white} />
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.assetSelector}>
            <BaseText variant="bold" style={styles.assetText}>
              {assetSymbol}
            </BaseText>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.04)",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputCol: {
    flex: 1,
  },
  inputLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginBottom: 4,
  },
  assetSelector: {
    backgroundColor: "#161C22",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    marginLeft: 10,
  },
  assetSelectorInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  assetText: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: FontFamily.bold,
  },
});
