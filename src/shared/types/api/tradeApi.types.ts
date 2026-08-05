export interface ICreateQuoteRequest {
  type: "buy" | "sell" | "swap";
  fromAsset: string;
  toAsset: string;
  fromAmount: number;
}

export interface IQuoteData {
  id: string;
  type: "buy" | "sell" | "swap";
  fromAsset: string;
  toAsset: string;
  fromAmount: number;
  toAmount: number;
  rate: number;
  feeAmount: number;
  expiresAt: string;
  expiresInSeconds: number;
  isExpired: boolean;
}

export interface ICreateQuoteResponse {
  data: IQuoteData;
}

export interface IGetQuoteResponse {
  data: IQuoteData;
}

export interface IExecuteQuoteRequest {
  quoteId: string;
  pin: string;
}

export interface IExecuteTransaction {
  id: string;
  userId: string;
  type: "buy" | "sell" | "swap";
  status: "pending" | "completed" | "failed";
  fromAsset: string;
  toAsset: string;
  fromAmount: number;
  toAmount: number;
  feeAmount: number;
  rate: number;
  reference: string;
  note: string;
  createdAt: string;
  completedAt: string;
}

export interface IExecuteQuoteResponse {
  data: {
    transaction: IExecuteTransaction;
    wallet: {
      id: string;
      userId: string;
      fiatCurrency: string;
      depositAddresses: {
        assetSymbol: string;
        network: string;
        address: string;
        qrPayload: string;
      }[];
      balances: {
        assetSymbol: string;
        available: number;
        locked: number;
      }[];
    };
  };
}
