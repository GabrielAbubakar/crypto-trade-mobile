import BitcoinIcon from "@/assets/icons/home/coin/bitcoin.svg";
import CardanoIcon from "@/assets/icons/home/coin/Cardano.svg";
import ChainlinkIcon from "@/assets/icons/home/coin/chainlink.svg";
import MftIcon from "@/assets/icons/home/coin/mft.svg";
import RenIcon from "@/assets/icons/home/coin/ren.svg";
import SolIcon from "@/assets/icons/home/coin/sol.svg";

export interface CoinData {
  pair: string;
  price: string;
  change: string;
  isPositive: boolean;
  Icon: React.FC<any>;
  sparklineData: number[];
}

export const recentCoins: CoinData[] = [
  {
    pair: "BTC/BUSD",
    price: "40,059.83",
    change: "+0.81%",
    isPositive: true,
    Icon: BitcoinIcon,
    sparklineData: [39900, 39850, 40100, 39950, 40180, 40020, 40250, 40059.83],
  },
  {
    pair: "SOL/BUSD",
    price: "2,059.83",
    change: "-0.81%",
    isPositive: false,
    Icon: SolIcon,
    sparklineData: [2110, 2100, 2075, 2090, 2065, 2059.83],
  },
  {
    pair: "ADA/BUSD",
    price: "1.24",
    change: "+1.45%",
    isPositive: true,
    Icon: CardanoIcon,
    sparklineData: [1.2, 1.21, 1.19, 1.23, 1.22, 1.25, 1.24],
  },
];

export const topCoins: CoinData[] = [
  {
    pair: "MFT/BUSD",
    price: "40,059.83",
    change: "+0.81%",
    isPositive: true,
    Icon: MftIcon,
    sparklineData: [39850, 39920, 39900, 40150, 40059.83],
  },
  {
    pair: "REN/BUSD",
    price: "2,059.83",
    change: "-0.81%",
    isPositive: false,
    Icon: RenIcon,
    sparklineData: [2120, 2105, 2085, 2100, 2070, 2059.83],
  },
  {
    pair: "LINK/BUSD",
    price: "18.42",
    change: "+2.15%",
    isPositive: true,
    Icon: ChainlinkIcon,
    sparklineData: [17.9, 18.1, 17.8, 18.3, 18.1, 18.5, 18.42],
  },
];
