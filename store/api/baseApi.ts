import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, setCredentials } from "../slices/authSlice";
import type { RootState } from "../store";

// In production, this would point to your actual backend server URL or an environment variable.
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// A module-level variable to lock concurrent refresh calls
let refreshPromise: Promise<boolean> | null = null;

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // If there's already an active refresh token request, wait for it to resolve
  if (refreshPromise) {
    await refreshPromise;
  }

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const authState = (api.getState() as RootState).auth;
    const refreshToken = authState.refreshToken;

    if (refreshToken) {
      try {
        if (!refreshPromise) {
          refreshPromise = (async () => {
            const refreshResult = await baseQuery(
              {
                url: "/auth/refresh",
                method: "POST",
                body: { refreshToken },
              },
              api,
              extraOptions
            );

            if (refreshResult.data) {
              const data = refreshResult.data as {
                accessToken: string;
                refreshToken: string;
                user?: any;
              };

              api.dispatch(
                setCredentials({
                  user: data.user || (authState.user as any),
                  accessToken: data.accessToken,
                  refreshToken: data.refreshToken || refreshToken,
                })
              );
              return true;
            }

            return false;
          })();
        }

        const isSuccess = await refreshPromise;
        // Reset the promise for subsequent calls
        refreshPromise = null;

        if (isSuccess) {
          // Retry the original query
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logout());
        }
      } catch (error) {
        refreshPromise = null;
        api.dispatch(logout());
      }
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: ['User', 'Notifications', 'Markets']
});

