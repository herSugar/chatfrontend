import axios from "axios";

// ========== Konfigurasi Axios ==========
const api = axios.create({
  baseURL: "http://localhost:8000/",
  headers: {
    "Content-Type": "application/json",
  },
});

// ========== Daftar Endpoint ==========
const ENDPOINTS = {
  ASK_AGENT: "/api/ask",
  LOGIN: "/auth/login",
  SAVE_HISTORY: "/api/history/save",
  GET_USER_HISTORY: (googleId: string) => `/api/history/${googleId}`,
  GET_SESSION: (googleId: string, sessionId: string) =>
    `/api/history/${googleId}/${sessionId}`,
  UPDATE_SESSION: (googleId: string, sessionId: string) =>
    `/api/history/${googleId}/${sessionId}`,
  DELETE_SESSION: (googleId: string, sessionId: string) =>
    `/api/history/${googleId}/${sessionId}`,
  ADD_MESSAGE: (googleId: string, sessionId: string) =>
    `/api/history/${googleId}/${sessionId}/messages`,
  HEALTH_CHECK: "/health",
};

// ========== Fungsi API ==========
export const askAgent = async (message: string) => {
  const res = await api.post(ENDPOINTS.ASK_AGENT, { message });
  return res.data;
};

export const loginWithGoogleToken = async (token: string) => {
  const res = await api.post(ENDPOINTS.LOGIN, { token });

  const accessToken = res.data.access_token || res.data.token; // sesuaikan dengan struktur respons backend
  if (accessToken) {
    localStorage.setItem("auth_token", accessToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  }

  return res.data;
};

export const saveChatHistory = async (payload: any) => {
  const res = await api.post(ENDPOINTS.SAVE_HISTORY, payload);
  return res.data;
};

export const getUserHistory = async (googleId: string) => {
  const res = await api.get(ENDPOINTS.GET_USER_HISTORY(googleId));
  return res.data;
};

export const getSession = async (googleId: string, sessionId: string) => {
  const res = await api.get(ENDPOINTS.GET_SESSION(googleId, sessionId));
  return res.data;
};

export const updateSession = async (googleId: string, sessionId: string, payload: any) => {
  const res = await api.put(ENDPOINTS.UPDATE_SESSION(googleId, sessionId), payload);
  return res.data;
};

export const deleteSession = async (googleId: string, sessionId: string) => {
  const res = await api.delete(ENDPOINTS.DELETE_SESSION(googleId, sessionId));
  return res.data;
};

export const addMessageToSession = async (
  googleId: string,
  sessionId: string,
  message: any
) => {
  const res = await api.post(ENDPOINTS.ADD_MESSAGE(googleId, sessionId), message);
  return res.data;
};

export const healthCheck = async () => {
  const res = await api.get(ENDPOINTS.HEALTH_CHECK);
  return res.data;
};
export const logout = () => {
  localStorage.removeItem("auth_token");
  delete api.defaults.headers.common["Authorization"];
};
