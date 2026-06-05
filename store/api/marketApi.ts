import type {
  IAssetDetails,
  IGetMarketAssetsRequest,
  IMarketAssetsResponse,
  IMarketPrice,
  ITrendingResponse,
  IAssetDetailsResponse,
  IOrderBookResponse,
  ITradesResponse,
} from "@/types";
import { baseApi } from "./baseApi";

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
    getMarketPrices: builder.query<IMarketPrice[], void>({
      query: () => ({
        url: "/market/prices",
        method: "GET",
      }),
    }),
    getOrderBook: builder.query<IOrderBookResponse, { symbol: string; levels?: number }>({
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
} = marketApi;
