import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHackathon } from '../../context/HackathonContext';
import { teamApi } from '../../api/teamApi';
import { evaluationApi } from '../../api/evaluationApi';
import VerticalTimeline from '../../components/timeline/VerticalTimeline';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CheckCircle, AlertCircle, Clock, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ParticipantDashboard() {
    const { user } = useAuth();
    const { hackathon } = useHackathon();
    const [teamStatus, setTeamStatus] = useState(null);
    const [evalStatus, setEvalStatus] = useState(null); // { round1Completed, round2Completed, round3Completed }
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    React.useEffect(() => {
        fetchTeamStatus();
    }, [user, hackathon?.currentRound]);

    const fetchEvalStatus = React.useCallback(async () => {
        if (!user || user.role !== 'PARTICIPANT') return;
        try {
            const data = await evaluationApi.getMyTeamEvaluationStatus();
            setEvalStatus(data);
        } catch {
            setEvalStatus(null);
        }
    }, [user?._id]);

    React.useEffect(() => {
        fetchEvalStatus();
        const interval = setInterval(fetchEvalStatus, 15000); // Refetch every 15s so "Round X completed" appears after judge evaluates
        return () => clearInterval(interval);
    }, [fetchEvalStatus]);

    const fetchTeamStatus = async () => {
        try {
            const allTeams = await teamApi.getAll();
            const myTeamId = user.teamId?._id ?? user.teamId;
            const myTeam = allTeams.find(t => String(t._id) === String(myTeamId));
            setTeamStatus(myTeam);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkReady = async () => {
        if (!teamStatus?._id || hackathon?.currentRound == null) return;
        if (!window.confirm('Mark your team as READY for Round ' + hackathon.currentRound + '? Judges will be able to evaluate you.')) return;
        setUpdating(true);
        try {
            await teamApi.updateReadiness(teamStatus._id, hackathon.currentRound, true);
            await fetchTeamStatus();
        } catch (err) {
            alert('Failed to update status: ' + (err.message || 'Unknown error'));
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    const currentRoundNum = hackathon?.currentRound ?? 1;
    const roundKey = currentRoundNum ? `round${currentRoundNum}` : null;
    const isRoundActive = roundKey ? hackathon?.roundStatus?.[roundKey] === 'ACTIVE' : false;
    const isReady = teamStatus?.readiness?.[roundKey];
    const isFinalRound = currentRoundNum === 3;
    const currentRoundCompleted = evalStatus?.[`round${currentRoundNum}Completed`];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Team Dashboard</h1>
                <p className="text-gray-500">Welcome, {user.name}{teamStatus?.name ? ` (${teamStatus.name})` : ''}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Team Info Card */}
                <div className="bg-white shadow rounded-lg p-6 border-l-4 border-secondary">
                    <h3 className="text-lg font-medium text-gray-900">Team Details</h3>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-500 block">Team</span>
                            <span className="font-bold">{teamStatus?.name || '—'}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block">Theme</span>
                            <span className="font-bold">{teamStatus?.themeId?.name || '—'}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block">Current Round</span>
                            <span className="font-bold text-lg">Round {hackathon?.currentRound ?? '—'}</span>
                        </div>
                    </div>
                    {/* Round-wise evaluation completed */}
                    {(evalStatus?.round1Completed || evalStatus?.round2Completed || evalStatus?.round3Completed) && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <span className="text-gray-500 block text-xs font-medium uppercase mb-2">Evaluation status</span>
                            <div className="flex flex-wrap gap-2">
                                {evalStatus.round1Completed && (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        <CheckCircle className="h-3.5 w-3.5 mr-1" /> Round 1 completed
                                    </span>
                                )}
                                {evalStatus.round2Completed && (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        <CheckCircle className="h-3.5 w-3.5 mr-1" /> Round 2 completed
                                    </span>
                                )}
                                {evalStatus.round3Completed && (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        <CheckCircle className="h-3.5 w-3.5 mr-1" /> Final round completed
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Card */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Evaluation Status</h3>

                    {isFinalRound ? (
                        <div className="rounded-md bg-blue-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <AlertCircle className="h-5 w-5 text-blue-400" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-blue-800">Final Round Active</h3>
                                    <div className="mt-2 text-sm text-blue-700">
                                        <p>
                                            You are automatically marked as READY.
                                            Judges will visit your station shortly.
                                            Good luck!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : currentRoundCompleted ? (
                        <div className="rounded-md bg-green-50 p-4">
                            <div className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                                <div>
                                    <h3 className="text-sm font-medium text-green-800">Round {currentRoundNum} evaluation completed</h3>
                                    <p className="mt-1 text-sm text-green-700">
                                        When Round {currentRoundNum + 1} starts, you can mark yourself ready again below.
                                    </p>
                                    <button
                                        onClick={handleMarkReady}
                                        disabled={(hackathon?.currentRound <= currentRoundNum) || !isRoundActive || updating}
                                        className="mt-4 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                        {updating ? 'Updating...' : (hackathon?.currentRound > currentRoundNum && isRoundActive) ? `MARK AS READY (Round ${currentRoundNum + 1})` : `Wait for Round ${currentRoundNum + 1} to start`}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : isReady ? (
                        <div className="flex flex-col items-center justify-center py-6 text-green-600">
                            <CheckCircle className="h-16 w-16 mb-2" />
                            <span className="text-lg font-bold">You are READY</span>
                            <span className="text-sm text-gray-500">Waiting for judges to evaluate...</span>
                        </div>
                    ) : (
                        <div>
                            <p className="text-gray-500 mb-4 text-sm">
                                When your prototype is ready for demo, click the button below.
                                This will make you visible to judges for Round {currentRoundNum}.
                            </p>
                            <button
                                onClick={handleMarkReady}
                                disabled={!isRoundActive || updating}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                {updating ? 'Updating...' : !isRoundActive ? 'Round not started yet' : 'MARK AS READY'}
                            </button>
                            {!isRoundActive && (
                                <p className="mt-2 text-xs text-red-500 text-center">
                                    Wait for admin to start the round.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Timeline & Schedule</h2>
                    <Link to="/participant/complaint" className="text-sm text-secondary hover:underline flex items-center">
                        <Send className="w-4 h-4 mr-1" /> Raise Issue
                    </Link>
                </div>
                <VerticalTimeline />
            </div>
        </div>
    );
}
