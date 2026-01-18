import { siteVerify } from "@/services/recaptcha-services";
import { useEffect, useState } from "react";

export default function useReCaptcha() {
  const [token, setToken] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setIsVerified(false);
        return;
      }

      const response = await siteVerify({ token });
      setIsVerified(response.success);
    };

    verify();
  }, [token]);

  return { setToken, isVerified, setIsVerified };
}
