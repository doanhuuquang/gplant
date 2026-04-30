import axios from "axios";
// import { useAuthStore } from "@/lib/stores/auth-store";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// export const refreshClient = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   withCredentials: true,
// });

// let isRefreshing = false;
// let failedQueue: Array<() => void> = [];

// const processQueue = () => {
//   failedQueue.forEach((callback) => callback());
//   failedQueue = [];
// };

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    // const originalRequest = error.config;

    // if (error.response?.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true;

    //   if (isRefreshing) {
    //     return new Promise((resolve) => {
    //       failedQueue.push(() => {
    //         resolve(apiClient(originalRequest));
    //       });
    //     });
    //   }

    //   isRefreshing = true;

    //   try {
    //     await refreshClient.post("/account/refresh");
    //     processQueue();

    //     return apiClient(originalRequest);
    //   } catch (refreshError) {
    //     failedQueue = [];
    //     if (typeof window !== "undefined") {
    //       useAuthStore.getState().clearUser();
    //     }
    //     return Promise.reject(refreshError);
    //   } finally {
    //     isRefreshing = false;
    //   }
    // }

    return Promise.reject(error);
  },
);
