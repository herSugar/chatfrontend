import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaUser, FaEnvelope, FaCamera, FaTimes } from "react-icons/fa";
import { useTheme } from "../components/ThemeWrapper";
import Sidebar from "../components/Sidebar";

type UserProfile = {
  email: string;
  name?: string;
  picture?: string; // base64 data:image/... string
};

const ProfilePage = () => {
  const { themeStyles, isDarkMode } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [picture, setPicture] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState("");

  const token = localStorage.getItem("auth_token");

  // File validation
  const validateFile = (file: File): string | null => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return "Tipe file tidak didukung. Gunakan: JPEG, PNG, GIF, atau WebP";
    }

    if (file.size > maxSize) {
      return "Ukuran file maksimal 5MB";
    }

    return null;
  };

  const fetchProfile = async () => {
    if (!token) {
      toast.error("Token tidak ditemukan, silakan login ulang", {
        position: "top-center",
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          toast.error("Sesi telah berakhir, silakan login ulang", {
            position: "top-center",
          });
          localStorage.removeItem("auth_token");
          return;
        }
        throw new Error("Gagal mengambil profil");
      }

      const data: UserProfile = await res.json();
      setProfile(data);
      setName(data.name || "");
      setPreview(data.picture || "");
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Gagal memuat profil");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!token) {
      toast.error("Token tidak ditemukan, silakan login ulang", {
        position: "top-center",
      });
      return;
    }

    if (!name.trim() && !picture) {
      toast.error("Harap isi nama atau pilih foto profil", {
        position: "top-center",
      });
      return;
    }

    try {
      setUpdating(true);
      const formData = new FormData();

      if (name.trim()) {
        formData.append("name", name.trim());
      }

      if (picture) {
        formData.append("file", picture);
      }

      const res = await fetch("http://localhost:8000/api/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Gagal update profil");
      }

      toast.success("Profil berhasil diperbarui", { position: "top-center" });

      setEditMode(false);
      setPicture(null);

      await fetchProfile();
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error(
        err instanceof Error ? err.message : "Gagal memperbarui profil",
        {
          position: "top-center",
        }
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      toast.error(validationError, { position: "top-center" });
      e.target.value = "";
      return;
    }

    setPicture(file);

    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
  };

  const handleCancel = () => {
    setEditMode(false);
    setPicture(null);

    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setPreview(profile?.picture || "");
    setName(profile?.name || "");
  };

  const handleRemovePhoto = () => {
    setPicture(null);

    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setPreview("");
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    if (profile?.name) {
      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        profile.name
      )}&background=${isDarkMode ? "374151" : "f3f4f6"}&color=${
        isDarkMode ? "ffffff" : "000000"
      }&size=200`;
    }
  };

  const handleOpenEditModal = () => {
    if (!profile) return;
    setEditName(profile.name || "");
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditName("");
  };

  const handleSaveNameUpdate = async () => {
    if (!profile || editName === profile.name) {
      handleCloseEditModal();
      return;
    }

    setName(editName);
    await updateProfile();
    handleCloseEditModal();
  };

  const handleEditProfile = () => {
    setEditMode(true);
  };

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden transition-colors duration-500">
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-500 ease-in-out ${
          isCollapsed ? "ml-0" : "ml-64"
        } relative`}
      >
        {/* Header */}
        <div
          className={`sticky top-0 z-40 backdrop-blur-md ${
            isDarkMode
              ? "bg-black/20 border-white/20"
              : "bg-white/20 border-black/20"
          } border-b`}
        >
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={`p-2 rounded-lg hover:${
                  themeStyles.buttonSecondary
                    .replace("bg-", "hover:bg-")
                    .split(" ")[0]
                } transition-colors ${themeStyles.heading}`}
              >
                ☰
              </button>
              <h1 className={`ml-4 text-2xl font-bold ${themeStyles.heading}`}>
                Profile
              </h1>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden relative">
          <div className="flex flex-col h-full min-h-0 container mx-auto pr-2">
            <div className="flex-1 overflow-y-auto p-6 min-h-0">
              {loading && !profile ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex items-center space-x-2">
                    {Array.from({ length: 3 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-4 h-4 ${
                          isDarkMode ? "bg-orange-400" : "bg-orange-600"
                        } rounded-full animate-pulse`}
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                    <span>Loading profile...</span>
                  </div>
                </div>
              ) : error ? (
                <div
                  className={`flex flex-col items-center justify-center h-full space-y-4 ${themeStyles.text}`}
                >
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center ${
                      isDarkMode ? "bg-red-500/20" : "bg-red-100/60"
                    }`}
                  >
                    <span className="text-2xl text-red-500">⚠️</span>
                  </div>
                  <p className="text-2xl font-bold">{error}</p>
                  <button
                    onClick={fetchProfile}
                    className={`px-6 py-3 rounded-xl border ${
                      isDarkMode
                        ? "bg-orange-500/20 border-orange-400/40"
                        : "bg-orange-100/60 border-orange-500/40"
                    } transition-all hover:scale-105`}
                  >
                    Try Again
                  </button>
                </div>
              ) : profile ? (
                <div className="max-w-4xl mx-auto space-y-6">
                  {/* Profile Card */}
                  <div
                    className={`p-8 rounded-xl shadow-lg border backdrop-blur-sm ${
                      isDarkMode
                        ? "bg-black/20 border-white/20"
                        : "bg-white/20 border-black/20"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      {/* Profile Picture */}
                      <div className="relative">
                        <div
                          className={`w-32 h-32 rounded-full overflow-hidden shadow-2xl border-4 ${
                            isDarkMode
                              ? "border-orange-400/40"
                              : "border-orange-500/40"
                          }`}
                        >
                          <img
                            src={
                              preview ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                profile.name || "User"
                              )}&size=200&background=${
                                isDarkMode ? "374151" : "f3f4f6"
                              }&color=${isDarkMode ? "ffffff" : "000000"}`
                            }
                            alt={profile.name || "User"}
                            className="w-full h-full object-cover"
                            onError={handleImageError}
                          />
                        </div>
                        {editMode && (
                          <button
                            onClick={handleRemovePhoto}
                            className={`absolute -top-2 -right-2 w-8 h-8 rounded-full ${
                              isDarkMode
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-red-500 hover:bg-red-600"
                            } text-white text-sm font-bold transition-all duration-200 transform hover:scale-110 shadow-lg`}
                          >
                            ×
                          </button>
                        )}
                      </div>

                      {/* Profile Info */}
                      <div className="flex-1 text-center md:text-left space-y-4">
                        <div>
                          <h2
                            className={`text-3xl font-bold ${themeStyles.heading}`}
                          >
                            {profile.name || "User"}
                          </h2>
                          <p className={`text-lg ${themeStyles.mutedText}`}>
                            {profile.email}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                            isDarkMode
                              ? "bg-green-500/20 text-green-400 border-green-400/40"
                              : "bg-green-100/60 text-green-700 border-green-500/40"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${
                              isDarkMode ? "bg-green-400" : "bg-green-500"
                            }`}
                          />
                          Active
                        </span>
                      </div>

                      {/* Edit Button */}
                      <button
                        onClick={handleEditProfile}
                        disabled={updating}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-xl border transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                          isDarkMode
                            ? "bg-orange-500/20 border-orange-400/40"
                            : "bg-orange-100/60 border-orange-500/40"
                        } ${themeStyles.text}`}
                      >
                        <FaEdit className="text-sm" />
                        <span>{updating ? "Updating..." : "Edit Profile"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Edit Mode Form */}
                  {editMode && (
                    <div
                      className={`p-8 rounded-xl shadow-lg border backdrop-blur-sm ${
                        isDarkMode
                          ? "bg-black/20 border-white/20"
                          : "bg-white/20 border-black/20"
                      }`}
                    >
                      <h3
                        className={`text-xl font-semibold mb-6 ${themeStyles.heading}`}
                      >
                        Edit Profile
                      </h3>
                      <div className="space-y-6">
                        {/* Name Field */}
                        <div>
                          <label
                            className={`block text-sm font-semibold mb-2 ${themeStyles.subheading}`}
                          >
                            Name
                          </label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            className={`w-full p-4 rounded-lg border-2 transition-all duration-300 ${
                              isDarkMode
                                ? "bg-gray-700 border-orange-400/50 text-white focus:border-orange-400"
                                : "bg-white border-orange-300 text-gray-800 focus:border-orange-500"
                            } focus:outline-none focus:ring-2 focus:ring-orange-200 shadow-lg`}
                          />
                        </div>

                        {/* File Upload Field */}
                        <div>
                          <label
                            className={`block text-sm font-semibold mb-2 ${themeStyles.subheading}`}
                          >
                            Profile Picture
                          </label>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            onChange={handleFileChange}
                            className={`w-full p-4 rounded-lg border-2 transition-all duration-300 ${
                              isDarkMode
                                ? "bg-gray-700 border-orange-400/50 text-white file:bg-orange-500 file:text-white"
                                : "bg-white border-orange-300 text-gray-800 file:bg-orange-500 file:text-white"
                            } file:border-0 file:rounded-lg file:px-4 file:py-2 file:mr-4 file:font-medium hover:file:bg-orange-600 file:transition-colors shadow-lg`}
                          />
                          <p
                            className={`text-xs mt-2 ${themeStyles.mutedText}`}
                          >
                            Maksimal 5MB. Format: JPEG, PNG, GIF, WebP
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-4">
                          <button
                            onClick={updateProfile}
                            disabled={updating}
                            className={`group relative px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:opacity-60 ${
                              isDarkMode
                                ? "bg-green-600 hover:bg-green-500 text-white"
                                : "bg-green-600 hover:bg-green-700 text-white"
                            } shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center`}
                          >
                            {updating ? (
                              <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                Saving...
                              </>
                            ) : (
                              "Save Changes"
                            )}
                          </button>
                          <button
                            onClick={handleCancel}
                            disabled={updating}
                            className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:opacity-60 ${themeStyles.buttonSecondary} shadow-lg hover:shadow-xl disabled:cursor-not-allowed`}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Profile Details */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Personal Info */}
                    <div
                      className={`p-6 rounded-xl border shadow-lg backdrop-blur-sm transition-all hover:scale-[1.02] ${
                        isDarkMode
                          ? "bg-black/20 border-white/20"
                          : "bg-white/20 border-black/20"
                      }`}
                    >
                      <h3
                        className={`text-xl font-semibold mb-4 flex items-center ${themeStyles.heading}`}
                      >
                        <FaUser className="mr-3 text-orange-500" />
                        Personal Information
                      </h3>
                      <div className="space-y-4">
                        <div
                          className={`flex justify-between py-3 border-b ${
                            isDarkMode ? "border-white/10" : "border-black/10"
                          }`}
                        >
                          <span
                            className={`${themeStyles.mutedText} font-medium`}
                          >
                            Full Name
                          </span>
                          <span className={`${themeStyles.text} font-medium`}>
                            {profile.name || "Not set"}
                          </span>
                        </div>
                        <div className="flex justify-between py-3">
                          <span
                            className={`${themeStyles.mutedText} font-medium flex items-center`}
                          >
                            <FaEnvelope className="mr-2" />
                            Email
                          </span>
                          <span
                            className={`${themeStyles.text} font-medium break-all`}
                          >
                            {profile.email}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Account Info */}
                    <div
                      className={`p-6 rounded-xl border shadow-lg backdrop-blur-sm transition-all hover:scale-[1.02] ${
                        isDarkMode
                          ? "bg-black/20 border-white/20"
                          : "bg-white/20 border-black/20"
                      }`}
                    >
                      <h3
                        className={`text-xl font-semibold mb-4 ${themeStyles.heading}`}
                      >
                        Account Information
                      </h3>
                      <div className="space-y-4">
                        <div
                          className={`flex justify-between py-3 border-b ${
                            isDarkMode ? "border-white/10" : "border-black/10"
                          }`}
                        >
                          <span
                            className={`${themeStyles.mutedText} font-medium`}
                          >
                            Status
                          </span>
                          <span className="text-green-500 font-medium">
                            Active
                          </span>
                        </div>
                        <div className="flex justify-between py-3">
                          <span
                            className={`${themeStyles.mutedText} font-medium`}
                          >
                            Member Since
                          </span>
                          <span className={`${themeStyles.text} font-medium`}>
                            Today
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Loading Indicator */}
                  {updating && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                      <div
                        className={`p-6 rounded-xl ${
                          isDarkMode ? "bg-gray-800" : "bg-white"
                        } flex items-center space-x-3`}
                      >
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                        <span className={themeStyles.text}>
                          Updating profile...
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className={`flex flex-col items-center justify-center h-full space-y-4 ${themeStyles.text}`}
                >
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center ${
                      isDarkMode ? "bg-gray-500/20" : "bg-gray-100/60"
                    }`}
                  >
                    <FaUser className="text-3xl text-gray-500" />
                  </div>
                  <p className="text-xl">No profile data available</p>
                  <button
                    onClick={fetchProfile}
                    className={`px-6 py-3 rounded-xl border ${
                      isDarkMode
                        ? "bg-orange-500/20 border-orange-400/40"
                        : "bg-orange-100/60 border-orange-500/40"
                    } transition-all hover:scale-105`}
                  >
                    Reload Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Name Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className={`w-full max-w-md p-6 rounded-xl shadow-2xl border ${
              isDarkMode
                ? "bg-gray-800 border-white/20"
                : "bg-white border-black/20"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xl font-semibold ${themeStyles.heading}`}>
                Edit Profile Name
              </h3>
              <button
                onClick={handleCloseEditModal}
                className={`p-2 rounded-lg hover:${
                  isDarkMode ? "bg-white/10" : "bg-black/10"
                } transition-colors ${themeStyles.text}`}
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${themeStyles.mutedText}`}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                    isDarkMode
                      ? "bg-gray-700/50 border-white/20 text-white placeholder-gray-400"
                      : "bg-white/50 border-black/20 text-black placeholder-gray-600"
                  }`}
                  placeholder="Enter your full name"
                  autoFocus
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleCloseEditModal}
                  className={`flex-1 px-4 py-3 rounded-lg border transition-all hover:scale-105 ${
                    isDarkMode
                      ? "bg-gray-600/20 border-gray-500/40 text-gray-300 hover:bg-gray-600/30"
                      : "bg-gray-100/60 border-gray-400/40 text-gray-700 hover:bg-gray-100/80"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNameUpdate}
                  disabled={updating || !editName.trim()}
                  className={`flex-1 px-4 py-3 rounded-lg border transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isDarkMode
                      ? "bg-orange-500/20 border-orange-400/40 text-orange-400 hover:bg-orange-500/30"
                      : "bg-orange-100/60 border-orange-500/40 text-orange-700 hover:bg-orange-100/80"
                  }`}
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
