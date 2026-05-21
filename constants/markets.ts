import BitcoinIcon from "@/assets/icons/home/coin/bitcoin.svg";
import ChainlinkIcon from "@/assets/icons/home/coin/chainlink.svg";
import CardanoIcon from "@/assets/icons/home/coin/Cardano.svg";
import ShibaInuIcon from "@/assets/icons/home/coin/shibaInu.svg";
import HifiIcon from "@/assets/icons/home/coin/hifi.svg";
import RenIcon from "@/assets/icons/home/coin/ren.svg";

export interface CoinMarketItem {
  id: string;
  name: string;
  ticker: string;
  price: string;
  change: string;
  isPositive: boolean;
  Icon: React.FC<any>;
  sparklineData: number[];
}

export const MARKET_TABS = ["Convert", "Spot", "Margin", "Fiat"] as const;

export const initialCoinsData: CoinMarketItem[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    ticker: "BTC",
    price: "32,697.05",
    change: "+0.81%",
    isPositive: true,
    Icon: BitcoinIcon,
    sparklineData: [32450, 32550, 32500, 32680, 32600, 32697.05],
  },
  {
    id: "chainlink",
    name: "Chainlink",
    ticker: "LINK",
    price: "32,697.05",
    change: "-0.81%",
    isPositive: false,
    Icon: ChainlinkIcon,
    sparklineData: [32900, 32850, 32780, 32800, 32650, 32697.05],
  },
  {
    id: "cardano",
    name: "Cardano",
    ticker: "ADA",
    price: "32,697.05",
    change: "+0.81%",
    isPositive: true,
    Icon: CardanoIcon,
    sparklineData: [32480, 32520, 32490, 32650, 32580, 32697.05],
  },
  {
    id: "shiba",
    name: "SHIBA INU",
    ticker: "SHIB",
    price: "32,697.05",
    change: "-0.81%",
    isPositive: false,
    Icon: ShibaInuIcon,
    sparklineData: [32920, 32840, 32790, 32820, 32620, 32697.05],
  },
  {
    id: "hifi",
    name: "HIFI",
    ticker: "MFT",
    price: "32,697.05",
    change: "-0.81%",
    isPositive: false,
    Icon: HifiIcon,
    sparklineData: [32890, 32810, 32740, 32780, 32600, 32697.05],
  },
  {
    id: "ren",
    name: "REN",
    ticker: "REN",
    price: "32,697.05",
    change: "+0.81%",
    isPositive: true,
    Icon: RenIcon,
    sparklineData: [32470, 32540, 32510, 32670, 32590, 32697.05],
  },
];
