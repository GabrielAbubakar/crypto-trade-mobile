import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// In production, this would point to your actual backend server URL or an environment variable.
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
});
