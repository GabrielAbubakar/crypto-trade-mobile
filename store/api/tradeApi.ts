import type {
  ICreateQuoteRequest,
  ICreateQuoteResponse,
  IQuoteData,
  IExecuteQuoteRequest,
  IExecuteQuoteResponse,
} from "@/types";
import { baseApi } from "./baseApi";

export const tradeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createQuote: builder.mutation<IQuoteData, ICreateQuoteRequest>({
      query: (body) => ({
        url: "/trade/quotes",
        method: "POST",
        body,
      }),
      transformResponse: (response: ICreateQuoteResponse) => response.data,
    }),
    getQuoteDetails: builder.query<IQuoteData, string>({
      query: (quoteId) => ({
        url: `/trade/quotes/${quoteId}`,
        method: "GET",
      }),
      transformResponse: (response: { data: IQuoteData }) => response.data,
    }),
    executeQuote: builder.mutation<IExecuteQuoteResponse["data"], IExecuteQuoteRequest>({
      query: (body) => ({
        url: "/trade/execute",
        method: "POST",
        body,
      }),
      transformResponse: (response: IExecuteQuoteResponse) => response.data,
      invalidatesTags: ["Wallet", "Transaction"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateQuoteMutation,
  useGetQuoteDetailsQuery,
  useExecuteQuoteMutation,
} = tradeApi;
