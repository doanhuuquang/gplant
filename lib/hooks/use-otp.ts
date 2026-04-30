import { sendOtp, verifyOtp } from "@/lib/api/otp";
import { useMutation } from "@tanstack/react-query";

export const useSendOtp = () => {
  return useMutation({
    mutationFn: sendOtp,
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: verifyOtp,
  });
};
