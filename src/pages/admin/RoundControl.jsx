import React, { useState } from 'react';
import { useHackathon } from '../../context/HackathonContext';
import { hackathonApi } from '../../api/hackathonApi';
import { Play, Square, Lock, AlertTriangle } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function RoundControl() {
    const { hackathon, loading: ctxLoading } = useHackathon();
    const [loading, setLoading] = useState(false);
    const [localHackathon, setLocalHackathon] = useState(hackathon);

    // Sync local state when hackathon config loads or updates from context
    React.useEffect(() => {
        if (hackathon) setLocalHackathon(hackathon);
    }, [hackathon]);

    const updateRound = async (round, status) => {
        if (!window.confirm(`Are you sure you want to change Round ${round} to ${status}?`)) return;

        setLoading(true);
        try {
            // Logic to update round status
            // In mock, we just update config. In real app, separate endpoint.
            const roundKey = `round${round}`;
            const current = localHackathon.roundStatus || {};
            const newRoundStatus = {
                round1: current.round1 || 'LOCKED',
                round2: current.round2 || 'LOCKED',
                round3: current.round3 || 'LOCKED'
            };
            if (status === 'ACTIVE') {
                ['round1', 'round2', 'round3'].forEach(r => {
                    if (newRoundStatus[r] === 'ACTIVE') newRoundStatus[r] = 'LOCKED';
                });
            }
            newRoundStatus[roundKey] = status;

            const newConfig = {
                ...localHackathon,
                currentRound: parseInt(round, 10),
                roundStatus: newRoundStatus
            };

            await hackathonApi.updateConfig(newConfig);
            setLocalHackathon(newConfig); // Optimistic update or refetch
        } catch (err) {
            alert('Failed to update round');
        } finally {
            setLoading(false);
        }
    };

    if (ctxLoading || !localHackathon) return <LoadingSpinner />;

    const rounds = [1, 2, 3];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Round Control</h1>
                <p className="text-gray-500">Manage the flow of the hackathon rounds.</p>
            </div>

            <div className="space-y-6">
                {rounds.map(round => {
                    const status = localHackathon.roundStatus?.[`round${round}`] || 'LOCKED';
                    const isActive = status === 'ACTIVE';
                    const isCompleted = status === 'COMPLETED';

                    return (
                        <div key={round} className={`bg-white shadow rounded-lg p-6 border-l-4 ${isActive ? 'border-green-500' : 'border-gray-300'}`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {round === 3 ? 'Final Round' : `Round ${round}`}
                                    </h3>
                                    <div className="mt-1">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isActive ? 'bg-green-100 text-green-800' :
                                                isCompleted ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {status}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex space-x-3">
                                    {status === 'LOCKED' && (
                                        <button
                                            onClick={() => updateRound(round, 'ACTIVE')}
                                            disabled={loading}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                                        >
                                            <Play className="mr-2 h-4 w-4" /> Start Round
                                        </button>
                                    )}

                                    {isActive && (
                                        <button
                                            onClick={() => updateRound(round, 'COMPLETED')}
                                            disabled={loading}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                                        >
                                            <Square className="mr-2 h-4 w-4" /> End Round
                                        </button>
                                    )}

                                    {isCompleted && (
                                        <span className="flex items-center text-gray-400 text-sm">
                                            <Lock className="mr-1 h-4 w-4" /> Round Locked
                                        </span>
                                    )}
                                </div>
                            </div>

                            {isActive && (
                                <div className="mt-4 bg-yellow-50 border border-yellow-200 p-3 rounded-md flex items-start">
                                    <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                                    <p className="text-sm text-yellow-700">
                                        Round is currently live. Judges can submit evaluations.
                                        Ending the round will lock evaluations.
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
