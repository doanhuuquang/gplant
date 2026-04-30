import { APP_PATHS } from "@/lib/constants/app-paths";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  continueWithGoogle,
  continueWithFacebook,
  continueWithMicrosoft,
  login,
  logout,
  resetPassword,
  signup,
  recoverUsername,
} from "@/lib/api/auth";

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      router.push(APP_PATHS.HOME);
      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};

export const useSignup = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: signup,
    onSuccess: (response) => {
      router.push(APP_PATHS.SIGN_IN);
      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};

export const useLogout = () => {
  const clearUser = useAuthStore((s) => s.clearUser);
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    onSuccess: (response) => {
      clearUser();
      router.push(APP_PATHS.SIGN_IN);
      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};

export const useRecoverUsername = () => {
  return useMutation({
    mutationFn: recoverUsername,
    onSuccess: (response) => {
      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (response) => {
      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};

export const useContinueWithGoogle = () => {
  return useMutation({
    mutationFn: () => {
      continueWithGoogle();
      return Promise.resolve();
    },
  });
};

export const useContinueWithFacebook = () => {
  return useMutation({
    mutationFn: () => {
      continueWithFacebook();
      return Promise.resolve();
    },
  });
};

export const useContinueWithMicrosoft = () => {
  return useMutation({
    mutationFn: () => {
      continueWithMicrosoft();
      return Promise.resolve();
    },
  });
};
