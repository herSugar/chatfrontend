import axios from "axios";
import { auth } from "./firebaseConfig";

// ========== Konfigurasi Axios ==========
export const api = axios.create({
  baseURL: "http://localhost:8000/",
  headers: {
    "Content-Type": "application/json",
  },
});

// ========== Types ==========
interface UserProfile {
  email: string;
  name?: string;
  picture?: string;
}

interface ProfileUpdateData {
  name?: string;
  file?: File;
}

interface AuthResponse {
  user: {
    email: string;
    firebase_uid: string;
    name?: string;
    picture?: string;
  };
  token?: string;
}

// ========== Set initial token if available ==========
const initializeAuth = () => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

initializeAuth();

// ========== Interceptor: Auto-refresh token on 401 ==========
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (auth.currentUser) {
          const newToken = await auth.currentUser.getIdToken(true);
          setAuthToken(newToken);
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return api.request(originalRequest);
        }
      } catch (refreshError) {
        logout();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ========== Endpoints ==========
const ENDPOINTS = {
  ASK_AGENT: "/api/ask",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  PROFILE: "/api/profile",
  SAVE_HISTORY: (firebaseUid: string, sessionId: string) =>
    `/api/history/save/${firebaseUid}/${sessionId}`,
  GET_USER_HISTORY: (firebaseUid: string) =>
    `/api/history/${firebaseUid}`,
  GET_SESSION: (firebaseUid: string, sessionId: string) =>
    `/api/history/${firebaseUid}/${sessionId}`,
  UPDATE_SESSION: (firebaseUid: string, sessionId: string) =>
    `/api/history/${firebaseUid}/${sessionId}`,
  DELETE_SESSION: (firebaseUid: string, sessionId: string) =>
    `/api/history/${firebaseUid}/${sessionId}`,
  ADD_MESSAGE: (firebaseUid: string, sessionId: string) =>
    `/api/history/${firebaseUid}/${sessionId}/messages`,
  HEALTH_CHECK: "/health",
  BOOKMARKS: (firebaseUid: string) =>
    `/api/bookmark/${firebaseUid}`,
};

// ========== Auth ==========
export const loginWithGoogleToken = async (
  firebaseIdToken: string
): Promise<AuthResponse> => {
  const res = await api.post(ENDPOINTS.LOGIN, { token: firebaseIdToken });
  setAuthToken(firebaseIdToken);

  if (res.data.user?.email) {
    localStorage.setItem("user_email", res.data.user.email);
  }
  if (res.data.user?.firebase_uid) {
    localStorage.setItem("firebase_uid", res.data.user.firebase_uid);
  }

  return res.data;
};

export const registerWithGoogleToken = async (
  firebaseIdToken: string
): Promise<AuthResponse> => {
  const res = await api.post(ENDPOINTS.REGISTER, { token: firebaseIdToken });
  setAuthToken(firebaseIdToken);

  if (res.data.user?.email) {
    localStorage.setItem("user_email", res.data.user.email);
  }
  if (res.data.user?.firebase_uid) {
    localStorage.setItem("firebase_uid", res.data.user.firebase_uid);
  }

  return res.data;
};

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

export const getStoredAuthData = () => {
  return {
    token: localStorage.getItem("auth_token"),
    email: localStorage.getItem("user_email"),
    firebaseUid: localStorage.getItem("firebase_uid"),
  };
};

// ========== Profile ==========
export const getProfile = async (): Promise<UserProfile> => {
  const res = await api.get(ENDPOINTS.PROFILE);
  return res.data;
};

export const updateProfile = async (
  profileData: ProfileUpdateData
): Promise<{ message: string }> => {
  const formData = new FormData();

  if (profileData.name !== undefined) {
    formData.append("name", profileData.name);
  }

  if (profileData.file) {
    formData.append("file", profileData.file);
  }

  const res = await api.put(ENDPOINTS.PROFILE, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const deleteProfile = async (): Promise<{ message: string }> => {
  const res = await api.delete(ENDPOINTS.PROFILE);
  return res.data;
};

export const getProfileById = async (
  userId: string
): Promise<UserProfile> => {
  const res = await api.get(`${ENDPOINTS.PROFILE}/${userId}`);
  return res.data;
};

// ========== Chat/Agent ==========
export const askAgent = async (query: string, sessionId?: string) => {
  const email = localStorage.getItem("user_email");
  if (!email) throw new Error("Email tidak ditemukan. Harap login ulang.");

  const body = { email, query, session_id: sessionId || null };
  const res = await api.post(ENDPOINTS.ASK_AGENT, body);
  return res.data;
};

// ========== History ==========
export const getUserHistory = async (firebaseUid: string) => {
  const res = await api.get(ENDPOINTS.GET_USER_HISTORY(firebaseUid));
  return res.data;
};

export const getSession = async (
  firebaseUid: string,
  sessionId: string
) => {
  const res = await api.get(ENDPOINTS.GET_SESSION(firebaseUid, sessionId));
  return res.data;
};

export const updateSession = async (
  firebaseUid: string,
  sessionId: string,
  payload: any
) => {
  const res = await api.put(
    ENDPOINTS.UPDATE_SESSION(firebaseUid, sessionId),
    payload
  );
  return res.data;
};

export const deleteSession = async (
  firebaseUid: string,
  sessionId: string
) => {
  const res = await api.delete(
    ENDPOINTS.DELETE_SESSION(firebaseUid, sessionId)
  );
  return res.data;
};

export const addMessageToSession = async (
  firebaseUid: string,
  sessionId: string,
  message: any
) => {
  const res = await api.post(
    ENDPOINTS.ADD_MESSAGE(firebaseUid, sessionId),
    message
  );
  return res.data;
};

// ========== Bookmarks ==========
export const getUserBookmarks = async (firebaseUid: string) => {
  const res = await api.get(ENDPOINTS.BOOKMARKS(firebaseUid));
  return res.data;
};

export const deleteUserBookmarks = async (
  firebaseUid: string,
  sessionId: string
) => {
  const res = await api.delete(
    `/api/bookmark/${firebaseUid}/${sessionId}`
  );
  return res.data;
};

// ========== Utilities ==========
export const healthCheck = async () => {
  const res = await api.get(ENDPOINTS.HEALTH_CHECK);
  return res.data;
};

export const validateImageFile = (file: File): string | null => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  const maxSize = 5 * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    return `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`;
  }

  if (file.size > maxSize) {
    return "File size must be less than 5MB";
  }

  return null;
};

// ========== Logging (Dev Only) ==========
if (process.env.NODE_ENV === "development") {
  api.interceptors.request.use(
    (config) => {
      console.log("API Request:", config.method?.toUpperCase(), config.url);
      return config;
    },
    (error) => {
      console.error("API Request Error:", error);
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      console.log("API Response:", response.status, response.config.url);
      return response;
    },
    (error) => {
      console.error(
        "API Response Error:",
        error.response?.status,
        error.config?.url
      );
      return Promise.reject(error);
    }
  );
}
