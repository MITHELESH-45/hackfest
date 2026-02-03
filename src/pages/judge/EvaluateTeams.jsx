import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHackathon } from '../../context/HackathonContext';
import { useEvaluation } from '../../context/EvaluationContext';
import { teamApi } from '../../api/teamApi';
import { evaluationApi } from '../../api/evaluationApi';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CheckCircle, Clock, Star, Lock } from 'lucide-react';

export default function EvaluateTeams() {
    const { user } = useAuth();
    const { hackathon, activeSlot } = useHackathon();
    const { evaluations, refreshData: refreshContext } = useEvaluation();

    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    // Evaluation Modal State
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [score, setScore] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchTeams();
    }, [hackathon.currentRound, user]);

    const fetchTeams = async () => {
        setLoading(true);
        try {
            const allTeams = await teamApi.getAll();

            // Filter logic
            let filtered = [];
            if (hackathon.currentRound < 3) {
                // R1 & R2: Filter by theme and readiness
                filtered = allTeams.filter(t =>
                    t.theme === user.assignedTheme &&
                    t.isReady[hackathon.currentRound]
                );
            } else {
                // Final Round: Mock auto-assignment (Take top 10 or just first 10 for mock)
                // And ensure it's NOT the judge's own theme (if applicable)
                filtered = allTeams.slice(0, 10).filter(t => t.theme !== user.assignedTheme);
            }
            setTeams(filtered);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const hasEvaluated = (teamId) => {
        return evaluations.some(e =>
            e.teamId === teamId &&
            e.judgeId === user.username &&
            e.round === hackathon.currentRound
        );
    };

    const handleEvaluateClick = (team) => {
        if (hasEvaluated(team.id)) return;
        setSelectedTeam(team);
        setScore('');
        setIsModalOpen(true);
    };

    const handleSubmitScore = async (e) => {
        e.preventDefault();
        const scoreVal = parseFloat(score);
        if (isNaN(scoreVal) || scoreVal < 0 || scoreVal > 10) {
            alert('Score must be between 0.0 and 10.0');
            return;
        }

        setIsSubmitting(true);
        try {
            await evaluationApi.submitScore({
                teamId: selectedTeam.id,
                judgeId: user.username,
                round: hackathon.currentRound,
                score: scoreVal
            });
            setIsModalOpen(false);
            await refreshContext(); // Refresh global evaluations
            // fetchTeams(); // Not strictly needed unless list changes
        } catch (err) {
            alert('Error submitting score: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    // Check if evaluation is allowed currently (based on active timeline slot)
    const isEvaluationTime = activeSlot?.type === 'EVALUATION' || activeSlot?.type === 'FINAL';

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    Evaluate Teams (Round {hackathon.currentRound})
                </h1>
                {!isEvaluationTime && (
                    <div className="mt-2 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <Lock className="h-5 w-5 text-yellow-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    Evaluation is currently locked based on the schedule.
                                    Wait for an active evaluation slot.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {teams.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <Clock className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No teams ready</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Wait for teams in your theme ({user.assignedTheme}) to mark themselves as ready.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teams.map(team => {
                        const evaluated = hasEvaluated(team.id);
                        return (
                            <div
                                key={team.id}
                                className={`bg-white shadow rounded-lg p-6 border-l-4 ${evaluated ? 'border-green-500' : 'border-blue-500'} relative`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">{team.name}</h3>
                                        <p className="text-sm text-gray-500">{team.theme}</p>
                                        <p className="text-xs text-gray-400 mt-1">ID: {team.id}</p>
                                    </div>
                                    {evaluated ? (
                                        <CheckCircle className="h-6 w-6 text-green-500" />
                                    ) : (
                                        <Star className="h-6 w-6 text-blue-500" />
                                    )}
                                </div>

                                <div className="mt-4">
                                    {evaluated ? (
                                        <button
                                            disabled
                                            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-500 bg-gray-100 cursor-not-allowed"
                                        >
                                            Evaluated
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleEvaluateClick(team)}
                                            disabled={!isEvaluationTime}
                                            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Evaluate
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`Evaluate Team: ${selectedTeam?.name}`}
            >
                <form onSubmit={handleSubmitScore} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Team</label>
                        <p className="text-gray-900">{selectedTeam?.name} ({selectedTeam?.theme})</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Score (0.0 - 10.0)</label>
                        <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="10"
                            required
                            value={score}
                            onChange={e => setScore(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-lg"
                            placeholder="e.g. 8.5"
                        />
                    </div>

                    <div className="mt-5 sm:mt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-secondary text-base font-medium text-white hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary sm:text-sm disabled:opacity-50"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Score'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
