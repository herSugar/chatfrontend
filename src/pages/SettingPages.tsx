import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useTheme } from "../components/ThemeWrapper"; // Only need useTheme hook

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
    const { themeStyles } = useTheme();

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <Sidebar
                isCollapsed={isCollapsed}
                onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            />

            {/* Main content */}
            <div
                className={`
                    flex-1 flex flex-col transition-all duration-300
                    ${isCollapsed ? "ml-0" : "ml-64"}
                `}
            >
                {/* Navbar */}
                <div className={`${themeStyles.card} border-b backdrop-blur-md`}>
                    <div className="flex items-center p-4">
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${themeStyles.buttonSecondary} border`}
                            aria-label="Toggle sidebar"
                        >
                            <span className={`text-lg ${themeStyles.text}`}>☰</span>
                        </button>
                        <h1 className={`ml-4 text-2xl font-bold ${themeStyles.heading}`}>
                            Settings
                        </h1>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto">
                    <div className="flex flex-col md:flex-row h-full">
                        {/* Menu */}
                        <div className={`w-full md:w-72 ${themeStyles.card} p-4 md:p-6 border-r backdrop-blur-sm flex-shrink-0`}>
                            <div className="flex flex-col gap-3">
                                {settingsList.map((setting, idx) => (
                                    <button
                                        key={setting.label}
                                        className={`
                                            group relative flex items-start gap-3 px-4 py-4 rounded-xl 
                                            transition-all duration-300 text-left border
                                            hover:scale-105 hover:shadow-lg
                                            ${selected === idx
                                                ? `${themeStyles.button} shadow-lg border-orange-500/50`
                                                : `${themeStyles.buttonSecondary} hover:shadow-md`
                                            }
                                        `}
                                        onClick={() => setSelected(idx)}
                                    >
                                        {/* Glow effect for selected item */}
                                        {selected === idx && (
                                            <div className={`${themeStyles.buttonGlow} -z-10`} />
                                        )}
                                        
                                        <span className="text-2xl transform group-hover:scale-110 transition-transform duration-300">
                                            {setting.icon}
                                        </span>
                                        <div className="flex-1">
                                            <div className={`font-semibold ${selected === idx ? 'text-white' : themeStyles.text}`}>
                                                {setting.label}
                                            </div>
                                            <div className={`text-xs mt-1 ${selected === idx ? 'text-white/80' : themeStyles.mutedText}`}>
                                                {setting.description}
                                            </div>
                                        </div>
                                        
                                        {/* Selection indicator */}
                                        {selected === idx && (
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white">
                                                →
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Detail */}
                        <div className="flex-1 flex justify-center items-center p-6">
                            <div className={`
                                ${themeStyles.card} rounded-2xl p-8 shadow-2xl max-w-xl w-full border
                                backdrop-blur-md transform hover:scale-105 transition-all duration-300
                                animate-slide-in
                            `}>
                                {/* Header */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`
                                        w-12 h-12 rounded-xl ${themeStyles.logoContainer} border 
                                        flex items-center justify-center transform hover:rotate-12 transition-transform
                                    `}>
                                        <span className="text-2xl">{settingsList[selected].icon}</span>
                                    </div>
                                    <div>
                                        <h2 className={`text-xl font-bold ${themeStyles.heading}`}>
                                            {settingsList[selected].label}
                                        </h2>
                                        <p className={`text-sm ${themeStyles.mutedText} mt-1`}>
                                            {settingsList[selected].description}
                                        </p>
                                    </div>
                                </div>

                                {/* Detail content */}
                                <div className={`${themeStyles.text} space-y-6`}>
                                    {selected === 0 && (
                                        <div className="space-y-4">
                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${themeStyles.subheading}`}>
                                                    Model AI
                                                </label>
                                                <select className={`
                                                    w-full p-3 rounded-lg border transition-all duration-300
                                                    ${themeStyles.card} ${themeStyles.text}
                                                    focus:outline-none focus:ring-2 focus:ring-orange-500/50
                                                    hover:shadow-md
                                                `}>
                                                    <option>GPT-4</option>
                                                    <option>GPT-3.5</option>
                                                    <option>Claude</option>
                                                    <option>Llama 3</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${themeStyles.subheading}`}>
                                                    Kreativitas
                                                </label>
                                                <div className="space-y-2">
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="1"
                                                        step="0.1"
                                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                                    />
                                                    <div className="flex justify-between text-xs text-gray-500">
                                                        <span>Conservative</span>
                                                        <span>Creative</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {selected === 1 && (
                                        <div className="space-y-4">
                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${themeStyles.subheading}`}>
                                                    Bahasa Utama
                                                </label>
                                                <select className={`
                                                    w-full p-3 rounded-lg border transition-all duration-300
                                                    ${themeStyles.card} ${themeStyles.text}
                                                    focus:outline-none focus:ring-2 focus:ring-orange-500/50
                                                    hover:shadow-md
                                                `}>
                                                    <option>Indonesia</option>
                                                    <option>English</option>
                                                    <option>日本語</option>
                                                    <option>Español</option>
                                                </select>
                                            </div>
                                            <div className={`flex items-center space-x-3 p-3 rounded-lg ${themeStyles.buttonSecondary} border`}>
                                                <input 
                                                    type="checkbox" 
                                                    className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500" 
                                                />
                                                <label className={`text-sm font-medium ${themeStyles.text}`}>
                                                    Aktifkan terjemahan otomatis
                                                </label>
                                            </div>
                                        </div>
                                    )}
                                    {selected === 2 && (
                                        <div className={`flex items-center space-x-3 p-3 rounded-lg ${themeStyles.buttonSecondary} border`}>
                                            <input 
                                                type="checkbox" 
                                                className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500" 
                                            />
                                            <label className={`text-sm font-medium ${themeStyles.text}`}>
                                                Aktifkan suara balasan (Text-to-Speech)
                                            </label>
                                        </div>
                                    )}
                                    {selected === 3 && (
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${themeStyles.subheading}`}>
                                                Tema Tampilan
                                            </label>
                                            <select className={`
                                                w-full p-3 rounded-lg border transition-all duration-300
                                                ${themeStyles.card} ${themeStyles.text}
                                                focus:outline-none focus:ring-2 focus:ring-orange-500/50
                                                hover:shadow-md
                                            `}>
                                                <option>Otomatis (Ikuti sistem)</option>
                                                <option>Terang</option>
                                                <option>Gelap</option>
                                            </select>
                                        </div>
                                    )}
                                    {selected === 4 && (
                                        <div className="space-y-4">
                                            <div className="space-y-3">
                                                <button className={`
                                                    group relative w-full px-6 py-3 rounded-xl 
                                                    bg-red-500 hover:bg-red-600 text-white font-semibold
                                                    transition-all duration-300 hover:scale-105 hover:shadow-lg
                                                    border border-red-400/30
                                                `}>
                                                    <div className="absolute -inset-2 bg-gradient-to-r from-red-400 to-red-600 rounded-xl opacity-0 group-hover:opacity-30 blur-md transition-all duration-500 -z-10" />
                                                    🗑️ Hapus Semua Riwayat
                                                </button>
                                                <button className={`
                                                    group relative w-full px-6 py-3 rounded-xl 
                                                    bg-yellow-500 hover:bg-yellow-600 text-white font-semibold
                                                    transition-all duration-300 hover:scale-105 hover:shadow-lg
                                                    border border-yellow-400/30
                                                `}>
                                                    <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl opacity-0 group-hover:opacity-30 blur-md transition-all duration-500 -z-10" />
                                                    🔄 Reset Chatbot ke Default
                                                </button>
                                            </div>
                                            <div className={`p-4 rounded-lg ${themeStyles.buttonSecondary} border`}>
                                                <p className={`text-sm ${themeStyles.mutedText}`}>
                                                    ⚠️ Tindakan ini tidak dapat dibatalkan. Pastikan Anda telah membackup data penting.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom styles for range slider */}
            <style>{`
                .slider::-webkit-slider-thumb {
                    appearance: none;
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: #fb923c;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    transition: all 0.3s ease;
                }
                .slider::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                    box-shadow: 0 4px 8px rgba(251, 146, 60, 0.3);
                }
                .slider::-webkit-slider-track {
                    height: 8px;
                    border-radius: 4px;
                    background: linear-gradient(to right, #fb923c, #f97316);
                }
                .slider::-moz-range-thumb {
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: #fb923c;
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
                .slider::-moz-range-track {
                    height: 8px;
                    border-radius: 4px;
                    background: linear-gradient(to right, #fb923c, #f97316);
                }
            `}</style>
        </div>
    );
};

export default SettingPages;