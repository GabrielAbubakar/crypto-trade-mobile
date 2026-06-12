import type {
  IKycVerificationRequest,
  IKycUploadRequest,
  IKycUploadResponse,
  ILoginRequest,
  ILoginResponse,
  IRegisterRequest,
  IRegisterResponse,
  ISetup2FAResponse,
  IEnable2FARequest,
  IEnable2FAResponse,
  IVerify2FARequest,
  IRegenerateRecoveryCodesRequest,
  IRegenerateRecoveryCodesResponse,
  IDisable2FARequest,
  IDisable2FAResponse,
} from "@/types";
import { logout, setCredentials } from "../slices/authSlice";
import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ILoginResponse["data"], ILoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: ILoginResponse) => response.data,
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({
              user: data.user,
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
            }),
          );
        } catch {
          // Handle error if needed
        }
      },
    }),
    register: builder.mutation<IRegisterResponse["data"], IRegisterRequest>({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: IRegisterResponse) => response.data,
    }),
    requestOTP: builder.mutation({
      query: (body: { email: string }) => ({
        url: "/auth/otp/request",
        method: "POST",
        body,
      }),
    }),
    verifyOTP: builder.mutation<
      ILoginResponse["data"],
      { email: string; code: string }
    >({
      query: (body) => ({
        url: "/auth/otp/verify",
        method: "POST",
        body,
      }),
      transformResponse: (response: ILoginResponse) => response.data,
    }),
    kycVerification: builder.mutation<
      { success: boolean },
      IKycVerificationRequest
    >({
      query: (body) => ({
        url: "/auth/kyc",
        method: "POST",
        body,
      }),
    }),
    kycUpload: builder.mutation<IKycUploadResponse, IKycUploadRequest>({
      query: (body) => ({
        url: "/auth/kyc/uploads",
        method: "POST",
        body,
      }),
    }),
    setup2FA: builder.mutation<ISetup2FAResponse["data"], void>({
      query: () => ({
        url: "/auth/2fa/setup",
        method: "POST",
      }),
      transformResponse: (response: ISetup2FAResponse) => response.data,
    }),
    enable2FA: builder.mutation<IEnable2FAResponse["data"], IEnable2FARequest>({
      query: (body) => ({
        url: "/auth/2fa/enable",
        method: "POST",
        body,
      }),
      transformResponse: (response: IEnable2FAResponse) => response.data,
      invalidatesTags: ["User"],
    }),
    verify2FA: builder.mutation<ILoginResponse["data"], IVerify2FARequest>({
      query: (body) => ({
        url: "/auth/2fa/verify",
        method: "POST",
        body,
      }),
      transformResponse: (response: ILoginResponse) => response.data,
    }),
    regenerate2FARecoveryCodes: builder.mutation<
      IRegenerateRecoveryCodesResponse["data"],
      IRegenerateRecoveryCodesRequest
    >({
      query: (body) => ({
        url: "/auth/2fa/recovery-codes/regenerate",
        method: "POST",
        body,
      }),
      transformResponse: (response: IRegenerateRecoveryCodesResponse) =>
        response.data,
    }),
    disable2FA: builder.mutation<
      IDisable2FAResponse["data"],
      IDisable2FARequest
    >({
      query: (body) => ({
        url: "/auth/2fa/disable",
        method: "POST",
        body,
      }),
      transformResponse: (response: IDisable2FAResponse) => response.data,
      invalidatesTags: ["User"],
    }),

    logOut: builder.mutation<void, any>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
        } catch (err) {
          // Even if backend logout fails, log the user out locally
          dispatch(logout());
        }
      },
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
  useKycUploadMutation,
  useLogOutMutation,
  useSetup2FAMutation,
  useEnable2FAMutation,
  useVerify2FAMutation,
  useRegenerate2FARecoveryCodesMutation,
  useDisable2FAMutation,
} = authApi;
