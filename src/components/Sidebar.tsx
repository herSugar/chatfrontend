import React, { useState } from 'react';
import { FaBookmark, FaChartBar, FaChevronDown, FaChevronUp, FaComments, FaHistory, FaRobot } from 'react-icons/fa';

const menuItems = [
    { name: "chat", path: "/chat" },
    { name: "history", path: "/history" },
    { name: "statistics", path: "/statistics" },
    { name: "Saves", path: "/" },
];
const Sidebar: React.FC = () => {
    const [isChatDropdownOpen, setChatDropdownOpen] = useState(false);

    return (
        <aside className="w-64 bg-from-indigo-900 to-purple-800 text-white h-screen p-5">
            <nav>
                <div className="flex flex-col items-center mb-2">
                    <img
                        src="/image/logos.png"
                        alt="Logo"
                        className="w-full h-auto object-contain mb-4"
                    />
                </div>
                <ul className="list-none p-0 m-0">
                    {/* Chat Generator Dropdown */}
                    <li>
                        <button
                            onClick={() => setChatDropdownOpen((open) => !open)}
                            className="flex items-center bg-transparent border-none text-inherit w-full py-2 cursor-pointer text-base focus:outline-none"
                        >
                            <FaComments className="mr-2" />
                            Chat Generator
                            {isChatDropdownOpen ? (
                                <FaChevronUp className="ml-auto" />
                            ) : (
                                <FaChevronDown className="ml-auto" />
                            )}
                        </button>
                        {isChatDropdownOpen && (
                            <ul className="list-none pl-8 m-0">
                                <li className="ppy-2 flex items-center">
                                    <FaRobot className="w-6 h-6 mr-2" />
                                    <a href="/chat" className="text-white no-underline hover:underline">
                                        travel agent
                                    </a>
                                </li>
                            </ul>
                        )}
                    </li>
                    {/* Other menu items */}
                    <li className="py-2 flex items-center">
                        <FaHistory className="w-6 h-6 mr-2" />
                        <a href="/history" className="text-white no-underline hover:underline">
                            history
                        </a>
                    </li>
                    <li className="py-2 flex items-center">
                        <FaChartBar className="w-6 h-6 mr-2" />
                        <a href="/statistics" className="text-white no-underline hover:underline">
                            statistics
                        </a>
                    </li>
                    <li className="py-2 flex items-center">
                        <FaBookmark className="w-6 h-6 mr-2" />
                        <a href="/" className="text-white no-underline hover:underline">
                            Saves
                        </a>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
