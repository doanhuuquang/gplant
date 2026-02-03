import axiosInstance from "@/lib/helpers/axios-config";
import { handleError } from "@/lib/helpers/error-handler";
import { type ApiSuccessResponse } from "@/lib/schemas/api/api-success-response";
import { type RecoverUsernameRequest } from "@/lib/schemas/auth/recover-username-request";
import { type ResetPasswordRequest } from "@/lib/schemas/auth/reset-password-request";
import { type SignInRequest } from "@/lib/schemas/auth/signin-request";
import { type SignUpRequest } from "@/lib/schemas/auth/signup-request";

const SIGNIN_URL = "/api/account/login";
const SIGNUP_URL = "/api/account/register";
const SIGNOUT_URL = "/api/account/logout";
const REFRESH_URL = "/api/account/refresh";
const RECOVER_USERNAME_URL = "/api/account/recover-username";
const RESET_PASSWORD_URL = "/api/account/reset-password";

const signInWithEmailAndPassword = async (
  data: SignInRequest,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.post(SIGNIN_URL, data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const signUpWithEmail = async (
  data: SignUpRequest,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.post(SIGNUP_URL, data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const signOut = async (): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.post(SIGNOUT_URL);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const refresh = async (): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.post(REFRESH_URL);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const continueWithGoogle = () => {
  window.location.href =
    "https://localhost:7092/api/account/login/google?returnUrl=http://localhost:3000";
};

const continueWithFacebook = () => {
  window.location.href =
    "https://localhost:7092/api/account/login/facebook?returnUrl=http://localhost:3000";
};

const continueWithMicrosoft = () => {
  window.location.href =
    "https://localhost:7092/api/account/login/microsoft?returnUrl=http://localhost:3000";
};

const recoverUsername = async (
  data: RecoverUsernameRequest,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.post(RECOVER_USERNAME_URL, data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const resetPassword = async (
  data: ResetPasswordRequest,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.post(RESET_PASSWORD_URL, data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export {
  signInWithEmailAndPassword,
  signUpWithEmail,
  signOut,
  refresh,
  continueWithGoogle,
  continueWithFacebook,
  continueWithMicrosoft,
  recoverUsername,
  resetPassword,
};
