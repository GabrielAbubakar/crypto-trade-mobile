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
  expoPushToken: string;
  platform?: "ios" | "android" | string;
}

export interface IDevice {
  id: string;
  userId: string;
  expoPushToken: string;
  platform: string;
  createdAt: string;
  lastSeenAt: string;
}

export interface IGetDevicesResponse {
  data: IDevice[];
  meta: {
    count: number;
    pushNotificationsEnabled: boolean;
  };
}

export interface IPriceAlert {
  id: string;
  userId: string;
  assetSymbol: string;
  direction: "above" | "below" | string;
  targetPriceUsd: number;
  isActive: boolean;
  triggeredAt: string | null;
  createdAt: string;
  asset?: {
    symbol: string;
    name: string;
  };
}

export interface ICreatePriceAlertRequest {
  assetSymbol: string;
  targetPriceUsd: number;
  direction: "above" | "below" | string;
}

export interface IUpdatePriceAlertRequest {
  targetPriceUsd?: number;
  direction?: "above" | "below" | string;
  isActive?: boolean;
}

export interface INotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: "kyc" | "wallet" | "alert" | string;
  isRead: boolean;
  createdAt: string;
}
