import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { evaluationApi } from '../../api/evaluationApi';
import Table from '../../components/common/Table';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { format } from 'date-fns';
import { History } from 'lucide-react';

export default function EvaluationHistory() {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user) return;
            try {
                const evals = await evaluationApi.getJudgeEvaluations();
                if (!evals || !Array.isArray(evals)) {
                    setHistory([]);
                    return;
                }
                const enriched = evals.map(e => ({
                    ...e,
                    teamName: e.teamId?.name || 'Unknown Team',
                    theme: e.teamId?.themeId?.name || (e.teamId?.themeId && typeof e.teamId.themeId === 'object' ? e.teamId.themeId.name : null) || '—'
                }));
                enriched.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                setHistory(enriched);
            } catch (err) {
                console.error(err);
                setHistory([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user?._id]);

    const columns = [
        { key: 'teamName', header: 'Team' },
        { key: 'round', header: 'Round' },
        {
            key: 'score',
            header: 'Score',
            render: (row) => <span className="font-bold">{row.score != null ? Number(row.score).toFixed(2) : '—'}</span>
        },
        {
            key: 'createdAt',
            header: 'Date & Time',
            render: (row) => row.createdAt ? format(new Date(row.createdAt), 'MMM d, h:mm a') : '—'
        }
    ];

    if (loading) return <LoadingSpinner />;

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <History className="h-8 w-8" /> Evaluation History
            </h1>
            <p className="text-gray-500 mb-6">All evaluations you have submitted.</p>
            {history.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                    No evaluations yet. Go to Evaluate Teams to submit scores.
                </div>
            ) : (
                <Table columns={columns} data={history} keyField="_id" />
            )}
        </div>
    );
}
