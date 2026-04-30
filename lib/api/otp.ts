import { SuccessResponse } from "@/types/api";
import { apiClient } from "./client";
import { handleError } from "@/lib/helpers/error-handler";
import { SendOtpRequest, VerifyOtpRequest } from "@/types/otp";

export const sendOtp = async (request: SendOtpRequest) => {
  try {
    const { data } = await apiClient.post<SuccessResponse<null>>(
      "/otp/send",
      request,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const verifyOtp = async (request: VerifyOtpRequest) => {
  try {
    const { data } = await apiClient.post<SuccessResponse<null>>(
      "/otp/verify",
      request,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};
