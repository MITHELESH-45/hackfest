import { apiClient } from './apiClient';

export const themeApi = {
    getAll: async () => {
        const response = await apiClient.get('/themes');
        return response.data; // Backend sends [{name, description, teamCount, ...}]
    },

    create: async (theme) => {
        const response = await apiClient.post('/themes', theme);
        return response.data;
    },

    update: async (id, theme) => {
        const response = await apiClient.put(`/themes/${id}`, theme);
        return response;
    },

    delete: async (id) => {
        const response = await apiClient.delete(`/themes/${id}`);
        return response;
    }
};
