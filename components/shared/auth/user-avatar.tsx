import { useAuth } from "@/hooks/auth/use-auth";
import Image from "next/image";

const defaultAvatarUrl = "/images/account-default-avatars/avatar-1.svg";

export default function UserAvatar() {
  const { user } = useAuth();

  return (
    <Image
      src={user?.profilePictureUrl ? user.profilePictureUrl : defaultAvatarUrl}
      alt={user?.firstName ?? "User name"}
      fill
      className="absolute top-0 left-0 aspect-square shrink-0 object-cover object-center"
    />
  );
}
