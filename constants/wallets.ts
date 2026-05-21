import BitcoinIcon from "@/assets/icons/home/coin/bitcoin.svg";
import ChainlinkIcon from "@/assets/icons/home/coin/chainlink.svg";
import CardanoIcon from "@/assets/icons/home/coin/Cardano.svg";
import ShibaInuIcon from "@/assets/icons/home/coin/shibaInu.svg";
import HifiIcon from "@/assets/icons/home/coin/hifi.svg";
import RenIcon from "@/assets/icons/home/coin/ren.svg";

export interface WalletAsset {
  id: string;
  name: string;
  ticker: string;
  amount: string;
  valueUsd: string;
  Icon: React.FC<any>;
}

export const initialAssetsData: WalletAsset[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    ticker: "BTC",
    amount: "32,697.05",
    valueUsd: "$468,554.23",
    Icon: BitcoinIcon,
  },
  {
    id: "chainlink",
    name: "Chainlink",
    ticker: "LINK",
    amount: "32,697.05",
    valueUsd: "$468,554.23",
    Icon: ChainlinkIcon,
  },
  {
    id: "cardano",
    name: "Cardano",
    ticker: "ADA",
    amount: "32,697.05",
    valueUsd: "$468,554.23",
    Icon: CardanoIcon,
  },
  {
    id: "shiba",
    name: "SHIBA INU",
    ticker: "SHIB",
    amount: "32,697.05",
    valueUsd: "$468,554.23",
    Icon: ShibaInuIcon,
  },
  {
    id: "hifi",
    name: "HIFI",
    ticker: "MFT",
    amount: "32,697.05",
    valueUsd: "$468,554.23",
    Icon: HifiIcon,
  },
  {
    id: "ren",
    name: "REN",
    ticker: "REN",
    amount: "32,697.05",
    valueUsd: "$468,554.23",
    Icon: RenIcon,
  },
];
