import axiosInstance from "@/lib/helpers/axios-config";
import { handleError } from "@/lib/helpers/error-handler";
import { type ApiSuccessResponse } from "@/lib/schemas/api/api-success-response";
import { type SendOTPToEmailRequest } from "@/lib/schemas/auth/send-otp-to-email-request";
import { type VerifyOTPRequest } from "@/lib/schemas/auth/verify-otp-request";
import { type VerifyOTPResponse } from "@/lib/schemas/auth/verify-otp-response";

const SEND_OTP_URL = "/api/otp/send";
const VERIFY_OTP_URL = "/api/otp/verify";

const sendOTP = async (
  data: SendOTPToEmailRequest
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.post(SEND_OTP_URL, data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const verifyOTP = async (
  data: VerifyOTPRequest
): Promise<ApiSuccessResponse<VerifyOTPResponse>> => {
  try {
    const response = await axiosInstance.post(VERIFY_OTP_URL, data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export { sendOTP, verifyOTP };
