import { showErrorToast, showSuccessToast } from "@/utils";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, setCredentials } from "../slices";

// 1. Standard base query configuration
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.EXPO_PUBLIC_API_URL,
  prepareHeaders: (headers, { getState }) => {
    // Pull token from local storage or app state if authenticated
    const token = (getState() as any).auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Run the initial request
  let result = await baseQuery(args, api, extraOptions);
  console.log(
    "Current Access Token:",
    (api.getState() as any).auth.accessToken,
  );
  //   console.log(result);

  // Check if the request failed due to an unauthorized token
  if (result.error && result.error.status === 401) {
    console.log("❌ 401 Unauthorized Error");
    // Fetch your stored refresh token
    const refreshToken = (api.getState() as any).auth.refreshToken;

    if (refreshToken) {
      try {
        console.log("🔃 Refreshing token...");
        // Send request to get a new access token
        const refreshResult = await baseQuery(
          {
            url: "/auth/refresh",
            method: "POST",
            body: { refreshToken },
          },
          api,
          extraOptions,
        );

        if (refreshResult.data) {
          console.log("✅ Token Refresh Successful");
          showSuccessToast("✅ Token Refresh Successful");
          const rawPayload = (refreshResult.data as any).data;
          const newTokens = {
            user: rawPayload.user || (api.getState() as any).auth.user,
            accessToken: rawPayload.accessToken || rawPayload.token,
            refreshToken: rawPayload.refreshToken || refreshToken,
          };

          // Update your Redux store state
          api.dispatch(setCredentials(newTokens));

          // Retry the initial failed request with the new token
          result = await baseQuery(args, api, extraOptions);
          //   console.log("Retry result", result);
        } else {
          // Refresh token endpoint failed (e.g., refresh token expired)
          showErrorToast("Token refresh failed");
          api.dispatch(logout());
        }
      } catch (error) {
        // Refresh token endpoint failed (e.g., refresh token expired)
        showErrorToast("Token refresh failed");
        api.dispatch(logout());
      }
    } else {
      // No refresh token available
      api.dispatch(logout());
    }
  }

  // Handle other errors

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["User", "Wallet", "Transaction"],
  endpoints: () => ({}),
});
