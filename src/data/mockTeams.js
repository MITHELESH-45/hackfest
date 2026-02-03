export const MOCK_TEAMS = [
    {
        id: 'T001',
        name: 'Alpha Squad',
        leaderName: 'John Doe',
        theme: 'AI & Automation',
        isReady: { 1: false, 2: false, 3: true }, // Round-wise readiness. R3 is auto-true.
        evaluations: { 1: [], 2: [], 3: [] },
    },
    {
        id: 'T002',
        name: 'Beta Builders',
        leaderName: 'Jane Smith',
        theme: 'Healthcare & MedTech',
        isReady: { 1: true, 2: false, 3: true },
        evaluations: { 1: [], 2: [], 3: [] },
    },
    {
        id: 'T003',
        name: 'Gamma Gurus',
        leaderName: 'Mike Ross',
        theme: 'FinTech & Blockchain',
        isReady: { 1: true, 2: true, 3: true },
        evaluations: { 1: [], 2: [], 3: [] },
    },
    {
        id: 'T004',
        name: 'Delta Devs',
        leaderName: 'Rachel Zane',
        theme: 'AI & Automation',
        isReady: { 1: false, 2: false, 3: true },
        evaluations: { 1: [], 2: [], 3: [] },
    }
];
