import type {
  IDepositAddressDetails,
  IDepositAddressesResponse,
  IPortfolioHistoryResponse,
  ISimulateDepositRequest,
  ISimulateDepositResponse,
  ITransactionItem,
  ITransactionsResponse,
  IWalletBalanceResponse,
  IWithdrawRequest,
  IWithdrawResponse,
} from "@/types";
import { baseApi } from "./baseApi";

export const walletApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWalletBalances: builder.query<IWalletBalanceResponse["data"], void>({
      query: () => ({
        url: "/wallet",
        method: "GET",
      }),
      transformResponse: (response: IWalletBalanceResponse) => {
        return response.data;
      },
      providesTags: ["Wallet"],
    }),
    getPortfolioHistory: builder.query<IPortfolioHistoryResponse, void>({
      query: () => ({
        url: "/wallet/portfolio/history",
        method: "GET",
      }),
      providesTags: ["Wallet"],
    }),
    getDepositAddresses: builder.query<IDepositAddressesResponse, void>({
      query: () => ({
        url: "/wallet/deposit-addresses",
        method: "GET",
      }),
      providesTags: ["Wallet"],
    }),
    getDepositAddressDetails: builder.query<IDepositAddressDetails, string>({
      query: (symbol) => ({
        url: `/wallet/deposit-addresses/${symbol}`,
        method: "GET",
      }),
      providesTags: ["Wallet"],
    }),
    getWalletTransactions: builder.query<ITransactionsResponse, void>({
      query: () => ({
        url: "/wallet/transactions",
        method: "GET",
      }),
      providesTags: ["Wallet"],
    }),
    getTransactionDetails: builder.query<ITransactionItem, string>({
      query: (transactionId) => ({
        url: `/wallet/transactions/${transactionId}`,
        method: "GET",
      }),
      providesTags: ["Wallet"],
    }),
    simulateDeposit: builder.mutation<
      ISimulateDepositResponse,
      ISimulateDepositRequest
    >({
      query: (body) => ({
        url: "/wallet/deposit/simulate",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Wallet"],
    }),
    withdraw: builder.mutation<IWithdrawResponse, IWithdrawRequest>({
      query: (body) => ({
        url: "/wallet/withdrawals",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Wallet"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetWalletBalancesQuery,
  useGetPortfolioHistoryQuery,
  useGetDepositAddressesQuery,
  useGetDepositAddressDetailsQuery,
  useGetWalletTransactionsQuery,
  useGetTransactionDetailsQuery,
  useSimulateDepositMutation,
  useWithdrawMutation,
} = walletApi;
