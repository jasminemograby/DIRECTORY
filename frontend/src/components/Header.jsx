import React from 'react';
import { Menu, Bell, Search, User } from 'lucide-react';

export function Header({ onMenuClick }) {
  return (
    <header className="bg-secondary-800 border-b border-secondary-700 px-4 py-4">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-secondary-400 hover:text-secondary-100 hover:bg-secondary-700"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="hidden lg:block">
            <h1 className="text-xl font-semibold text-secondary-100">
              Directory Dashboard
            </h1>
            <p className="text-sm text-secondary-400">
              Corporate Learning Platform
            </p>
          </div>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search employees, trainers, courses..."
              className="w-full pl-10 pr-4 py-2 bg-secondary-700 border border-secondary-600 rounded-lg text-secondary-100 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-md text-secondary-400 hover:text-secondary-100 hover:bg-secondary-700">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full"></span>
          </button>

          {/* User menu */}
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-secondary-100">John Doe</p>
              <p className="text-xs text-secondary-400">HR Manager</p>
            </div>
            <button className="flex items-center space-x-2 p-2 rounded-lg text-secondary-400 hover:text-secondary-100 hover:bg-secondary-700">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
