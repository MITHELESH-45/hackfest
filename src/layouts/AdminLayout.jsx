import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard, Calendar, Users, Briefcase, Award,
    Shield, LogOut, Menu, X, FileText, Download
} from 'lucide-react';
import clsx from 'clsx';

const NAVIGATION = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Hackathon Setup', href: '/admin/hackathon', icon: Calendar },
    { name: 'Timeline', href: '/admin/timeline', icon: FileText },
    { name: 'Themes', href: '/admin/themes', icon: Briefcase },
    { name: 'Teams', href: '/admin/teams', icon: Users },
    { name: 'Judges', href: '/admin/judges', icon: Shield },
    { name: 'Credentials', href: '/admin/credentials', icon: Download },
    { name: 'Rounds', href: '/admin/rounds', icon: Award },
    { name: 'Monitoring', href: '/admin/monitoring', icon: LayoutDashboard }, // Reusing icon for now
    { name: 'Complaints', href: '/admin/complaints', icon: FileText },
    { name: 'Leaderboard', href: '/admin/leaderboard', icon: Award },
];

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-transparent flex">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar - Fixed position */}
            <div className={clsx(
                "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white/70 backdrop-blur-2xl border-r border-white/50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-transform duration-300 h-screen",
                sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                <div className="flex h-16 flex-shrink-0 items-center justify-between px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    <span className="text-xl font-bold tracking-tight relative z-10 flex items-center gap-2">
                        Admin Portal
                    </span>
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
                                        isActive ? 'sidebar-item-active shadow-sm my-1' : 'text-slate-600 hover:bg-indigo-50/50 hover:text-indigo-900 border-l-4 border-transparent my-1',
                                        'group flex items-center px-4 py-2.5 text-sm font-semibold rounded-r-full transition-all duration-200'
                                    )}
                                >
                                    <item.icon
                                        className={clsx(
                                            isActive ? 'text-indigo-600 z-10' : 'text-slate-400 group-hover:text-indigo-500',
                                            'mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200'
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
                        className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-sm text-slate-600 hover:text-indigo-600 hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
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
