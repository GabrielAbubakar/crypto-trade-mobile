export interface IGetMarketAssetsRequest {
  q?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: "symbol" | "priceUsd" | "change24h" | "minBuyUsd";
  order?: "asc" | "desc";
  include?: "sparkline" | string;
}

export interface IMarketSparklinePoint {
  time: string;
  priceUsd: number;
}

export interface IMarketAsset {
  id: string;
  symbol: string;
  name: string;
  network: string;
  priceUsd: number;
  change24h: number;
  isActive: boolean;
  minBuyUsd: number;
  minSellUsd: number;
  iconUrl: string;
  sparkline?: IMarketSparklinePoint[];
}

export interface IMarketRuntimeMeta {
  mode: string;
  source: string;
  lastUpdatedAt: string;
  tickIntervalMs: number;
}

export interface IMarketAssetsMeta {
  count: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  include: string[];
  limit: number;
  market: IMarketRuntimeMeta;
  order: string;
  page: number;
  query: string | null;
  requestId: string;
  sort: string;
  total: number;
  totalPages: number;
}

export interface IMarketAssetsResponse {
  data: IMarketAsset[];
  meta: IMarketAssetsMeta;
}

export interface ITrendingFeaturedAsset {
  type: string;
  symbol: string;
  name: string;
  priceUsd: number;
  change24h: number;
  reason: string;
}

export interface ITrendingMeta {
  count: number;
  featured: ITrendingFeaturedAsset;
  include: string[];
  market: IMarketRuntimeMeta;
  requestId: string;
}

export interface ITrendingResponse {
  data: IMarketAsset[];
  meta: ITrendingMeta;
}

export interface IAssetStats {
  marketCapUsd: number;
  volume24hUsd: number;
  circulatingSupply: number;
  maxSupply: number | null;
  allTimeHighUsd: number;
  high24hUsd: number;
  low24hUsd: number;
  volumeToMarketCapRatio: number;
  about: string;
  websiteUrl: string;
  explorerUrl: string;
}

export interface IAssetChartPoint {
  time: string;
  priceUsd: number;
}

export interface IAssetDetails {
  id: string;
  symbol: string;
  name: string;
  network: string;
  priceUsd: number;
  change24h: number;
  isActive: boolean;
  minBuyUsd: number;
  minSellUsd: number;
  iconUrl: string;
  stats: IAssetStats;
  chart: IAssetChartPoint[];
}

export interface IAssetDetailsResponse {
  data: IAssetDetails;
  meta: {
    requestId: string;
  };
}

export interface IMarketPrice {
  symbol: string;
  price?: string | number;
  priceUsd?: string | number;
  change?: string | number;
}

export interface IOrderBookEntry {
  priceUsd: number;
  amount: number;
  total: number;
}

export interface IOrderBookData {
  midPriceUsd: number;
  spreadUsd: number;
  bids: IOrderBookEntry[];
  asks: IOrderBookEntry[];
}

export interface IOrderBookResponse {
  data: IOrderBookData;
  meta: {
    symbol: string;
    levels: number;
  };
}

export interface ITradeData {
  id: string;
  side: "buy" | "sell";
  priceUsd: number;
  amount: number;
  totalUsd: number;
  createdAt: string;
}

export interface ITradesResponse {
  data: ITradeData[];
  meta: {
    count: number;
    symbol: string;
  };
}

export interface ICandleData {
  time: string;
  openUsd: number;
  highUsd: number;
  lowUsd: number;
  closeUsd: number;
  volume: number;
}

export interface IAssetCandlesResponse {
  data: ICandleData[];
  meta: {
    count: number;
    symbol: string;
    interval: string;
  };
}

