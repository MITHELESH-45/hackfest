import React, { useEffect } from 'react';
import { useEvaluation } from '../../context/EvaluationContext';
import { useHackathon } from '../../context/HackathonContext';
import Table from '../../components/common/Table';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Trophy, AlertTriangle } from 'lucide-react';

export default function ScoresLeaderboard() {
    const { leaderboard, evaluations, refreshData, loading } = useEvaluation();
    const { hackathon } = useHackathon();

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    if (loading && leaderboard.length === 0) return <LoadingSpinner />;

    const columns = [
        {
            key: 'rank',
            header: 'Rank',
            render: (_, idx) => (
                <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full text-sm font-bold ${idx === 0 ? 'bg-yellow-100 text-yellow-800' :
                        idx === 1 ? 'bg-gray-100 text-gray-800' :
                            idx === 2 ? 'bg-orange-100 text-orange-800' : 'text-gray-500'
                    }`}>
                    {idx + 1}
                </span>
            )
        },
        { key: 'teamName', header: 'Team Name' },
        { key: 'theme', header: 'Theme' },
        {
            key: 'r1Avg',
            header: 'Round 1 (Avg)',
            render: (row) => row.r1Avg.toFixed(2)
        },
        {
            key: 'r2Avg',
            header: 'Round 2 (Avg)',
            render: (row) => row.r2Avg.toFixed(2)
        },
        {
            key: 'r3Avg',
            header: 'Final (Avg)',
            render: (row) => row.r3Avg.toFixed(2)
        },
        {
            key: 'totalScore',
            header: 'Total Score',
            render: (row) => <span className="font-bold text-secondary">{row.totalScore.toFixed(2)}</span>
        }
    ];

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Scores & Leaderboard</h1>
                <div className="mt-2 text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-100 inline-flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    STRICTLY CONFIDENTIAL. Do not show to participants.
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                        Live Ranking
                    </h3>
                </div>
                <Table columns={columns} data={leaderboard} />
            </div>

            <div className="mt-8 bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Detailed Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-md">
                        <span className="text-gray-500 text-sm">Total Evaluations</span>
                        <div className="text-2xl font-bold text-gray-900">{evaluations.length}</div>
                    </div>
                    {/* Add more stats if needed */}
                </div>
            </div>
        </div>
    );
}
