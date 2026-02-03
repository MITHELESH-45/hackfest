import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { evaluationApi } from '../../api/evaluationApi';
import { teamApi } from '../../api/teamApi';
import Table from '../../components/common/Table';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { format } from 'date-fns';

export default function EvaluationHistory() {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const [evals, teams] = await Promise.all([
                    evaluationApi.getJudgeEvaluations(user.username),
                    teamApi.getAll()
                ]);

                // Join with team details
                const enriched = evals.map(e => {
                    const team = teams.find(t => t.id === e.teamId);
                    return {
                        ...e,
                        teamName: team?.name || 'Unknown Team',
                        theme: team?.theme
                    };
                });

                // Sort by timestamp desc
                enriched.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                setHistory(enriched);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user.username]);

    const columns = [
        { key: 'teamName', header: 'Team' },
        { key: 'round', header: 'Round' },
        { key: 'score', header: 'Score Given', render: (row) => <span className="font-bold">{row.score}</span> },
        { key: 'timestamp', header: 'Time', render: (row) => format(new Date(row.timestamp), 'MMM d, h:mm a') }
    ];

    if (loading) return <LoadingSpinner />;

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Evaluation History</h1>
            <Table columns={columns} data={history} />
        </div>
    );
}
