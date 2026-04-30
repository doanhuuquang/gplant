import z from "zod";
import {
  SendOtpRequestValidation,
  VerifyOtpRequestValidation,
} from "@/validations/otp";

export type SendOtpRequest = z.infer<typeof SendOtpRequestValidation>;
export type VerifyOtpRequest = z.infer<typeof VerifyOtpRequestValidation>;
