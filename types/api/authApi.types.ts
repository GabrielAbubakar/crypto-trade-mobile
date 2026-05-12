// Global Domain Entities (Can be shared/imported from root types)
export interface IUser {
  id: string;
  email?: string;
  mobile?: string;
  name?: string;
  isKycVerified: boolean;
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
