import axios from "axios";

const instance = axios.create({
  baseURL: "/api/verify-recaptcha",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const siteVerify = async (data: {
  token: string;
}): Promise<{ success: boolean }> => {
  try {
    const response = await instance.post("", data);
    return response.data;
  } catch {
    return { success: false };
  }
};

export { siteVerify };
