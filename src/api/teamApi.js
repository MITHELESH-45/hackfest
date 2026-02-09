import { apiClient } from './apiClient';

export const teamApi = {
    getAll: async () => {
        const response = await apiClient.get('/teams');
        return response.data;
    },

    create: async (teamData) => {
        // teamData: { name, leaderName, themeId, username }
        const response = await apiClient.post('/teams', teamData);
        // Response contains { success: true, data: team, credentials: {username, password} }
        // The frontend component expects the created team, but we might want to surface credentials.
        // For now, return the whole response or attach credentials to team object?
        // Let's return the full response data structure so the UI can handle credentials display.
        return { ...response.data, credentials: response.credentials };
    },

    update: async (id, data) => {
        const response = await apiClient.put(`/teams/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        return await apiClient.delete(`/teams/${id}`);
    },

    updateReadiness: async (teamId, round, status) => {
        // Endpoint: POST /api/teams/:id/ready
        const response = await apiClient.post(`/teams/${teamId}/ready`, { round, status });
        return response;
    }
};
