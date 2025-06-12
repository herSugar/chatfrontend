import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  onClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggleCollapse }) => {
  const [activeItem, setActiveItem] = useState<string>('chat');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/chat')) {
      setActiveItem('chat');
    } else if (location.pathname.startsWith('/history')) {
      setActiveItem('history');
    } else if (location.pathname.startsWith('/saves')) {
      setActiveItem('saves');
    } else if (location.pathname.startsWith('/settings')) {
      setActiveItem('settings');
    } else if (location.pathname.startsWith('/profile')) {
      setActiveItem('profile');
    }
  }, [location.pathname]);

  const menuItems: MenuItem[] = [
    {
      id: 'new-chat',
      label: 'New Chat',
      icon: '🆕',
      onClick: () => {
        localStorage.removeItem('chat_session_id'); // Hapus session
        navigate('/chat');
        window.location.reload();// Load ulang halaman
      },
    },
    {
      id: 'chat',
      label: 'Chat',
      icon: '💬',
      onClick: () => navigate('/chat'), // Lanjutkan session
    },
    {
      id: 'history',
      label: 'Chat History',
      icon: '📋',
      onClick: () => navigate('/history'),
    },
    {
      id: 'saves',
      label: 'Saves',
      icon: '📄',
      onClick: () => navigate('/saves'),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      onClick: () => navigate('/settings'),
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: '👤',
      onClick: () => navigate('/profile'),
    },
  ];

  const handleItemClick = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick();
    }
  };

  return (
    <div
      className={`
        h-full bg-gradient-to-b from-[#7c3aed] to-[#312e81] text-white fixed top-0 left-0 z-30
        transition-transform duration-300 ease-in-out
        ${isCollapsed ? 'w-16 -translate-x-full' : 'w-48 translate-x-0'}
        shadow-xl border-r border-[#7c3aed]
      `}
    >
      {/* Logo */}
      <div className="flex items-center justify-center py-4">
        <img
          src="/image/logop.png"
          alt="Logo"
          className={`transition-all duration-300 ${
            isCollapsed ? 'w-20 h-20' : 'w-32 h-32'
          }`}
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        />
      </div>

      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-[#7c3aed] h-16">
        {!isCollapsed && <h2 className="font-bold text-lg text-white">Menu</h2>}
        <button
          onClick={onToggleCollapse}
          className="p-1 rounded hover:bg-[#7c3aed] transition-colors duration-200 flex items-center justify-center w-8 h-8 text-white"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? '»' : '«'}
        </button>
      </div>

      {/* Menu Items */}
      <div className="p-4 flex-1 overflow-y-auto">
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item)}
                  className={`
                    w-full text-left p-3 rounded-lg cursor-pointer transition-all duration-200
                    flex items-center gap-3
                    ${
                      activeItem === item.id
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'hover:bg-[#7c3aed] text-indigo-100 hover:text-white'
                    }
                    ${isCollapsed ? 'justify-center px-2' : 'justify-start'}
                  `}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className="text-lg flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="font-medium truncate">{item.label}</span>
                  )}
                </button>

                {item.id === 'profile' && (
                  <>
                    {/* Logout Button */}
                    <button
                      onClick={() => {
                        localStorage.clear();
                        navigate('/login');
                      }}
                      className={`mt-2 w-full text-left p-3 rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-3 bg-red-600 text-white hover:bg-red-700 ${
                        isCollapsed ? 'justify-center px-2' : 'justify-start'
                      }`}
                      title={isCollapsed ? 'Logout' : undefined}
                    >
                      <span className="text-lg flex-shrink-0">🚪</span>
                      {!isCollapsed && <span className="font-medium truncate">Logout</span>}
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
