'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLogout } from '@/hooks/auth/use-auth-queries';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const logoutMutation = useLogout();

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
        </svg>
      )
    },
    {
      name: 'User Management',
      href: '/dashboard/users',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.99L14 10.5 12.01 8.99A2.5 2.5 0 0 0 10 8H8.46c-.8 0-1.54.37-2.01.99L4 10.5V22h2v-6h2.5l2.54-7.63A1.5 1.5 0 0 1 12.46 8H14c.8 0 1.54.37 2.01.99L18 10.5V22h2z"/>
        </svg>
      )
    },
    {
      name: 'Content Moderations',
      href: '/dashboard/moderations',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
        </svg>
      )
    },
    {
      name: 'All Testimonies',
      href: '/dashboard/testimonies',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16,4C16.88,4 17.67,4.84 17.67,5.67C17.67,6.5 16.88,7.33 16,7.33C15.12,7.33 14.33,6.5 14.33,5.67C14.33,4.84 15.12,4 16,4M16,8.33C17.73,8.33 19.17,6.89 19.17,5.17C19.17,3.44 17.73,2 16,2C14.27,2 12.83,3.44 12.83,5.17C12.83,6.89 14.27,8.33 16,8.33M16,9.5C13.24,9.5 10.83,11.91 10.83,14.67V16.5H21.17V14.67C21.17,11.91 18.76,9.5 16,9.5M8,4C8.88,4 9.67,4.84 9.67,5.67C9.67,6.5 8.88,7.33 8,7.33C7.12,7.33 6.33,6.5 6.33,5.67C6.33,4.84 7.12,4 8,4M8,8.33C9.73,8.33 11.17,6.89 11.17,5.17C11.17,3.44 9.73,2 8,2C6.27,2 4.83,3.44 4.83,5.17C4.83,6.89 6.27,8.33 8,8.33M8,9.5C5.24,9.5 2.83,11.91 2.83,14.67V16.5H13.17V14.67C13.17,11.91 10.76,9.5 8,9.5Z"/>
        </svg>
      )
    }
  ];

  const generalItems = [
    {
      name: 'Settings Analytics',
      href: '/dashboard/settings',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
        </svg>
      )
    }
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-6">
            <h1 className="text-xl font-bold text-gray-900">HTFC</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-6">
            {/* Main Menu */}
            <div>
              <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Main Menu
              </h3>
              <div className="space-y-1">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-gray-200 text-gray-900 font-bold'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className={`mr-3 ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* General */}
            <div>
              <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                General
              </h3>
              <div className="space-y-1">
                {generalItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-gray-200 text-gray-900 font-bold'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className={`mr-3 ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Logout */}
          <div className="p-6">
            <button
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>{logoutMutation.isPending ? 'Logging out...' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
