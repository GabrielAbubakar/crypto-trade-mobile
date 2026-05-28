import { showToast } from "@/utils";
import type {
  BaseQueryApi,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { logout, setCredentials } from "../slices/authSlice";
import type { RootState } from "../store";

// In production, this would point to your actual backend server URL or an environment variable.
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const UNAUTHORIZED_MESSAGE =
  "Your session has expired or you are not authorized. Please sign in again.";

const baseQuery = retry(
  fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
);

let refreshPromise: Promise<boolean> | null = null;
let unauthorizedToastShown = false;

const showUnauthorizedToast = () => {
  if (!unauthorizedToastShown) {
    showToast("error", UNAUTHORIZED_MESSAGE);
    unauthorizedToastShown = true;
  }
};

const logoutUser = (api: BaseQueryApi) => {
  showUnauthorizedToast();
  api.dispatch(logout());
};

const handleNetworkError = (error?: FetchBaseQueryError) => {
  if (error?.status !== "FETCH_ERROR") {
    return false;
  }

  showToast(
    "error",
    "Network error. Please check your connection and try again.",
  );
  return true;
};

const refreshAuthToken = async (
  refreshToken: string,
  currentUser: any,
  api: BaseQueryApi,
  extraOptions: any,
) => {
  const refreshResult = await baseQuery(
    {
      url: "/auth/refresh",
      method: "POST",
      body: { refreshToken },
    },
    api,
    extraOptions,
  );

  if (!refreshResult.data) {
    return false;
  }

  const data = refreshResult.data as {
    accessToken: string;
    refreshToken?: string;
    user?: unknown;
  };

  if (!data.accessToken) {
    return false;
  }

  api.dispatch(
    setCredentials({
      user: data.user ?? currentUser,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken ?? refreshToken,
    }),
  );

  unauthorizedToastShown = false;
  return true;
};

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  if (refreshPromise) {
    await refreshPromise;
  }

  let result = await baseQuery(args, api, extraOptions);

  if (handleNetworkError(result.error)) {
    return result;
  }

  if (result.error?.status !== 401) {
    return result;
  }

  const { auth } = api.getState() as RootState;
  const refreshToken = auth.refreshToken;

  if (!refreshToken) {
    logoutUser(api);
    return result;
  }

  try {
    if (!refreshPromise) {
      refreshPromise = refreshAuthToken(
        refreshToken,
        auth.user as any,
        api,
        extraOptions,
      );
    }

    const isRefreshed = await refreshPromise;
    refreshPromise = null;

    if (!isRefreshed) {
      logoutUser(api);
      return result;
    }

    return await baseQuery(args, api, extraOptions);
  } catch {
    refreshPromise = null;
    logoutUser(api);
    return result;
  }
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: ["User", "Notifications", "Markets", "Wallet"],
});
