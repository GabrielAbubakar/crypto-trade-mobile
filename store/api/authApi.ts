import type { IAuthResponse, ILoginRequest, IRegisterRequest } from "@/types";
import { setCredentials } from "../slices/authSlice";
import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<IAuthResponse, ILoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: { data: IAuthResponse }) => response.data,
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data.user, token: data.token }));
        } catch (err) {
          // Handle error if needed
        }
      },
    }),
    register: builder.mutation<IAuthResponse, IRegisterRequest>({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: { data: IAuthResponse }) => response.data,
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data.user, token: data.token }));
        } catch (err) {
          // Handle error if needed
        }
      },
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
