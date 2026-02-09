import { apiClient } from './apiClient';

export const hackathonApi = {
    getConfig: async () => {
        const response = await apiClient.get('/hackathon/config');
        return response.data;
    },

    updateConfig: async (config) => {
        const response = await apiClient.put('/hackathon/config', config);
        return response.data;
    },

    getTimeline: async () => {
        const response = await apiClient.get('/hackathon/timeline');
        // Backend returns parsed dates from JSON as strings, converting strings to Date objects might be handled in components 
        // but let's ensure dates coming back are usable if needed, though usually string is fine for now.
        return response.data;
    },

    addTimelineSlot: async (slot) => {
        const response = await apiClient.post('/hackathon/timeline', slot);
        return response.data;
    },

    updateTimelineSlot: async (id, updates) => {
        const response = await apiClient.put(`/hackathon/timeline/${id}`, updates);
        return response; // { success: true, data: ... }
    },

    deleteTimelineSlot: async (id) => {
        const response = await apiClient.delete(`/hackathon/timeline/${id}`);
        return response;
    },

    getStats: async () => {
        const response = await apiClient.get('/hackathon/stats');
        return response;
    }
};
