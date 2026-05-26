import type {
  ICreatePriceAlertRequest,
  INotification,
  IPriceAlert,
  IRegisterDeviceRequest,
  IUpdatePriceAlertRequest,
  IUpdateProfileRequest,
  IUpdateSettingsRequest,
  IUser,
  IUserSettings,
} from "@/types";
import { baseApi } from "./baseApi";

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<IUser, void>({
      query: () => ({
        url: "/me",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation<IUser, IUpdateProfileRequest>({
      query: (body) => ({
        url: "/me",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    getSettings: builder.query<IUserSettings, void>({
      query: () => ({
        url: "/me/settings",
        method: "GET",
      }),
    }),
    updateSettings: builder.mutation<IUserSettings, IUpdateSettingsRequest>({
      query: (body) => ({
        url: "/me/settings",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    updateTransactionPin: builder.mutation<{ success: boolean }, { pin: string }>({
      query: (body) => ({
        url: "/me/pin",
        method: "PATCH",
        body,
      }),
    }),
    registerDevice: builder.mutation<{ success: boolean }, IRegisterDeviceRequest>({
      query: (body) => ({
        url: "/me/devices",
        method: "POST",
        body,
      }),
    }),
    getWatchlist: builder.query<string[], void>({
      query: () => ({
        url: "/me/watchlist",
        method: "GET",
      }),
    }),
    addToWatchlist: builder.mutation<{ success: boolean }, string>({
      query: (symbol) => ({
        url: `/me/watchlist/${symbol}`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    removeFromWatchlist: builder.mutation<{ success: boolean }, string>({
      query: (symbol) => ({
        url: `/me/watchlist/${symbol}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    getPriceAlerts: builder.query<IPriceAlert[], void>({
      query: () => ({
        url: "/me/price-alerts",
        method: "GET",
      }),
    }),
    createPriceAlert: builder.mutation<IPriceAlert, ICreatePriceAlertRequest>({
      query: (body) => ({
        url: "/me/price-alerts",
        method: "POST",
        body,
      }),
    }),
    updatePriceAlert: builder.mutation<IPriceAlert, { alertId: string; body: IUpdatePriceAlertRequest }>({
      query: ({ alertId, body }) => ({
        url: `/me/price-alerts/${alertId}`,
        method: "PATCH",
        body,
      }),
    }),
    deletePriceAlert: builder.mutation<{ success: boolean }, string>({
      query: (alertId) => ({
        url: `/me/price-alerts/${alertId}`,
        method: "DELETE",
      }),
    }),
    getNotifications: builder.query<INotification[], void>({
      query: () => ({
        url: "/me/notifications",
        method: "GET",
      }),
    }),
    markNotificationAsRead: builder.mutation<{ success: boolean }, string>({
      query: (notificationId) => ({
        url: `/me/notifications/${notificationId}/read`,
        method: "PATCH",
      }),
    }),
    markAllNotificationsAsRead: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: "/me/notifications/read-all",
        method: "PATCH",
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useUpdateTransactionPinMutation,
  useRegisterDeviceMutation,
  useGetWatchlistQuery,
  useAddToWatchlistMutation,
  useRemoveFromWatchlistMutation,
  useGetPriceAlertsQuery,
  useCreatePriceAlertMutation,
  useUpdatePriceAlertMutation,
  useDeletePriceAlertMutation,
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} = profileApi;
