import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/shared/components/Sidebar';
import { Menu } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { Toaster } from 'react-hot-toast';

/**
 * Main application layout.
 * Includes Responsive Sidebar and Content area.
 */

export const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Toast notifications */}
      <Toaster position="top-right" />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Persistent on Desktop, Toggleable on Mobile */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 flex items-center px-6 bg-white border-b border-gray-100 flex-shrink-0">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2"
          >
            <Menu size={24} />
          </Button>
          <span className="ml-4 font-bold text-gray-900">TOEIC Vocab</span>
        </header>

        {/* Content Wrapper */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-10">
          <div className="max-w-6xl mx-auto h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};
