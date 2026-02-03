export const MOCK_USERS = [
    // Admin
    {
        username: 'admin',
        password: 'password123', // In real app, this would be hashed
        role: 'ADMIN',
        name: 'System Administrator',
        isFirstLogin: false,
    },

    // Judges
    {
        username: 'judge_ai',
        password: 'password123',
        role: 'JUDGE',
        name: 'Dr. Sarah Connor',
        assignedTheme: 'AI & Automation',
        isFirstLogin: true, // Forces password change
    },
    {
        username: 'judge_health',
        password: 'password123',
        role: 'JUDGE',
        name: 'Dr. Gregory House',
        assignedTheme: 'Healthcare & MedTech',
        isFirstLogin: true,
    },
    {
        username: 'judge_fintech',
        password: 'password123',
        role: 'JUDGE',
        name: 'Gordon Gekko',
        assignedTheme: 'FinTech & Blockchain',
        isFirstLogin: true,
    },

    // Participants (Team Leaders)
    {
        username: 'team_alpha',
        password: 'password123',
        role: 'PARTICIPANT',
        name: 'John Doe',
        teamId: 'T001',
        teamName: 'Alpha Squad',
        theme: 'AI & Automation',
        isFirstLogin: true,
    },
    {
        username: 'team_beta',
        password: 'password123',
        role: 'PARTICIPANT',
        name: 'Jane Smith',
        teamId: 'T002',
        teamName: 'Beta Builders',
        theme: 'Healthcare & MedTech',
        isFirstLogin: true,
    }
];
