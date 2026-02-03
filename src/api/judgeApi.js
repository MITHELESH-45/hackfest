import { MOCK_JUDGES } from '../data/mockJudges';
import { MOCK_USERS } from '../data/mockUsers';
import { delay } from '../utils/delay';

let judgesStore = [...MOCK_JUDGES];
// effective users store would be synced in a real app
let usersStore = [...MOCK_USERS];

export const judgeApi = {
    getAll: async () => {
        await delay(300);
        return [...judgesStore];
    },

    create: async (judgeData) => {
        await delay(500);
        const newJudge = {
            ...judgeData,
            id: 'J' + Date.now().toString().slice(-4),
            finalRoundAssignments: []
        };
        judgesStore.push(newJudge);

        // Also create a user login for them
        usersStore.push({
            username: judgeData.username,
            password: judgeData.password,
            role: 'JUDGE',
            name: judgeData.name,
            assignedTheme: judgeData.assignedTheme,
            isFirstLogin: true
        });

        return newJudge;
    },

    delete: async (judgeId) => {
        await delay(300);
        const judgeIndex = judgesStore.findIndex(j => j.id === judgeId);
        if (judgeIndex === -1) {
            throw new Error('Judge not found');
        }
        const judge = judgesStore[judgeIndex];
        // Remove from judges store
        judgesStore = judgesStore.filter(j => j.id !== judgeId);
        // Also remove from users store
        usersStore = usersStore.filter(u => u.username !== judge.username);
        return { success: true };
    }
};
