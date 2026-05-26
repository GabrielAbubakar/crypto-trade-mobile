export interface IMarketAsset {
  id: string;
  name: string;
  symbol: string;
  price: string | number;
  change: string | number;
  isPositive?: boolean;
  sparklineData?: number[];
}

export interface IAssetDetails {
  id: string;
  name: string;
  symbol: string;
  description?: string;
  price: string | number;
  change: string | number;
  sparklineData?: number[];
}

export interface IMarketPrice {
  symbol: string;
  price: string | number;
  change?: string | number;
}
