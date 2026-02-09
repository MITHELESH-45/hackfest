import React, { useEffect, useState } from 'react';
import { useEvaluation } from '../../context/EvaluationContext';
import { evaluationApi } from '../../api/evaluationApi';
import Table from '../../components/common/Table';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Trophy, AlertTriangle, RefreshCw } from 'lucide-react';

export default function ScoresLeaderboard() {
    const { evaluations, refreshData } = useEvaluation();
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchLeaderboard = async () => {
        try {
            const data = await evaluationApi.getLeaderboard();
            setLeaderboard(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Leaderboard fetch failed', err);
            setLeaderboard([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchLeaderboard();
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchLeaderboard();
        await refreshData(); // Also refresh context for evaluation count etc.
    };

    if (loading && leaderboard.length === 0) return <LoadingSpinner />;

    const rankedData = (leaderboard || []).map((row, idx) => ({ ...row, rank: idx + 1 }));

    const columns = [
        {
            key: 'rank',
            header: 'Rank',
            render: (row) => (
                <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full text-sm font-bold ${row.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                        row.rank === 2 ? 'bg-gray-100 text-gray-800' :
                            row.rank === 3 ? 'bg-orange-100 text-orange-800' : 'text-gray-500'
                    }`}>
                    {row.rank}
                </span>
            )
        },
        { key: 'teamName', header: 'Team Name' },
        { key: 'theme', header: 'Theme' },
        {
            key: 'r1Avg',
            header: 'Round 1 (Avg)',
            render: (row) => (row.r1Avg != null ? row.r1Avg.toFixed(2) : '—')
        },
        {
            key: 'r2Avg',
            header: 'Round 2 (Avg)',
            render: (row) => (row.r2Avg != null ? row.r2Avg.toFixed(2) : '—')
        },
        {
            key: 'r3Avg',
            header: 'Final (Avg)',
            render: (row) => (row.r3Avg != null ? row.r3Avg.toFixed(2) : '—')
        },
        {
            key: 'overallAvg',
            header: 'Overall (Avg of R1+R2+R3)',
            render: (row) => <span className="font-bold text-secondary">{(row.overallAvg != null ? row.overallAvg : row.totalScore ?? 0).toFixed(2)}</span>
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
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                        Live Ranking
                    </h3>
                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                        <RefreshCw className={`h-4 w-4 mr-1.5 ${refreshing ? 'animate-spin' : ''}`} />
                        {refreshing ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>
                <Table columns={columns} data={rankedData} keyField="teamId" />
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
