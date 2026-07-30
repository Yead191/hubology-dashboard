import { baseApi } from "../../api/baseApi";
import type { LoginRequest, LoginResponse } from "./auth.types";

/**
 * Auth endpoints injected into the shared base API. Injecting (rather than
 * creating a separate API) keeps a single cache + middleware while colocating
 * the auth queries with the auth feature.
 */
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),
    getProfile: builder.query({
      query: () => ({
        url: "/user/profile",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Profile"],
    }),
  }),

  overrideExisting: false,
});

export const { useLoginMutation , useGetProfileQuery} = authApi;
