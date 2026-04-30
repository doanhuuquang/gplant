import z from "zod";
import {
  LoginRequestValidation,
  RecoverUsernameRequestValidation,
  ResetPasswordRequestValidation,
  SignupRequestValidation,
} from "@/validations/auth";

export type LoginRequest = z.infer<typeof LoginRequestValidation>;
export type SignupRequest = z.infer<typeof SignupRequestValidation>;
export type RecoverUsernameRequest = z.infer<
  typeof RecoverUsernameRequestValidation
>;
export type ResetPasswordRequest = z.infer<
  typeof ResetPasswordRequestValidation
>;
