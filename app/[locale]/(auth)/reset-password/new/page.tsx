import ResetPasswordNewForm from "@/components/feature/auth/reset-password-new-form";

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
        <p className="text-5xl font-bold mt-5">Tạo mật khẩu mới</p>
        <p>Hãy nhập mật khẩu mạnh cho tài khoản của bạn.</p>
      </div>

      <ResetPasswordNewForm email={email} />
    </>
  );
}
