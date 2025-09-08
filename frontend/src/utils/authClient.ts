"use client";

export type ApiResponse<T> = {
  status: string;
  message: string;
  data?: T;
};

type LoginResponse = {
  accessToken: string;
  firstName: string;
  lastName: string;
  email: string;
  userId: string;
};

const STORAGE_TOKEN_KEY = "accessToken";
const STORAGE_USER_KEY = "authUser";

export const getServerUrl = (): string => {
  return process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
};

export const saveSession = (token: string, user: Omit<LoginResponse, "accessToken">) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_TOKEN_KEY, token);
  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
};

export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_TOKEN_KEY);
};

export const getAuthUser = (): { firstName: string; lastName: string; email: string; userId: string } | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_USER_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const clearSession = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_TOKEN_KEY);
  localStorage.removeItem(STORAGE_USER_KEY);
};

export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

export async function loginApi(payload: { email: string; password: string }): Promise<LoginResponse> {
  const res = await fetch(`${getServerUrl()}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json: ApiResponse<LoginResponse> = await res.json();
  if (!res.ok || json.status !== "SUCCESS" || !json.data) {
    throw new Error(json?.message || "Login failed");
  }
  return json.data;
}

export async function signupApi(payload: { firstName: string; lastName: string; email: string; password: string; mobileNumber?: string }): Promise<void> {
  const res = await fetch(`${getServerUrl()}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json: ApiResponse<unknown> = await res.json();
  if (!res.ok || json.status !== "SUCCESS") {
    throw new Error(json?.message || "Signup failed");
  }
}

export async function fetchProfile(): Promise<unknown> {
  const token = getAccessToken();
  const res = await fetch(`${getServerUrl()}/api/auth/me`, {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}


