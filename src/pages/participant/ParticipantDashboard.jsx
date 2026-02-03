import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHackathon } from '../../context/HackathonContext';
import { useEvaluation } from '../../context/EvaluationContext'; // To get team status? Or use teamApi direct?
// Actually simpler to use teamApi or a specific useTeam hook. 
// For now, let's use a local fetch or direct API call since we need to toggle readiness.
import { teamApi } from '../../api/teamApi';
import VerticalTimeline from '../../components/timeline/VerticalTimeline';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CheckCircle, AlertCircle, Clock, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ParticipantDashboard() {
    const { user } = useAuth(); // User has teamId
    const { hackathon, activeSlot } = useHackathon();
    const [teamStatus, setTeamStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // We need to fetch the fresh team object to know readiness status
    React.useEffect(() => {
        fetchTeamStatus();
    }, [user]);

    const fetchTeamStatus = async () => {
        try {
            const allTeams = await teamApi.getAll();
            const myTeam = allTeams.find(t => t.id === user.teamId);
            setTeamStatus(myTeam);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkReady = async () => {
        if (!window.confirm('Are you ready for evaluation? This will notify the judges.')) return;
        setUpdating(true);
        try {
            await teamApi.updateReadiness(user.teamId, hackathon.currentRound, true);
            await fetchTeamStatus(); // Refresh
        } catch (err) {
            alert('Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    const isRoundActive = hackathon?.roundStatus?.[hackathon.currentRound] === 'ACTIVE';
    const isEvaluationSlot = activeSlot?.type === 'EVALUATION';
    const isReady = teamStatus?.isReady?.[hackathon.currentRound];
    const isFinalRound = hackathon.currentRound === 3;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Team Dashboard</h1>
                <p className="text-gray-500">Welcome, {user.teamName}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Team Info Card */}
                <div className="bg-white shadow rounded-lg p-6 border-l-4 border-secondary">
                    <h3 className="text-lg font-medium text-gray-900">Team Details</h3>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-500 block">Team ID</span>
                            <span className="font-mono font-bold">{user.teamId}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block">Theme</span>
                            <span className="font-bold">{user.theme}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block">Current Round</span>
                            <span className="font-bold text-lg">Round {hackathon.currentRound}</span>
                        </div>
                    </div>
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
                    ) : (
                        <div>
                            {isReady ? (
                                <div className="flex flex-col items-center justify-center py-6 text-green-600">
                                    <CheckCircle className="h-16 w-16 mb-2" />
                                    <span className="text-lg font-bold">You are READY</span>
                                    <span className="text-sm text-gray-500">Waiting for judges...</span>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-gray-500 mb-4 text-sm">
                                        When your prototype is ready for demo, click the button below.
                                        This will make you visible to judges.
                                    </p>
                                    <button
                                        onClick={handleMarkReady}
                                        disabled={!isRoundActive || !isEvaluationSlot || updating}
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                        {updating ? 'Updating...' :
                                            !isRoundActive ? 'Round Not Active' :
                                                !isEvaluationSlot ? 'Wait for Evaluation Slot' :
                                                    'MARK AS READY'}
                                    </button>
                                    {(!isRoundActive || !isEvaluationSlot) && (
                                        <p className="mt-2 text-xs text-red-500 text-center">
                                            Readiness can only be marked during active evaluation timelines.
                                        </p>
                                    )}
                                </div>
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
