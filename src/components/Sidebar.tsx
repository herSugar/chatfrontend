import React, { useState } from 'react';

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

  const menuItems: MenuItem[] = [
    {
      id: 'chat',
      label: 'New Chat',
      icon: '💬',
      onClick: () => {
        setActiveItem('chat');
        console.log('New Chat clicked');
      }
    },
    {
      id: 'history',
      label: 'Chat History',
      icon: '📋',
      onClick: () => {
        setActiveItem('history');
        console.log('Chat History clicked');
      }
    },
    {
      id: 'saves',
      label: 'Saves',
      icon: '📄',
      onClick: () => {
        setActiveItem('saves');
        console.log('Saves clicked');
      }
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      onClick: () => {
        setActiveItem('settings');
        console.log('Settings clicked');
      }
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: '👤',
      onClick: () => {
        setActiveItem('profile');
        console.log('Profile clicked');
      }
    }
  ];

  const handleItemClick = (item: MenuItem) => {
    setActiveItem(item.id);
    if (item.onClick) {
      item.onClick();
    }
  };

  return (
    <div className={`
      h-full bg-gradient-to-b from-[#7c3aed] to-[#312e81] text-white fixed top-0 left-0 z-30
      transition-transform duration-300 ease-in-out
      ${isCollapsed ? 'w-16 -translate-x-full' : 'w-48 translate-x-0'}
      shadow-xl border-r border-[#7c3aed]
    `}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-[#7c3aed] h-16">
        {!isCollapsed && (
          <h2 className="font-bold text-lg text-white">Menu</h2>
        )}
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
                    ${activeItem === item.id 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'hover:bg-[#7c3aed] text-indigo-100 hover:text-white'
                    }
                    ${isCollapsed ? 'justify-center px-2' : 'justify-start'}
                  `}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className="text-lg flex-shrink-0">
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span className="font-medium truncate">
                      {item.label}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;