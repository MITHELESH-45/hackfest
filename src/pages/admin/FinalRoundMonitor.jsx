import React from 'react';
import { useHackathon } from '../../context/HackathonContext';
import { AlertCircle } from 'lucide-react';

export default function FinalRoundMonitor() {
    const { hackathon } = useHackathon();
    const isFinalRound = hackathon?.currentRound === 3;

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Final Round Monitor</h1>

            {!isFinalRound ? (
                <div className="text-center py-20 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900">Final Round is not active yet</h3>
                    <p className="text-gray-500 mt-2">
                        Evaluations are currently in Round {hackathon?.currentRound}.
                        Check back when Final Round starts.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <AlertCircle className="h-5 w-5 text-blue-400" aria-hidden="true" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-blue-700">
                                    Teams are automatically assigned to judges.
                                    Each judge evaluates 10 teams. Own theme is excluded.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Mock Visualization of Assignments */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {['Judge A', 'Judge B', 'Judge C'].map((judge, idx) => (
                            <div key={idx} className="bg-white shadow rounded-lg p-6">
                                <h3 className="font-bold text-gray-900 mb-4">{judge} - Assignments</h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                        <li key={n} className="flex justify-between">
                                            <span>Team Top {n}</span>
                                            <span className="text-gray-400">Pending</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
