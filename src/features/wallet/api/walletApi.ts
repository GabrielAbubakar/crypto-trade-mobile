import type {
    IDepositAddressDetails,
    IDepositAddressesResponse,
    IGetTransactionsRequest,
    IPortfolioHistoryResponse,
    ISimulateDepositRequest,
    ISimulateDepositResponse,
    ITransactionItem,
    ITransactionsResponse,
    IWalletBalanceResponse,
    IWithdrawRequest,
    IWithdrawResponse,
} from "@/shared/types";
import { baseApi } from '@/core/api/baseApi';

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
    getPortfolioHistory: builder.query<
      IPortfolioHistoryResponse,
      string | void
    >({
      query: (range) => ({
        url: "/wallet/portfolio/history",
        method: "GET",
        params: range ? { range } : undefined,
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
      transformResponse: (response: any) => response.data,
      providesTags: ["Wallet"],
    }),
    getWalletTransactions: builder.query<
      ITransactionsResponse,
      IGetTransactionsRequest | void
    >({
      query: (params) => ({
        url: "/wallet/transactions",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["Wallet"],
    }),
    getTransactionDetails: builder.query<ITransactionItem, string>({
      query: (transactionId) => ({
        url: `/wallet/transactions/${transactionId}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
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
      transformResponse: (response: any) => response.data,
      invalidatesTags: ["Wallet"],
    }),
    withdraw: builder.mutation<IWithdrawResponse, IWithdrawRequest>({
      query: (body) => ({
        url: "/wallet/withdrawals",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: IWithdrawResponse }) => response.data,
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
