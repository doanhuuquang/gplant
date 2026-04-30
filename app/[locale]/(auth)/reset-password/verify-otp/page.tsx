import ResetPasswordVerifyOtpForm from "@/components/feature/auth/reset-password-verify-otp-form";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const params = await searchParams;
  const email = params.email || "";

  return (
    <>
      <div className="space-y-2">
        <p className="text-5xl font-bold mt-5">Xác minh email của bạn</p>
        <p>Nhập mã xác minh đã được gửi đến địa chỉ email của bạn.</p>
      </div>
      <ResetPasswordVerifyOtpForm email={email} />
    </>
  );
}
