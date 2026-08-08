import { baseApi } from "../../api/baseApi";
import type {
  ForgetPasswordRequest,
  LoginRequest,
  LoginResponse,
  MessageResponse,
  ResetPasswordRequest,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from "./auth.types";

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

    forgetPassword: builder.mutation<MessageResponse, ForgetPasswordRequest>({
      query: (body) => ({
        url: "/auth/forget-password",
        method: "POST",
        body,
      }),
    }),

    verifyEmail: builder.mutation<VerifyEmailResponse, VerifyEmailRequest>({
      query: (body) => ({
        url: "/auth/verify-email",
        method: "POST",
        body,
      }),
    }),

    resetPassword: builder.mutation<MessageResponse, ResetPasswordRequest>({
      query: ({ resetToken, newPassword, confirmPassword }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: { newPassword, confirmPassword },
        headers: {
          Authorization: resetToken,
        },
      }),
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

export const {
  useLoginMutation,
  useForgetPasswordMutation,
  useVerifyEmailMutation,
  useResetPasswordMutation,
  useGetProfileQuery,
} = authApi;
