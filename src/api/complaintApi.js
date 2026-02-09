import { apiClient } from './apiClient';

export const complaintApi = {
    getAll: async () => {
        const response = await apiClient.get('/complaints');
        return response.data;
    },

    create: async (complaint) => {
        // complaint: { type, description }
        const response = await apiClient.post('/complaints', complaint);
        return response.data;
    },

    resolve: async (id) => {
        const response = await apiClient.put(`/complaints/${id}/resolve`, {});
        return response.data;
    }
};
