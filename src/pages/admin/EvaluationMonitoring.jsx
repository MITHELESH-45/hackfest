import React, { useEffect } from 'react';
import { useEvaluation } from '../../context/EvaluationContext';
import { useHackathon } from '../../context/HackathonContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Table from '../../components/common/Table';
import { CheckCircle, Clock } from 'lucide-react';

export default function EvaluationMonitoring() {
    const { teamsStatus, evaluations, refreshData, loading } = useEvaluation();
    const { hackathon } = useHackathon();
    const currentRound = hackathon?.currentRound || 1;

    useEffect(() => {
        refreshData();
        // In a real live monitoring, we'd poll here
        const interval = setInterval(refreshData, 10000);
        return () => clearInterval(interval);
    }, [refreshData]);

    if (loading && teamsStatus.length === 0) return <LoadingSpinner />;

    const roundKey = `round${currentRound}`;
    const monitorData = teamsStatus.map(team => {
        const isReady = team.readiness?.[roundKey];
        const teamIdStr = String(team._id);
        const evalCount = (evaluations || []).filter(
            e => String(e.teamId?._id || e.teamId) === teamIdStr && Number(e.round) === Number(currentRound)
        ).length;

        return {
            ...team,
            currentRoundReady: isReady,
            currentRoundEvals: evalCount
        };
    });

    const columns = [
        { key: 'name', header: 'Team Name' },
        {
            key: 'theme',
            header: 'Theme',
            render: (row) => row.themeId?.name || row.theme || '—'
        },
        {
            key: 'status',
            header: 'Readiness',
            render: (row) => (
                row.currentRoundReady
                    ? <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> READY</span>
                    : <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" /> Waiting</span>
            )
        },
        {
            key: 'progress',
            header: 'Evaluations',
            render: (row) => (
                <div className="flex items-center">
                    <span className="text-sm font-medium">{row.currentRoundEvals}</span>
                    <span className="text-gray-400 text-xs ml-1">completed</span>
                </div>
            )
        }
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Evaluation Monitor (Round {currentRound})
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 shadow rounded-lg">
                    <div className="text-sm font-medium text-gray-500">Total Teams</div>
                    <div className="mt-1 text-3xl font-semibold text-gray-900">{monitorData.length}</div>
                </div>
                <div className="bg-white p-6 shadow rounded-lg">
                    <div className="text-sm font-medium text-gray-500">Ready for Eval</div>
                    <div className="mt-1 text-3xl font-semibold text-green-600">
                        {monitorData.filter(t => t.currentRoundReady).length}
                    </div>
                </div>
                <div className="bg-white p-6 shadow rounded-lg">
                    <div className="text-sm font-medium text-gray-500">Evaluations Done</div>
                    <div className="mt-1 text-3xl font-semibold text-blue-600">
                        {monitorData.reduce((acc, curr) => acc + curr.currentRoundEvals, 0)}
                    </div>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Team Progress
                    </h3>
                </div>
                <Table columns={columns} data={monitorData} keyField="_id" />
            </div>
        </div>
    );
}
