import ResetPasswordVerifyEmailForm from "@/components/feature/auth/reset-password-verify-email-form";

export default function Page() {
  return (
    <>
      <div className="space-y-2">
        <p className="text-5xl font-bold mt-5">Quên mật khẩu?</p>
        <p>
          Nhập thông tin bên dưới để yêu cầu đặt lại mật khẩu tài khoản Gplant.
        </p>
      </div>
      <ResetPasswordVerifyEmailForm />
    </>
  );
}
