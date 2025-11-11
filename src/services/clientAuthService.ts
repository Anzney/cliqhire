import axios from "axios";

export interface ClientLoginPayload {
  email: string;
  password: string;
}

export interface ClientLoginResponse {
  success: boolean;
  message: string;
  token?: string;
  name?: string;
}

const clientAuthApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 15000,
});

export async function clientLogin(payload: ClientLoginPayload): Promise<ClientLoginResponse> {
  try {
    const body = {
      emails: payload.email,
      password: payload.password,
    };

    const res = await clientAuthApi.post("/api/clients/login", body);
    const data = res.data as { success: boolean; message: string; token?: string; name?: string };

    if (typeof window !== "undefined") {
      if (data?.token) {
        localStorage.setItem("clientToken", data.token);
      }
      if (data?.name) {
        localStorage.setItem("clientName", data.name);
      }
      // Persist client email to support APIs that require it (e.g., logout)
      if (payload?.email) {
        localStorage.setItem("clientEmail", payload.email);
      }
    }

    return {
      success: !!data?.success,
      message: data?.message || (data?.success ? "Login success" : "Login failed"),
      token: data?.token,
      name: data?.name,
    };
  } catch (err: any) {
    const msg = err?.response?.data?.message || err?.message || "Login failed";
    return { success: false, message: msg };
  }
}

export function getClientToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("clientToken");
}

export function clearClientToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("clientToken");
  localStorage.removeItem("clientName");
  localStorage.removeItem("clientEmail");
}

export async function clientLogout(): Promise<boolean> {
  try {
    let email: string | null = null;
    if (typeof window !== "undefined") {
      email = localStorage.getItem("clientEmail");
    }
    const body = email ? { email, emails: email } : {};
    await clientAuthApi.post("/api/clients/logout", body);
    return true;
  } catch (err) {
    // Even if API fails, proceed to clear local state to log the client out locally
    return false;
  } finally {
    clearClientToken();
  }
}

