import { MOCK_HACKATHON } from '../data/mockHackathon';
import { MOCK_TIMELINE } from '../data/mockTimeline';
import { delay } from '../utils/delay';

let hackathonStore = { ...MOCK_HACKATHON };
let timelineStore = [...MOCK_TIMELINE];

export const hackathonApi = {
    getConfig: async () => {
        await delay(300);
        return { ...hackathonStore };
    },

    updateConfig: async (config) => {
        await delay(500);
        hackathonStore = { ...hackathonStore, ...config };
        return { ...hackathonStore };
    },

    getTimeline: async () => {
        await delay(300);
        const sorted = [...timelineStore].sort((a, b) => new Date(a.from) - new Date(b.from));
        return sorted;
    },

    addTimelineSlot: async (slot) => {
        await delay(500);
        const newSlot = { ...slot, id: Date.now() };
        timelineStore = [...timelineStore, newSlot];
        return newSlot;
    },

    updateTimelineSlot: async (id, updates) => {
        await delay(500);
        timelineStore = timelineStore.map(s => s.id === id ? { ...s, ...updates } : s);
        return { success: true };
    },

    deleteTimelineSlot: async (id) => {
        await delay(500);
        timelineStore = timelineStore.filter(s => s.id !== id);
        return { success: true };
    }
};
