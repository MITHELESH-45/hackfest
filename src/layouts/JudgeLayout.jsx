import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Award, History, LogOut, Menu, X } from 'lucide-react';
import clsx from 'clsx';

const NAVIGATION = [
    { name: 'Dashboard', href: '/judge/dashboard', icon: LayoutDashboard },
    { name: 'Evaluate Teams', href: '/judge/evaluate', icon: Award },
    { name: 'History', href: '/judge/history', icon: History },
];

export default function JudgeLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar - Fixed position */}
            <div className={clsx(
                "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white border-r border-gray-200 transition-transform duration-300 h-screen",
                sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                <div className="flex h-16 flex-shrink-0 items-center justify-between px-4 bg-secondary text-white">
                    <span className="text-xl font-bold">Judge Panel</span>
                    <button
                        className="lg:hidden text-white"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                    <nav className="mt-1 flex-1 space-y-1 px-2">
                        {NAVIGATION.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={clsx(
                                        isActive ? 'bg-gray-100 text-secondary' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                                    )}
                                >
                                    <item.icon
                                        className={clsx(
                                            isActive ? 'text-secondary' : 'text-gray-400 group-hover:text-gray-500',
                                            'mr-3 flex-shrink-0 h-6 w-6'
                                        )}
                                        aria-hidden="true"
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
                    <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned Theme</p>
                        <p className="text-sm font-medium text-gray-900 truncate">
                        {typeof user?.assignedTheme === 'object' && user?.assignedTheme?.name
                            ? user.assignedTheme.name
                            : (user?.assignedTheme || '—')}
                    </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="group block w-full flex-shrink-0"
                    >
                        <div className="flex items-center">
                            <div>
                                <LogOut className="inline-block h-5 w-5 text-gray-500 group-hover:text-red-500" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Logout</p>
                                <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">{user?.name}</p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden lg:ml-64">
                <div className="lg:hidden pl-2 pt-2 sm:pl-4 sm:pt-4">
                    <button
                        className="inline-flex h-14 w-14 items-center justify-center rounded-lg bg-white shadow-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <Menu size={32} />
                    </button>
                </div>

                <main className="flex-1 overflow-y-auto focus:outline-none p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
