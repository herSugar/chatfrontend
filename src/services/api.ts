import axios from "axios";

// ========== Konfigurasi Axios ==========
export const api = axios.create({
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
export const loginWithGoogleToken = async (firebaseIdToken: string) => {
  // Kirim token Firebase ke backend untuk verifikasi dan ambil info user
  const res = await api.post(ENDPOINTS.LOGIN, { token: firebaseIdToken });

  // Simpan token Firebase ke localStorage (karena ini yang dipakai untuk auth API berikutnya)
  localStorage.setItem("auth_token", firebaseIdToken); // Penting untuk API seperti /ask

  // Simpan email pengguna untuk keperluan frontend
  if (res.data.user?.email) {
    localStorage.setItem("user_email", res.data.user.email);
  }

  return res.data;
};


// ========== Fungsi API ==========
export const askAgent = async (query: string, sessionId?: string) => {
  const email = localStorage.getItem("user_email");
  if (!email) throw new Error("Email tidak ditemukan. Harap login ulang.");

  const body = {
    email,
    query,
    session_id: sessionId || null,
  };

  const res = await api.post(ENDPOINTS.ASK_AGENT, body);
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
