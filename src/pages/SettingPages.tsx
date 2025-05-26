import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

const settingsList = [
    {
        label: "Model & Respons",
        description: "Pilih model AI, kreativitas, dan kecepatan balasan.",
        icon: "🧠",
    },
    {
        label: "Bahasa & Terjemahan",
        description: "Pilih bahasa utama dan pengaturan terjemahan.",
        icon: "🌐",
    },
    {
        label: "Suara & Teks",
        description: "Aktifkan TTS (Text-to-Speech) atau suara balasan.",
        icon: "🔊",
    },
    {
        label: "Tema Tampilan",
        description: "Atur tema terang, gelap, atau otomatis.",
        icon: "🎨",
    },
    {
        label: "Riwayat & Reset",
        description: "Kelola histori percakapan atau reset chatbot.",
        icon: "🗑️",
    },
];

const SettingPages: React.FC = () => {
    const [selected, setSelected] = useState(0);
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-[#7c3aed] overflow-hidden">
            {/* Sidebar */}
            <Sidebar
                isCollapsed={isCollapsed}
                onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            />

            {/* Main content */}
            <div
                className={`
                    flex-1 flex flex-col transition-all duration-300
                    ${isCollapsed ? "ml-0" : "ml-48"}
                    bg-gradient-to-b from-[#7c3aed] to-[#312e81]
                `}
            >
                {/* Navbar */}
               <div className="[&>nav]:!relative [&>nav]:!top-auto">
        {/* You can replace this with your Navbar component if available */}
        <div className="flex items-center p-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-indigo-600 transition-colors text-white"
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
        <h1 className="ml-4 text-2xl font-bold text-white">Settings</h1>
        </div>
      </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto">
                    <div className="flex flex-col md:flex-row h-full">
                        {/* Menu */}
                        <div className="w-full md:w-72 bg-white/10 p-4 md:p-6 border-r border-white/10 flex-shrink-0">
                            <div className="flex flex-col gap-2">
                                {settingsList.map((setting, idx) => (
                                    <button
                                        key={setting.label}
                                        className={`flex items-start gap-3 px-4 py-3 rounded-lg transition text-left
                                            ${selected === idx
                                                ? "bg-indigo-600 text-white font-semibold"
                                                : "hover:bg-white/20 text-white/80"}
                                        `}
                                        onClick={() => setSelected(idx)}
                                    >
                                        <span className="text-2xl">{setting.icon}</span>
                                        <span>
                                            <div>{setting.label}</div>
                                            <div className="text-xs text-white/60">{setting.description}</div>
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Detail */}
                        <div className="flex-1 flex justify-center items-center p-6">
                            <div className="bg-white/10 rounded-lg p-8 shadow-lg max-w-xl w-full text-white">
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-3xl">{settingsList[selected].icon}</span>
                                    <h2 className="text-xl font-semibold">
                                        {settingsList[selected].label}
                                    </h2>
                                </div>
                                <p className="mb-6">{settingsList[selected].description}</p>

                                {/* Detail content */}
                                <div className="text-white/80 space-y-4">
                                    {selected === 0 && (
                                        <>
                                            <div>
                                                <label className="block text-sm mb-1">Model AI</label>
                                                <select className="w-full p-2 rounded bg-white/20 text-white">
                                                    <option>GPT-4</option>
                                                    <option>GPT-3.5</option>
                                                    <option>Claude</option>
                                                    <option>Llama 3</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm mb-1">Kreativitas</label>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="1"
                                                    step="0.1"
                                                    className="w-full"
                                                />
                                            </div>
                                        </>
                                    )}
                                    {selected === 1 && (
                                        <>
                                            <div>
                                                <label className="block text-sm mb-1">Bahasa Utama</label>
                                                <select className="w-full p-2 rounded bg-white/20 text-white">
                                                    <option>Indonesia</option>
                                                    <option>English</option>
                                                    <option>日本語</option>
                                                    <option>Español</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm mb-1">Auto-translate</label>
                                                <input type="checkbox" className="mr-2" /> Aktifkan otomatis
                                            </div>
                                        </>
                                    )}
                                    {selected === 2 && (
                                        <div>
                                            <label className="block text-sm mb-1">Text-to-Speech</label>
                                            <input type="checkbox" className="mr-2" /> Aktifkan suara balasan
                                        </div>
                                    )}
                                    {selected === 3 && (
                                        <div>
                                            <label className="block text-sm mb-1">Tema</label>
                                            <select className="w-full p-2 rounded bg-white/20 text-white">
                                                <option>Otomatis</option>
                                                <option>Terang</option>
                                                <option>Gelap</option>
                                            </select>
                                        </div>
                                    )}
                                    {selected === 4 && (
                                        <div className="space-y-4">
                                            <button className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white">
                                                Hapus Semua Riwayat
                                            </button>
                                            <button className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-white">
                                                Reset Chatbot ke Default
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingPages;
