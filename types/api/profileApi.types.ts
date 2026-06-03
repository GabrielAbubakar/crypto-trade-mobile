import type { IUser } from "./authApi.types";

export interface IVerificationLimits {
  depositPerTransactionUsd: number;
  tradePerTransactionUsd: number;
  withdrawalPerTransactionUsd: number;
  dailyWithdrawalUsd: number;
}

export interface IVerification {
  status: string;
  tier: string;
  level: number;
  label: string;
  limits: IVerificationLimits;
  canTrade: boolean;
  canWithdraw: boolean;
  canUseSandboxDeposits: boolean;
}

export interface IGetProfileResponse {
  data: IUser;
  meta: {
    requestId: string;
  };
}

export interface IUpdateProfileRequest {
  fullName?: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
}

export interface IUpdateSettingsRequest {
  language?: string;
  fiatCurrency?: string;
  theme?: "light" | "dark" | "system";
  priceAlerts?: boolean;
  pushNotifications?: boolean;
  biometricEnabled?: boolean;
}

export interface IRegisterDeviceRequest {
  token: string;
  platform?: "ios" | "android" | string;
}

export interface IPriceAlert {
  id: string;
  symbol: string;
  targetPrice: string | number;
  condition: "above" | "below" | string;
  isActive: boolean;
  createdAt: string;
}

export interface ICreatePriceAlertRequest {
  symbol: string;
  targetPrice: string | number;
  condition: "above" | "below" | string;
}

export interface IUpdatePriceAlertRequest {
  targetPrice?: string | number;
  condition?: "above" | "below" | string;
  isActive?: boolean;
}

export interface INotification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
