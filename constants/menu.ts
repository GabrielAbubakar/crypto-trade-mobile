import ConvertIcon from "@/assets/icons/home/menu/convert.svg";
import CryptoLoansIcon from "@/assets/icons/home/menu/cryptoLoans.svg";
import EthIcon from "@/assets/icons/home/menu/eth.svg";
import OrderIcon from "@/assets/icons/home/menu/order.svg";
import PayIcon from "@/assets/icons/home/menu/pay.svg";
import PoolIcon from "@/assets/icons/home/menu/pool.svg";
import SpotIcon from "@/assets/icons/home/menu/Spot.svg";
import StakingIcon from "@/assets/icons/home/menu/staking.svg";
import TransferIcon from "@/assets/icons/home/menu/transfer.svg";
import DepositIcon from "@/assets/icons/home/deposit.svg";
import ReferralIcon from "@/assets/icons/home/referal.svg";
import ConvertTradeIcon from "@/assets/icons/home/menu/convert.svg"; // Same as ConvertIcon?
import MarginIcon from "@/assets/icons/home/margin.svg";
import GridTradingIcon from "@/assets/icons/home/gridTrading.svg";
import LiquidSwapIcon from "@/assets/icons/home/liguidSwap.svg";
import SavingsIcon from "@/assets/icons/home/savings.svg";
import LaunchpadIcon from "@/assets/icons/home/launchPad.svg";

export const COMMON_MENU_ITEMS = [
  { label: "Transfer", Icon: TransferIcon },
  { label: "Deposit", Icon: DepositIcon },
  { label: "Orders", Icon: OrderIcon },
  { label: "Referral", Icon: ReferralIcon },
];

export const TRADE_MENU_ITEMS = [
  { label: "Convert", Icon: ConvertIcon },
  { label: "Spot", Icon: SpotIcon },
  { label: "Margin", Icon: MarginIcon },
  { label: "Grid Trading", Icon: GridTradingIcon },
  { label: "Liquid Swap", Icon: LiquidSwapIcon },
];

export const FINANCE_MENU_ITEMS = [
  { label: "Savings", Icon: SavingsIcon },
  { label: "Staking", Icon: StakingIcon },
  { label: "Pay", Icon: PayIcon },
  { label: "Crypto Loans", Icon: CryptoLoansIcon },
  { label: "Pool", Icon: PoolIcon },
  { label: "ETH 2.0", Icon: EthIcon },
  { label: "Launchpad", Icon: LaunchpadIcon },
];
