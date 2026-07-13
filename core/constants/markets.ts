
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

export const MARKET_TABS = ["All", "Gainers", "Watchlist"] as const;
