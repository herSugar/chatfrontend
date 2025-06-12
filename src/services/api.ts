import axios from "axios";

// ========== Konfigurasi Axios ==========
export const api = axios.create({
  baseURL: "http://localhost:8000/",
  headers: {
    "Content-Type": "application/json",
  },
});

// ========== Interceptor: Tambahkan token auth secara otomatis ==========
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// ========== Endpoints ==========
const ENDPOINTS = {
  ASK_AGENT: "/api/ask",
  LOGIN: "/auth/login",
  SAVE_HISTORY: "/api/history/save",
  GET_USER_HISTORY: (firebaseUid: string) => `/api/history/${firebaseUid}`,
  GET_SESSION: (firebaseUid: string, sessionId: string) =>
    `/api/history/${firebaseUid}/${sessionId}`,
  UPDATE_SESSION: (firebaseUid: string, sessionId: string) =>
    `/api/history/${firebaseUid}/${sessionId}`,
  DELETE_SESSION: (firebaseUid: string, sessionId: string) =>
    `/api/history/${firebaseUid}/${sessionId}`,
  ADD_MESSAGE: (firebaseUid: string, sessionId: string) =>
    `/api/history/${firebaseUid}/${sessionId}/messages`,
  HEALTH_CHECK: "/health",
};

// ========== Fungsi Login ==========
export const loginWithGoogleToken = async (firebaseIdToken: string) => {
  const res = await api.post(ENDPOINTS.LOGIN, { token: firebaseIdToken });

  // Simpan token dan user info ke localStorage
  setAuthToken(firebaseIdToken);

  if (res.data.user?.email) {
    localStorage.setItem("user_email", res.data.user.email);
  }
  if (res.data.user?.firebase_uid) {
    localStorage.setItem("firebase_uid", res.data.user.firebase_uid);
  }

  return res.data;
};

// ========== Utilitas Auth Token ==========
export const setAuthToken = (token: string) => {
  localStorage.setItem("auth_token", token);
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const logout = () => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user_email");
  localStorage.removeItem("firebase_uid");
  delete api.defaults.headers.common["Authorization"];
};

// ========== Fungsi API lainnya ==========
export const askAgent = async (query: string, sessionId?: string) => {
  const email = localStorage.getItem("user_email");
  if (!email) throw new Error("Email tidak ditemukan. Harap login ulang.");

  const body = { email, query, session_id: sessionId || null };
  const res = await api.post(ENDPOINTS.ASK_AGENT, body);
  return res.data;
};

export const saveChatHistory = async (payload: any) => {
  const res = await api.post(ENDPOINTS.SAVE_HISTORY, payload);
  return res.data;
};

export const getUserHistory = async (firebaseUid: string) => {
  const res = await api.get(ENDPOINTS.GET_USER_HISTORY(firebaseUid));
  return res.data;
};

export const getSession = async (firebaseUid: string, sessionId: string) => {
  const res = await api.get(ENDPOINTS.GET_SESSION(firebaseUid, sessionId));
  return res.data;
};

export const updateSession = async (firebaseUid: string, sessionId: string, payload: any) => {
  const res = await api.put(ENDPOINTS.UPDATE_SESSION(firebaseUid, sessionId), payload);
  return res.data;
};

export const deleteSession = async (firebaseUid: string, sessionId: string) => {
  const res = await api.delete(ENDPOINTS.DELETE_SESSION(firebaseUid, sessionId));
  return res.data;
};

export const addMessageToSession = async (
  firebaseUid: string,
  sessionId: string,
  message: any
) => {
  const res = await api.post(ENDPOINTS.ADD_MESSAGE(firebaseUid, sessionId), message);
  return res.data;
};

export const healthCheck = async () => {
  const res = await api.get(ENDPOINTS.HEALTH_CHECK);
  return res.data;
};
