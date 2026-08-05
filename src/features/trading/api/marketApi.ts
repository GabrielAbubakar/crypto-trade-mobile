import type {
    IAssetCandlesResponse,
    IAssetDetails,
    IAssetDetailsResponse,
    IGetMarketAssetsRequest,
    IMarketAssetsResponse,
    IMarketPrice,
    IOrderBookResponse,
    ITradesResponse,
    ITrendingResponse,
} from "@/shared/types";
import { baseApi } from '@/core/api/baseApi';

export const marketApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMarketAssets: builder.query<
      IMarketAssetsResponse,
      IGetMarketAssetsRequest
    >({
      query: (params: IGetMarketAssetsRequest) => ({
        url: "/market/assets",
        method: "GET",
        params,
      }),
    }),
    getAssetDetails: builder.query<IAssetDetails, string>({
      query: (symbol) => ({
        url: `/market/assets/${symbol}`,
        method: "GET",
      }),
      transformResponse: (response: IAssetDetailsResponse) => response.data,
    }),
    getTrendingAssets: builder.query<ITrendingResponse, any>({
      query: (params) => ({
        url: "/market/trending",
        method: "GET",
        params,
      }),
    }),
    getMarketPrices: builder.query<{ data: IMarketPrice[] }, void>({
      query: () => ({
        url: "/market/prices",
        method: "GET",
      }),
    }),
    getOrderBook: builder.query<
      IOrderBookResponse,
      { symbol: string; levels?: number }
    >({
      query: ({ symbol, levels = 10 }) => ({
        url: `/market/assets/${symbol}/order-book`,
        method: "GET",
        params: { levels },
      }),
    }),
    getTrades: builder.query<ITradesResponse, { symbol: string }>({
      query: ({ symbol }) => ({
        url: `/market/assets/${symbol}/trades`,
        method: "GET",
      }),
    }),
    getAssetCandles: builder.query<
      IAssetCandlesResponse,
      {
        symbol: string;
        interval: "1m" | "5m" | "15m" | "1h" | "1d";
        limit?: number;
      }
    >({
      query: ({ symbol, interval, limit }) => ({
        url: `/market/assets/${symbol}/candles`,
        method: "GET",
        params: { interval, limit },
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetMarketAssetsQuery,
  useGetAssetDetailsQuery,
  useGetTrendingAssetsQuery,
  useGetMarketPricesQuery,
  useGetOrderBookQuery,
  useGetTradesQuery,
  useGetAssetCandlesQuery,
} = marketApi;
