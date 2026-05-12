import { IAuthResponse, ILoginRequest, IRegisterRequest } from "@/types";
import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<IAuthResponse, ILoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation<IAuthResponse, IRegisterRequest>({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
    }),
    requestOTP: builder.mutation({
      query: () => ({
        url: "/auth/otp/request",
        method: "POST",
      }),
    }),
    verifyOTP: builder.mutation({
      query: () => ({
        url: "/auth/otp/verify",
        method: "POST",
      }),
    }),
    kycVerification: builder.mutation({
      query: () => ({
        url: "/auth/kyc",
        method: "POST",
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRequestOTPMutation,
  useVerifyOTPMutation,
  useKycVerificationMutation,
} = authApi;
