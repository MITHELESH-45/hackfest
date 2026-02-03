import { MOCK_TEAMS } from '../data/mockTeams';
import { MOCK_USERS } from '../data/mockUsers';
import { delay } from '../utils/delay';

let teamsStore = [...MOCK_TEAMS];
let usersStore = [...MOCK_USERS];

export const teamApi = {
    getAll: async () => {
        await delay(300);
        return [...teamsStore];
    },

    create: async (teamData) => {
        await delay(500);
        const newTeam = {
            ...teamData,
            id: 'T' + Date.now().toString().slice(-4),
            isReady: { 1: false, 2: false, 3: true },
            evaluations: { 1: [], 2: [], 3: [] }
        };
        teamsStore.push(newTeam);

        // Create user login
        usersStore.push({
            username: teamData.username,
            password: teamData.password,
            role: 'PARTICIPANT',
            name: teamData.leaderName,
            teamId: newTeam.id,
            teamName: teamData.name,
            theme: teamData.theme,
            isFirstLogin: true
        });

        return newTeam;
    },

    // For later use (Round Control/Readiness)
    updateReadiness: async (teamId, round, status) => {
        await delay(300);
        teamsStore = teamsStore.map(t =>
            t.id === teamId
                ? { ...t, isReady: { ...t.isReady, [round]: status } }
                : t
        );
        return { success: true };
    }
};
