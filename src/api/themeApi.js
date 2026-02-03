import { MOCK_THEMES } from '../data/mockThemes';
import { delay } from '../utils/delay';

let themesStore = [...MOCK_THEMES];

export const themeApi = {
    getAll: async () => {
        await delay(300);
        // In real app, join with teams to get count. Mocking it here.
        return themesStore.map(t => ({ ...t, assignedCount: 0 }));
    },
    create: async (theme) => {
        await delay(500);
        const newTheme = { ...theme, id: 'THEME_' + Date.now() };
        themesStore.push(newTheme);
        return newTheme;
    },
    update: async (id, theme) => {
        await delay(500);
        themesStore = themesStore.map(t => t.id === id ? { ...t, ...theme } : t);
        return { success: true };
    },
    delete: async (id) => {
        await delay(500);
        themesStore = themesStore.filter(t => t.id !== id);
        return { success: true };
    }
};
