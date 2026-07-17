import DepositIcon from "@/assets/icons/home/deposit.svg";
import GridTradingIcon from "@/assets/icons/home/gridTrading.svg";
import LaunchpadIcon from "@/assets/icons/home/launchPad.svg";
import LiquidSwapIcon from "@/assets/icons/home/liguidSwap.svg";
import MarginIcon from "@/assets/icons/home/margin.svg";
import MoreIcon from "@/assets/icons/home/more.svg";
import ReferralIcon from "@/assets/icons/home/referal.svg";
import SavingsIcon from "@/assets/icons/home/savings.svg";
import { Colors } from "@/shared/constants";
import React from "react";
import { StyleSheet, View } from "react-native";
import { BaseText, BaseTouchableOpacity } from '@/shared/ui';

export const GridMenu: React.FC = () => {
  const menuItems = [
    { label: "Deposit", Icon: DepositIcon },
    { label: "Referral", Icon: ReferralIcon },
    { label: "Grid Trading", Icon: GridTradingIcon },
    { label: "Margin", Icon: MarginIcon },
    { label: "Launchpad", Icon: LaunchpadIcon },
    { label: "Savings", Icon: SavingsIcon },
    { label: "Liquid Swap", Icon: LiquidSwapIcon },
    { label: "More", Icon: MoreIcon },
  ];

  return (
    <View style={styles.gridContainer}>
      {menuItems.map((item, index) => {
        const hasRightBorder = (index + 1) % 4 !== 0;
        const hasBottomBorder = index < 4;

        return (
          <BaseTouchableOpacity
            key={item.label}
            style={[
              styles.gridItem,
              hasRightBorder && styles.rightBorder,
              hasBottomBorder && styles.bottomBorder,
            ]}
          >
            <item.Icon width={52} height={52} style={styles.icon} />
            <BaseText
              size="xs"
              color="#C1C7CD"
              textAlign="center"
              style={styles.label}
            >
              {item.label}
            </BaseText>
          </BaseTouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: Colors.background,
  },
  gridItem: {
    width: "25%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    paddingBottom: 20,
  },
  rightBorder: {
    borderRightWidth: 1,
    borderRightColor: "rgba(255, 255, 255, 0.04)",
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.04)",
  },
  icon: {
    shadowColor: Colors.primary,
    shadowRadius: 12,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
  },
  label: {},
});
