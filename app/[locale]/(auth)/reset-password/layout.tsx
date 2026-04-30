import BackButton from "@/components/common/back-button";

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full ">
      <div className="w-full max-w-xl space-y-7 px-4 py-10 mx-auto">
        <BackButton />
        {children}
      </div>
    </div>
  );
}
