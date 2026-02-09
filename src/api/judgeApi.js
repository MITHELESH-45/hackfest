import { apiClient } from './apiClient';

export const judgeApi = {
    getAll: async () => {
        const response = await apiClient.get('/judges');
        return response.data;
    },

    create: async (judgeData) => {
        // judgeData: { name, username, assignedTheme }
        const response = await apiClient.post('/judges', judgeData);
        // Similar to teams, backend returns credentials
        return { ...response.data, credentials: response.credentials };
    },

    update: async (id, data) => {
        const response = await apiClient.put(`/judges/${id}`, data);
        return response.data;
    },

    delete: async (judgeId) => {
        const response = await apiClient.delete(`/judges/${judgeId}`);
        return response;
    }
};
