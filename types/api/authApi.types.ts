// Global Domain Entities (Can be shared/imported from root types)
export interface IUser {
  id: string;
  role: string;
  fullName: string;
  email: string;
  phone: string;
  twoFactorEnabled: boolean;
  kycStatus: string;
  avatarUrl: string | null;
  watchlist: string[];
  settings: {
    language: string;
    fiatCurrency: string;
    theme: string;
    priceAlerts: boolean;
    pushNotifications: boolean;
    biometricEnabled: boolean;
  };
  createdAt: string;
}

// Endpoint Payloads
export interface ILoginRequest {
  email?: string;
  password?: string;
}

export interface IAuthResponse {
  token: string;
  user: IUser;
}

export interface IRegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface IRequestOTPRequest {
  email: string;
}

export interface IVerifyOTPRequest {
  email: string;
  code: string;
}
