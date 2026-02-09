import { useHackathon } from '../../context/HackathonContext';
import { hackathonApi } from '../../api/hackathonApi';
import React, { useState, useEffect } from 'react';
import VerticalTimeline from '../../components/timeline/VerticalTimeline';
import { Users, Briefcase, Award, Clock } from 'lucide-react';

export default function AdminDashboard() {
    const { hackathon, activeSlot } = useHackathon();
    const [statsData, setStatsData] = useState({ teams: 0, judges: 0, themes: 0, round: 1 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await hackathonApi.getStats();
                if (res.success) {
                    setStatsData(res.data);
                }
            } catch (err) {
                console.error("Failed to fetch stats", err);
            }
        };
        fetchStats();
    }, []);

    const stats = [
        { name: 'Total Teams', value: statsData.teams, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
        { name: 'Total Judges', value: statsData.judges, icon: Award, color: 'text-purple-600', bg: 'bg-purple-100' },
        { name: 'Themes', value: statsData.themes, icon: Briefcase, color: 'text-green-600', bg: 'bg-green-100' },
        { name: 'Round', value: statsData.round, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-500">Overview of {hackathon?.name || 'Hackathon'}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((item) => (
                    <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg p-5">
                        <div className="flex items-center">
                            <div className={`flex-shrink-0 rounded-md p-3 ${item.bg}`}>
                                <item.icon className={`h-6 w-6 ${item.color}`} />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                                    <dd>
                                        <div className="text-lg font-medium text-gray-900">{item.value}</div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Timeline Column */}
                <div className="bg-white shadow rounded-lg p-6 lg:col-span-1">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Live Timeline</h2>
                    <VerticalTimeline />
                </div>

                {/* Current Activity / Evaluation Status */}
                <div className="bg-white shadow rounded-lg p-6 lg:col-span-2">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Current Status</h2>
                    <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                        {activeSlot ? (
                            <div>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-white mb-2 animate-pulse">
                                    HAPPENING NOW
                                </span>
                                <h3 className="text-xl font-bold text-gray-900">{activeSlot.activity}</h3>
                                <p className="text-gray-500 mt-1">
                                    Started at {new Date(activeSlot.from).toLocaleTimeString()}
                                </p>
                            </div>
                        ) : (
                            <p className="text-gray-500">No active scheduled activity right now.</p>
                        )}
                    </div>

                    <div className="mt-6">
                        <h3 className="text-md font-medium text-gray-900 mb-2">Quick Actions</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button className="flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-secondary hover:bg-secondary-dark">
                                Manage Timeline
                            </button>
                            <button className="flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                View Complaints
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
