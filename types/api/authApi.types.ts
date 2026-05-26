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
  settings: IUserSettings;
  createdAt: string;
}


export interface ILoginResponse {
  data: {
    user: IUser;
    accessToken: string;
    token: string;
    refreshToken: string;
    tokenType: string;
    expiresAt: string;
    expiresInSeconds: number;
    refreshTokenExpiresAt: string;
  };
  meta: {
    requestId: string;
  };
}


export interface IUserSettings {
  language: string;
  fiatCurrency: string;
  theme: "light" | "dark" | "system";
  priceAlerts: boolean;
  pushNotifications: boolean;
  biometricEnabled: boolean;
}

// Endpoint Payloads
export interface ILoginRequest {
  loginType: "email" | "phone";
  identifier: string;
  password: string;
}

export interface IRegisterResponse {
  data: {
    user: IUser;
    accessToken: string;
    token: string;
    refreshToken: string;
    tokenType: string;
    expiresAt: string;
    expiresInSeconds: number;
    refreshTokenExpiresAt: string;
  };
  meta: {
    requestId: string;
  };
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
