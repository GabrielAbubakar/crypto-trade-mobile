import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: () => ({
        url: "/me",
        method: "GET",
      }),
    }),
    getUserNotifications: builder.query({
      query: () => ({
        url: "/me/notifications",
        method: "GET",
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useGetUserProfileQuery, useGetUserNotificationsQuery } = userApi;
