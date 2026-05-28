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
