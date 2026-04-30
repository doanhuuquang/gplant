import { SuccessResponse } from "@/types/api";
import { apiClient } from "./client";
import { handleError } from "@/lib/helpers/error-handler";
import {
  LoginRequest,
  RecoverUsernameRequest,
  ResetPasswordRequest,
  SignupRequest,
} from "@/types/auth";

export const login = async (request: LoginRequest) => {
  try {
    const { data } = await apiClient.post<SuccessResponse<null>>(
      "/account/login",
      request,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const signup = async (request: SignupRequest) => {
  try {
    const { data } = await apiClient.post<SuccessResponse<null>>(
      "/account/register",
      request,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const logout = async () => {
  try {
    const { data } = await apiClient.post("/account/logout");
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const continueWithGoogle = (returnUrl?: string) => {
  const url = new URL(
    "/api/account/login/google",
    process.env.NEXT_PUBLIC_API_BASE_URL,
  );
  url.searchParams.set("returnUrl", returnUrl || window.location.origin);
  window.location.href = url.toString();
};

export const continueWithFacebook = (returnUrl?: string) => {
  const url = new URL(
    "/api/account/login/facebook",
    process.env.NEXT_PUBLIC_API_BASE_URL,
  );
  url.searchParams.set("returnUrl", returnUrl || window.location.origin);
  window.location.href = url.toString();
};

export const continueWithMicrosoft = (returnUrl?: string) => {
  const url = new URL(
    "/api/account/login/microsoft",
    process.env.NEXT_PUBLIC_API_BASE_URL,
  );
  url.searchParams.set("returnUrl", returnUrl || window.location.origin);
  window.location.href = url.toString();
};

export const recoverUsername = async (request: RecoverUsernameRequest) => {
  try {
    const { data } = await apiClient.post<SuccessResponse<null>>(
      "/account/recover-username",
      request,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const resetPassword = async (request: ResetPasswordRequest) => {
  try {
    const { data } = await apiClient.post<SuccessResponse<null>>(
      "/account/reset-password",
      request,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};
