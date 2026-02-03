import { MOCK_EVALUATIONS } from '../data/mockEvaluations';
import { MOCK_TEAMS } from '../data/mockTeams';
import { delay } from '../utils/delay';

let evaluationsStore = [...MOCK_EVALUATIONS];
let teamsStore = [...MOCK_TEAMS]; // syncing with teamApi store ideally

export const evaluationApi = {
    // Get all evaluations (Admin)
    getAllEvaluations: async () => {
        await delay(300);
        return evaluationsStore;
    },

    // Get evaluations for a specific judge
    getJudgeEvaluations: async (judgeId) => {
        await delay(300);
        return evaluationsStore.filter(e => e.judgeId === judgeId);
    },

    // Submit a score
    submitScore: async (evaluation) => {
        await delay(500);
        const newEval = {
            ...evaluation,
            id: 'E' + Date.now(),
            timestamp: new Date().toISOString()
        };

        // Check if update or new? 
        // Requirement says "Submit one score per evaluation" (one per team per round).
        // Check if already evaluated
        const existingIndex = evaluationsStore.findIndex(e =>
            e.teamId === evaluation.teamId &&
            e.judgeId === evaluation.judgeId &&
            e.round === evaluation.round
        );

        if (existingIndex >= 0) {
            throw new Error('Team already evaluated by this judge in this round');
        }

        evaluationsStore.push(newEval);
        return newEval;
    },

    // Get Leaderboard (Aggregated)
    getLeaderboard: async () => {
        await delay(500);

        // Simple aggregation logic
        const teamScores = {};

        evaluationsStore.forEach(ev => {
            if (!teamScores[ev.teamId]) {
                teamScores[ev.teamId] = {
                    teamId: ev.teamId,
                    r1Total: 0, r1Count: 0,
                    r2Total: 0, r2Count: 0,
                    r3Total: 0, r3Count: 0
                };
            }

            if (ev.round === 1) {
                teamScores[ev.teamId].r1Total += ev.score;
                teamScores[ev.teamId].r1Count++;
            } else if (ev.round === 2) {
                teamScores[ev.teamId].r2Total += ev.score;
                teamScores[ev.teamId].r2Count++;
            } else if (ev.round === 3) {
                teamScores[ev.teamId].r3Total += ev.score;
                teamScores[ev.teamId].r3Count++;
            }
        });

        // Calculate averages
        const leaderboard = Object.values(teamScores).map(ts => {
            const r1Avg = ts.r1Count ? (ts.r1Total / ts.r1Count) : 0;
            const r2Avg = ts.r2Count ? (ts.r2Total / ts.r2Count) : 0;
            const r3Avg = ts.r3Count ? (ts.r3Total / ts.r3Count) : 0; // Final round often is sum or avg? 
            // Plan says: R1 & R2 -> Average. Final -> Single score (from multiple judges? Usually average for final too if multiple judges).
            // Let's assume average for all rounds for consistency here.

            const totalScore = (r1Avg + r2Avg + r3Avg); // Weighted? Or just sum of avgs.
            // Or maybe (r1 + r2)/2 + r3. 
            // For this mock, let's just return raw averages per round and a 'total' which is just sum of averages.

            // Find team name
            const team = teamsStore.find(t => t.id === ts.teamId);

            return {
                ...ts,
                teamName: team?.name || 'Unknown',
                theme: team?.theme || 'N/A',
                r1Avg,
                r2Avg,
                r3Avg,
                totalScore
            };
        }).sort((a, b) => b.totalScore - a.totalScore); // Descending

        return leaderboard;
    }
};
