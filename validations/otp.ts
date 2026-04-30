import z from "zod";

export const SendOtpRequestValidation = z.object({
  email: z.email("Email không hợp lệ"),
});

export const VerifyOtpRequestValidation = z.object({
  email: z.email("Email không hợp lệ"),
  code: z.string().min(6, {
    message: "Mã OTP là bắt buộc",
  }),
});
