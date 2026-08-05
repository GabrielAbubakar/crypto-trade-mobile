import type { IVerificationLimits } from "./profileApi.types";

export interface IWalletDepositAddress {
  assetSymbol: string;
  network: string;
  address: string;
  qrPayload: string;
}

export interface IWalletBalance {
  assetSymbol: string;
  available: number;
  locked: number;
}

export interface IWallet {
  id: string;
  userId: string;
  fiatCurrency: string;
  depositAddresses: IWalletDepositAddress[];
  balances: IWalletBalance[];
}

export interface IWalletVerification {
  status: string;
  tier: string;
  level: number;
  label: string;
  limits: IVerificationLimits;
  canTrade: boolean;
  canWithdraw: boolean;
  canUseSandboxDeposits: boolean;
}

export interface IWalletBalanceData {
  wallet: IWallet;
  portfolioValueUsd: number;
  portfolioValue: number;
  portfolioCurrency: string;
  verification: IWalletVerification;
}

export interface IWalletBalanceResponse {
  data: IWalletBalanceData;
  meta: {
    requestId: string;
  };
}

export interface IPortfolioHistoryPoint {
  time: string;
  valueUsd: number;
  value: number;
  currency: string;
}

export interface IPortfolioHistoryMeta {
  count: number;
  range: string;
  latestValueUsd: number;
  latestValue: number;
  currency: string;
}

export interface IPortfolioHistoryResponse {
  data: IPortfolioHistoryPoint[];
  meta: IPortfolioHistoryMeta;
}

export interface IDepositAddressItem {
  symbol: string;
  address: string;
  network: string;
}

export type IDepositAddressesResponse = IDepositAddressItem[];

export interface IDepositAddressDetails {
  assetSymbol: string;
  network: string;
  address: string;
  qrPayload: string;
}

export interface ITransactionItem {
  id: string;
  userId: string;
  type: "deposit" | "withdrawal" | "transfer" | string;
  status: "pending" | "completed" | "failed" | string;
  fromAmount: number;
  fromAsset: string;
  toAmount: number;
  toAsset: string;
  feeAmount: number;
  rate: number;
  reference: string;
  note?: string;
  createdAt: string;
  completedAt?: string;
}

export interface ITransactionsMeta {
  requestId: string;
  count: number;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  status: string;
  type: string;
  order: string;
}

export interface IGetTransactionsRequest {
  status?: string;
  type?: string;
  page?: number;
  limit?: number;
  order?: string;
}

export interface ITransactionsResponse {
  data: ITransactionItem[];
  meta: ITransactionsMeta;
}

export interface ISimulateDepositRequest {
  amount: number;
  symbol: string;
  settlementDelaySeconds: number;
}

export interface ISimulateDepositResponse {
  transaction: ITransactionItem;
  wallet: IWallet;
  estimatedCompletionAt: string;
  pollingUrl: string;
}

export interface IWithdrawRequest {
  amount: number;
  assetSymbol: string;
  address: string;
  network: string;
}

export interface IWithdrawResponse {
  id: string;
  userId: string;
  assetSymbol: string;
  amount: number;
  feeAssetAmount: number;
  address: string;
  network: string;
  status: string;
  createdAt: string;
  reviewedAt?: string | null;
  reviewerNote?: string | null;
}
