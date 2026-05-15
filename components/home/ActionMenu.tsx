import Background from "@/assets/icons/home/bg.png";
import PayIcon from "@/assets/icons/home/credit.svg";
import LaunchPadIcon from "@/assets/icons/home/rocket.svg";
import ForwardIcon from "@/assets/icons/main/foward.svg";
import { BaseText } from "../ui/BaseText";
import { BaseTouchableOpacity } from "../ui/BaseTouchableOpacity";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";

export const ActionMenu: React.FC = () => {
  return (
    <View style={styles.actionCardsContainer}>
      <BaseTouchableOpacity style={styles.actionCard}>
        <View style={styles.actionCardLeft}>
          <View style={[styles.actionIconCircle]}>
            <Image
              source={Background}
              style={{ position: "absolute", zIndex: -1, width: 48, height: 48 }}
            />
            <LaunchPadIcon
              width={51}
              height={51}
              style={{ transform: [{ rotate: "-10deg" }] }}
            />
          </View>
          <View style={styles.actionCardTexts}>
            <BaseText style={styles.actionCardTitle}>P2P Trading</BaseText>
            <BaseText style={styles.actionCardSubtitle}>
              Bank Transfer, Paypal Revolut...
            </BaseText>
          </View>
        </View>
        <View style={styles.arrowCircle}>
          <ForwardIcon width={16} height={16} />
        </View>
      </BaseTouchableOpacity>

      <BaseTouchableOpacity style={styles.actionCard}>
        <View style={styles.actionCardLeft}>
          <View style={[styles.actionIconCircle]}>
            <Image
              source={Background}
              style={{ position: "absolute", zIndex: -1, width: 48, height: 48 }}
            />
            <PayIcon width={51} height={51} />
          </View>
          <View style={styles.actionCardTexts}>
            <BaseText style={styles.actionCardTitle}>
              Credit/Debit Card
            </BaseText>
            <BaseText style={styles.actionCardSubtitle}>
              Visa, Mastercard
            </BaseText>
          </View>
        </View>
        <View style={styles.arrowCircle}>
          <ForwardIcon width={16} height={16} />
        </View>
      </BaseTouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actionCardsContainer: {
    gap: 12,
    marginBottom: 28,
    paddingHorizontal: 20,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F0F3F5",
    borderRadius: 20,
    padding: 16,
    boxShadow: [
      {
        offsetX: 0,
        offsetY: 4,
        blurRadius: 16,
        color: "rgba(0, 0, 0, 0.02)",
      },
    ],
  },
  actionCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  actionIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  actionCardTexts: {
    gap: 4,
  },
  actionCardTitle: {
    color: "#1B232A",
  },
  actionCardSubtitle: {
    fontSize: 14,
    color: "#A7AFB7",
  },
  arrowCircle: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#E3E8ED",
    justifyContent: "center",
    alignItems: "center",
  },
});
