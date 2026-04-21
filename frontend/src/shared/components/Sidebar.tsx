import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Languages, 
  CreditCard, 
  Trophy, 
  AlertCircle, 
  Settings,
  X
} from 'lucide-react';
import { cn } from '@/shared/utils/cn';

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: BookOpen, label: 'Chủ đề', path: '/topics' },
    { icon: Languages, label: 'Từ vựng', path: '/vocabulary' },
    { icon: CreditCard, label: 'Flashcards', path: '/flashcard' },
    { icon: Trophy, label: 'Làm bài test', path: '/test' },
    { icon: AlertCircle, label: 'Lịch sử lỗi', path: '/mistakes' },
    { icon: Settings, label: 'Cài đặt', path: '/settings' },
  ];

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100">
      {/* Brand */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg">
            <Languages className="text-white" size={20} />
          </div>
          <span className="text-lg font-bold text-gray-900">TOEIC Vocab</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium',
              isActive 
                ? 'bg-primary/5 text-primary border border-primary/10 shadow-sm' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
            )}
            onClick={onClose}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer / User Profile Placeholder */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">Demo User</p>
            <p className="text-xs text-gray-500 truncate">1@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};
