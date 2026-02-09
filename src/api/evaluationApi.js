import { apiClient } from './apiClient';

export const evaluationApi = {
    // Get all evaluations (Admin admin/dashboard or similar)
    getAllEvaluations: async () => {
        const response = await apiClient.get('/evaluations/all');
        return response.data;
    },

    // Get evaluations for a specific judge (Judge Dashboard)
    getJudgeEvaluations: async () => {
        const response = await apiClient.get('/evaluations/judge');
        // Backend infers judgeId from token
        return response.data;
    },

    // Get evaluations for a specific team (Admin drill-down)
    getTeamEvaluations: async (teamId) => {
        const response = await apiClient.get(`/evaluations/team/${teamId}`);
        return response.data;
    },

    // Submit a score
    submitScore: async (evaluation) => {
        // evaluation: { teamId, round, score, criteria, feedback }
        const response = await apiClient.post('/evaluations', evaluation);
        return response.data;
    },

    // Get Leaderboard
    getLeaderboard: async () => {
        const response = await apiClient.get('/leaderboard');
        return response.data;
    }
};
