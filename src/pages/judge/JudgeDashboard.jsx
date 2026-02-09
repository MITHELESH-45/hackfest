import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHackathon } from '../../context/HackathonContext';
import { useEvaluation } from '../../context/EvaluationContext';
import VerticalTimeline from '../../components/timeline/VerticalTimeline';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CheckCircle, Clock } from 'lucide-react';

export default function JudgeDashboard() {
    const { user } = useAuth();
    const { hackathon, loading: hackathonLoading } = useHackathon();
    const { evaluations } = useEvaluation();

    const currentRound = hackathon?.currentRound ?? 1;
    const judgeIdStr = String(user?._id || user?.id || '');
    const myEvaluationsCount = (evaluations || []).filter(
        e => String(e.judgeId?._id || e.judgeId) === judgeIdStr && Number(e.round) === Number(currentRound)
    ).length;

    if (hackathonLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Judge Dashboard</h1>
                <p className="text-gray-500">Welcome, {user?.name ?? 'Judge'}</p>
            </div>

            <div className="bg-white shadow rounded-lg p-6 border-l-4 border-secondary">
                <h3 className="text-lg font-medium text-gray-900">Assigned Theme</h3>
                <p className="mt-1 text-2xl font-bold text-secondary">
                    {typeof user?.assignedTheme === 'object' && user.assignedTheme?.name
                        ? user.assignedTheme.name
                        : (user?.assignedTheme || 'General / Final Round')}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                    You will only see teams from this theme during Round 1 & 2.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 shadow rounded-lg flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                        <Clock className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-gray-500">Current Round</div>
                        <div className="text-xl font-bold text-gray-900">Round {currentRound}</div>
                    </div>
                </div>
                <div className="bg-white p-6 shadow rounded-lg flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                        <CheckCircle className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-gray-500">Evaluated This Round</div>
                        <div className="text-xl font-bold text-gray-900">{myEvaluationsCount} Teams</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Event Timeline</h2>
                    <VerticalTimeline />
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Instructions</h2>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600">
                        <li>Wait for teams to mark themselves as <strong>READY</strong>.</li>
                        <li>You can only evaluate a team <strong>once</strong> per round.</li>
                        <li>Scores range from <strong>0.0 to 10.0</strong>. Decimals are allowed.</li>
                        <li>In Final Round, teams will be auto-assigned to you.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
