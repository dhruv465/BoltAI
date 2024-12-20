import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Bot, LogOut, Settings, Layout, MessageSquare, Menu, X } from 'lucide-react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { Scripts } from './dashboard/Scripts';
import { Settings as SettingsPage } from './dashboard/Settings';

export const Dashboard = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => {
    return (
      location.pathname === path || 
      (path === '/dashboard' && location.pathname === '/')
    );
  };

  const navLinkClass = (path) => `
    flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium
    transition-colors duration-200
    ${isActive(path) 
      ? 'text-white bg-gray-800/50' 
      : 'text-gray-300 hover:text-white hover:bg-gray-800/30'}
  `;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Left Side Navigation */}
            <div className="flex items-center">
              <Link 
                to="/dashboard" 
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              >
                <Bot className="w-6 h-6 text-blue-500" />
                <span className="font-bold text-lg">ScriptGenie</span>
              </Link>

              {/* Desktop Navigation Links */}
              <div className="hidden sm:flex ml-10 items-center space-x-1">
                <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                  <Layout className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                <Link to="/dashboard/scripts" className={navLinkClass('/dashboard/scripts')}>
                  <MessageSquare className="w-5 h-5" />
                  <span>Scripts</span>
                </Link>
                <Link to="/dashboard/settings" className={navLinkClass('/dashboard/settings')}>
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </Link>
              </div>
            </div>

            {/* Right Side User Info */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                <img
                  src={user?.imageUrl}
                  alt={user?.firstName || 'User'}
                  className="w-8 h-8 rounded-full"
                />
              </div>
              <button
                onClick={() => signOut()}
                className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="sm:hidden p-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="sm:hidden pb-4 space-y-1">
              <Link 
                to="/dashboard" 
                className={navLinkClass('/dashboard')}
                onClick={() => setIsMenuOpen(false)}
              >
                <Layout className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
              <Link 
                to="/dashboard/scripts" 
                className={navLinkClass('/dashboard/scripts')}
                onClick={() => setIsMenuOpen(false)}
              >
                <MessageSquare className="w-5 h-5" />
                <span>Scripts</span>
              </Link>
              <Link 
                to="/dashboard/settings" 
                className={navLinkClass('/dashboard/settings')}
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8">
        <Routes>
          <Route path="/" element={<Scripts />} />
          <Route path="/scripts" element={<Scripts />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
};