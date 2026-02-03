import { MOCK_COMPLAINTS } from '../data/mockComplaints';
import { delay } from '../utils/delay';

let complaintsStore = [...MOCK_COMPLAINTS];

export const complaintApi = {
    getAll: async () => {
        await delay(300);
        return [...complaintsStore].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    },

    create: async (complaint) => {
        await delay(500);
        const newComplaint = {
            ...complaint,
            id: 'C' + Date.now(),
            timestamp: new Date().toISOString()
        };
        complaintsStore.push(newComplaint);
        return newComplaint;
    }
};
