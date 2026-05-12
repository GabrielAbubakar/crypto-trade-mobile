import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// In production, this would point to your actual backend server URL or an environment variable.
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Grab token from local redux state (if present) and append to headers
      // const token = (getState() as RootState).auth.token;
      // if (token) {
      //   headers.set("authorization", `Bearer ${token}`);
      // }
      return headers;
    },
  }),
  endpoints: () => ({}),
});
