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

export interface IVerificationLimits {
  depositPerTransactionUsd: number;
  tradePerTransactionUsd: number;
  withdrawalPerTransactionUsd: number;
  dailyWithdrawalUsd: number;
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
  timestamp: string;
  valueUsd: number;
}

export interface IPortfolioHistoryResponse {
  history: IPortfolioHistoryPoint[];
}

export interface IDepositAddressItem {
  symbol: string;
  address: string;
  network: string;
}

export type IDepositAddressesResponse = IDepositAddressItem[];

export interface IDepositAddressDetails {
  symbol: string;
  address: string;
  network: string;
  qrPayload: string;
}

export interface ITransactionItem {
  id: string;
  type: "deposit" | "withdrawal" | "transfer";
  status: "pending" | "completed" | "failed";
  amount: string | number;
  symbol: string;
  timestamp: string;
  txHash?: string;
  address?: string;
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

export interface ITransactionsResponse {
  data: ITransactionItem[];
  meta: ITransactionsMeta;
}

export interface ISimulateDepositRequest {
  amount: number;
  symbol: string;
}

export interface ISimulateDepositResponse {
  success: boolean;
  message: string;
  transactionId?: string;
}

export interface IWithdrawRequest {
  amount: number;
  symbol: string;
  address: string;
  network: string;
}

export interface IWithdrawResponse {
  success: boolean;
  message: string;
  transactionId?: string;
}
