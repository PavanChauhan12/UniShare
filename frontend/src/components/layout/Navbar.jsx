import React, { useState } from 'react';
import { Bell, Menu, X } from 'lucide-react';
import { useAuth } from './context/AuthContext';

const Navbar = ({ onToggleSidebar, sidebarOpen }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useAuth();

  const notifications = [
    { id: 1, title: 'Book due tomorrow', message: 'JavaScript Guide is due tomorrow', type: 'warning' },
    { id: 2, title: 'Borrow request approved', message: 'Your request for Calculator has been approved', type: 'success' },
    { id: 3, title: 'New feedback received', message: 'John rated your Textbook (5 stars)', type: 'info' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="text-xl font-bold text-gray-900">UniShare</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-gray-100 rounded-lg relative"
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-medium text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                      <h4 className="font-medium text-sm text-gray-900">{notification.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <img
              src={`https://ui-avatars.com/api/?name=${user?.name}&background=6366f1&color=ffffff`}
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">Score: {user?.credibilityScore}</p>
            </div>
            <button
              onClick={logout}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
