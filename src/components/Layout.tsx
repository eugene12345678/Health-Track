import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Activity, Users, BookMarked as BookMedical, Home, Search, Menu, X, Settings, LogOut, User } from 'lucide-react';

type NavItem = {
  to: string;
  label: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: <Home size={20} /> },
  { to: '/programs', label: 'Programs', icon: <BookMedical size={20} /> },
  { to: '/clients', label: 'Clients', icon: <Users size={20} /> },
  { to: '/search', label: 'Search', icon: <Search size={20} /> }
];

const Layout: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-72 bg-gradient-to-b from-blue-800 to-blue-900 text-white
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        overflow-y-auto
        flex flex-col
      `}>
        {/* Logo and Title */}
        <div className="p-6 flex items-center space-x-3">
          <Activity className="h-8 w-8 text-blue-300 animate-pulse" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-200 to-blue-100 bg-clip-text text-transparent">
            HealthTrack
          </h1>
        </div>

        {/* User Profile Section */}
        <div className="px-6 py-4 border-t border-b border-blue-700/50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <User size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-medium text-blue-100">Welcome,</h2>
              <p className="text-lg font-bold text-white">Eugene Mathenge</p>
              <span className="inline-block px-2 py-1 mt-1 text-xs font-medium bg-blue-700 rounded-full text-blue-100">
                Administrator
              </span>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive(item.to)
                      ? 'bg-gradient-to-r from-blue-700 to-blue-600 shadow-lg scale-105'
                      : 'hover:bg-blue-700/50 hover:scale-105'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-blue-700/50">
          <button className="w-full flex items-center px-4 py-3 text-blue-100 hover:text-white hover:bg-blue-700/50 rounded-lg transition-colors">
            <Settings size={20} className="mr-3" />
            Settings
          </button>
          <button className="w-full flex items-center px-4 py-3 text-blue-100 hover:text-white hover:bg-blue-700/50 rounded-lg transition-colors">
            <LogOut size={20} className="mr-3" />
            Sign Out
          </button>
        </div>
      </aside>
      
      {/* Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-6 lg:p-8 animate-slide-up">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;