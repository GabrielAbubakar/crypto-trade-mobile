import type { IAssetDetails, IMarketAsset, IMarketPrice } from "@/types";
import { baseApi } from "./baseApi";

export const marketApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMarketAssets: builder.query<IMarketAsset[], void>({
      query: () => ({
        url: "/market/assets",
        method: "GET",
      }),
    }),
    getAssetDetails: builder.query<IAssetDetails, string>({
      query: (symbol) => ({
        url: `/market/assets/${symbol}`,
        method: "GET",
      }),
    }),
    getTrendingAssets: builder.query<IMarketAsset[], void>({
      query: () => ({
        url: "/market/trending",
        method: "GET",
      }),
    }),
    getMarketPrices: builder.query<IMarketPrice[], void>({
      query: () => ({
        url: "/market/prices",
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
} = marketApi;
