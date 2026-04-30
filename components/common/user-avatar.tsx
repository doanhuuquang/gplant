import Image from "next/image";
import { getFileUrl } from "@/utils/helpers";
import { useAuthStore } from "@/lib/stores/auth-store";

const defaultAvatarUrl = "/images/account-default-avatars/avatar-1.svg";

export default function UserAvatar() {
  const { user } = useAuthStore();

  return (
    <Image
      src={
        user?.profilePictureUrl
          ? getFileUrl(user.profilePictureUrl)
          : defaultAvatarUrl
      }
      alt={user?.firstName ?? "Tên người dùng"}
      fill
      unoptimized
      className="absolute top-0 left-0 aspect-square shrink-0 object-cover object-center"
    />
  );
}
