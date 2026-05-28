import type {
  ILoginRequest,
  ILoginResponse,
  IRegisterRequest,
  IRegisterResponse,
} from "@/types";
import { setCredentials } from "../slices/authSlice";
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
        } catch (err) {
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
        } catch (err) {
          // Handle error if needed
        }
      },
    }),
    requestOTP: builder.mutation({
      query: (body: { email: string }) => ({
        url: "/auth/otp/request",
        method: "POST",
        body,
      }),
    }),
    verifyOTP: builder.mutation({
      query: (body: { email: string; code: string }) => ({
        url: "/auth/otp/verify",
        method: "POST",
        body,
      }),
    }),
    kycVerification: builder.mutation({
      query: () => ({
        url: "/auth/kyc",
        method: "POST",
      }),
    }),
    logOut: builder.mutation({
      query: () => ({
        url: "/auth/logout",
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
  useLogOutMutation,
} = authApi;
