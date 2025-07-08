import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type UserProfile = {
  email: string;
  name?: string;
  picture?: string;
};

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [picture, setPicture] = useState<string>("");

  const token = localStorage.getItem("auth_token");

  const fetchProfile = async () => {
    try {
      const res = await fetch("http://localhost:8000/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Gagal mengambil profil");

      const data: UserProfile = await res.json();
      setProfile(data);
      setName(data.name || "");
      setPicture(data.picture || "");
    } catch (err) {
      toast.error("Gagal memuat profil", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      const res = await fetch("http://localhost:8000/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, picture }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Gagal update profil");
      }

      const result = await res.json();
      setProfile(result.user);
      setEditMode(false);
      toast.success("Profil berhasil diperbarui", { position: "top-center" });
    } catch (err) {
      toast.error("Gagal memperbarui profil", { position: "top-center" });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded-md shadow">
      <h2 className="text-2xl font-semibold mb-4">Profil Pengguna</h2>

      {profile && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              value={profile.email}
              disabled
              className="mt-1 block w-full p-2 border rounded bg-gray-100"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Nama
            </label>
            <input
              type="text"
              value={name}
              disabled={!editMode}
              onChange={(e) => setName(e.target.value)}
              className={`mt-1 block w-full p-2 border rounded ${
                editMode ? "" : "bg-gray-100"
              }`}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              URL Foto
            </label>
            <input
              type="text"
              value={picture}
              disabled={!editMode}
              onChange={(e) => setPicture(e.target.value)}
              className={`mt-1 block w-full p-2 border rounded ${
                editMode ? "" : "bg-gray-100"
              }`}
            />
          </div>

          {picture && (
            <img
              src={picture}
              alt="Foto Profil"
              className="w-24 h-24 rounded-full mb-4 object-cover"
            />
          )}

          <div className="flex justify-between">
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Edit Profil
              </button>
            ) : (
              <>
                <button
                  onClick={updateProfile}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Simpan
                </button>
                <button
                  onClick={() => {
                    setName(profile.name || "");
                    setPicture(profile.picture || "");
                    setEditMode(false);
                  }}
                  className="ml-2 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Batal
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
