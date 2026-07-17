import { BaseButton } from "@/shared/ui/BaseButton";
import { BaseText } from "@/shared/ui/BaseText";
import { Colors } from "@/shared/constants";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useEffect, useMemo, useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface TradeActionSheetProps {
  visible: boolean;
  tradeSide: "buy" | "sell";
  availableBalance: string;
  activeOrderType: string;
  price: string;
  quantity: string;
  selectedPercent: number;
  total: string;
  onClose: () => void;
  onOrderTypeChange: (value: string) => void;
  onPercentChange: (percent: number) => void;
  onConfirm: () => void;
}

export const TradeActionSheet: React.FC<TradeActionSheetProps> = ({
  visible,
  tradeSide,
  availableBalance,
  activeOrderType,
  price,
  quantity,
  selectedPercent,
  total,
  onClose,
  onOrderTypeChange,
  onPercentChange,
  onConfirm,
}) => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["85%"], []);
  const percentOptions = [25, 50, 75, 100];
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (!visible) return;
    }
    if (visible) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [visible]);

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      onDismiss={onClose}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.sheetHandle}
    >
      <BottomSheetView style={styles.sheetContainer}>
        <View style={styles.sheetHeaderRow}>
          <View>
            <BaseText variant="bold" style={styles.sheetTitle}>
              {tradeSide === "buy" ? "Buy" : "Sell"}
            </BaseText>
            <BaseText style={styles.sheetSubtitle}>
              AVAILABLE: {availableBalance} BUSD
            </BaseText>
          </View>
          <Pressable style={styles.sheetActionButton} onPress={onClose}>
            <BaseText style={styles.sheetActionButtonText}>+</BaseText>
          </Pressable>
        </View>

        <View style={styles.orderTypeRow}>
          {[
            { label: "Limit", value: "Limit" },
            { label: "Market", value: "Market" },
            { label: "Stop Limit", value: "Stop Limit" },
          ].map((option) => {
            const selected = activeOrderType === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => onOrderTypeChange(option.value)}
                style={
                  selected
                    ? [styles.orderTypeButton, styles.orderTypeButtonActive]
                    : styles.orderTypeButton
                }
              >
                <BaseText
                  style={
                    selected ? styles.orderTypeTextActive : styles.orderTypeText
                  }
                >
                  {option.label}
                </BaseText>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.fieldRow}>
          <BaseText style={styles.fieldLabel}>Price:</BaseText>
          <View style={styles.fieldControl}>
            <BaseText style={styles.fieldValue}>{price}</BaseText>
            <View style={styles.controlButtons}>
              <Pressable style={styles.controlButton}>
                <BaseText style={styles.controlButtonText}>+</BaseText>
              </Pressable>
              <Pressable style={styles.controlButton}>
                <BaseText style={styles.controlButtonText}>-</BaseText>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.fieldRow}>
          <BaseText style={styles.fieldLabel}>Quantity</BaseText>
          <View style={styles.fieldControl}>
            <BaseText style={styles.fieldValue}>{quantity}</BaseText>
            <View style={styles.controlButtons}>
              <Pressable style={styles.controlButton}>
                <BaseText style={styles.controlButtonText}>+</BaseText>
              </Pressable>
              <Pressable style={styles.controlButton}>
                <BaseText style={styles.controlButtonText}>-</BaseText>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.percentRow}>
          {percentOptions.map((percent) => {
            const active = selectedPercent === percent;
            return (
              <Pressable
                key={percent}
                onPress={() => onPercentChange(percent)}
                style={
                  active
                    ? [styles.percentButton, styles.percentButtonActive]
                    : styles.percentButton
                }
              >
                <BaseText
                  style={active ? styles.percentTextActive : styles.percentText}
                >
                  {percent}%
                </BaseText>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.totalRow}>
          <BaseText style={styles.totalLabel}>TOTAL</BaseText>
          <BaseText variant="bold" style={styles.totalValue}>
            {total}
          </BaseText>
        </View>

        <BaseButton
          title={tradeSide === "buy" ? "Buy" : "Sell"}
          variant={tradeSide === "buy" ? "primary" : "cancel"}
          style={styles.sheetButton}
          onPress={onConfirm}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: Colors.secondary,
  },
  sheetHandle: {
    backgroundColor: "rgba(255,255,255,0.25)",
    width: 60,
    height: 4,
  },
  sheetContainer: {
    padding: 20,
    backgroundColor: Colors.secondary,
  },
  sheetHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  sheetTitle: {
    fontSize: 24,
    color: Colors.white,
  },
  sheetSubtitle: {
    color: Colors.textSecondary,
    marginTop: 6,
    fontSize: 12,
  },
  sheetActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  sheetActionButtonText: {
    color: Colors.white,
    fontSize: 24,
    lineHeight: 24,
    transform: [{ rotate: "45deg" }],
  },
  orderTypeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  orderTypeButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
  },
  orderTypeButtonActive: {
    backgroundColor: "rgba(94,213,168,0.15)",
  },
  orderTypeText: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  orderTypeTextActive: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: "700",
  },
  fieldRow: {
    marginBottom: 16,
  },
  fieldLabel: {
    color: Colors.textSecondary,
    marginBottom: 10,
    fontSize: 13,
  },
  fieldControl: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  fieldValue: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
  controlButtons: {
    flexDirection: "row",
    gap: 10,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  controlButtonText: {
    color: Colors.white,
    fontSize: 18,
  },
  percentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 20,
  },
  percentButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
  },
  percentButtonActive: {
    backgroundColor: "rgba(94,213,168,0.15)",
  },
  percentText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  percentTextActive: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "700",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  totalLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  totalValue: {
    color: Colors.white,
    fontSize: 18,
  },
  sheetButton: {
    borderRadius: 18,
    paddingVertical: 16,
  },
});
