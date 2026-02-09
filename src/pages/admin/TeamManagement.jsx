import React, { useState, useEffect } from 'react';
import { teamApi } from '../../api/teamApi';
import { themeApi } from '../../api/themeApi'; // Reuse theme API
import { generateCredential } from '../../utils/credentialGenerator';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Plus, UserPlus } from 'lucide-react';

export default function TeamManagement() {
    const [teams, setTeams] = useState([]);
    const [themes, setThemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    // Success Modal State
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [successCreds, setSuccessCreds] = useState(null);

    // Form State
    const [formData, setFormData] = useState({ name: '', leaderName: '', theme: '' });
    const [generatedCreds, setGeneratedCreds] = useState(null);

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            const [tData, thData] = await Promise.all([teamApi.getAll(), themeApi.getAll()]);
            setTeams(tData);
            setThemes(thData);
            setLoading(false);
        };
        init();
    }, []);

    const handleGenerateValues = () => {
        if (!formData.name) return alert('Enter team name first');
        const creds = generateCredential('TEAM', formData.name);
        setGeneratedCreds(creds);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!generatedCreds) return alert('Please generate credentials first');

        try {
            const response = await teamApi.create({
                name: formData.name,
                leaderName: formData.leaderName,
                themeId: formData.theme,
                username: generatedCreds.username
            });

            // Refresh teams list
            const data = await teamApi.getAll();
            setTeams(data);

            // IMPORTANT: Use the credentials returned from the backend!
            // The backend generates its own password, so we must show that one
            setSuccessCreds({
                username: response.credentials?.username || generatedCreds.username,
                password: response.credentials?.password || generatedCreds.password
            });

            setModalOpen(false);
            setSuccessModalOpen(true);

            // Reset form
            setFormData({ name: '', leaderName: '', theme: '' });
            setGeneratedCreds(null);
        } catch (err) {
            alert('Failed to register team: ' + (err.message || 'Unknown error'));
        }
    };

    const columns = [
        { key: 'name', header: 'Team Name' },
        { key: 'leaderName', header: 'Team Leader' },
        {
            key: 'themeId',
            header: 'Theme',
            render: (row) => row.themeId?.name || 'N/A'
        },
        { key: 'username', header: 'Username', render: (row) => row.leaderId?.username || 'N/A' }
    ];
    // Note: mockTeams.js doesn't store username directly in MOCK_TEAMS usually, 
    // but for admin display purposes we might want to attach it in the API response or store it.
    // I updated teamApi.create to push to teamsStore. 
    // For consistency, let's update mockTeams in memory or API response.
    // I'll assume for this mock that teamApi returns objects that might not have username initially unless I update mockTeams structure. 
    // I'll simply show it if available.

    if (loading) return <LoadingSpinner />;

    return (
        <div>
            <div className="sm:flex sm:items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
                <button
                    onClick={() => setModalOpen(true)}
                    className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                >
                    <Plus className="mr-2 h-4 w-4" /> Register Team
                </button>
            </div>

            <Table columns={columns} data={teams} />

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Register New Team"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Team Name</label>
                        <input
                            required
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Team Leader Name</label>
                        <input
                            required
                            value={formData.leaderName}
                            onChange={e => setFormData({ ...formData, leaderName: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Assigned Theme</label>
                        <select
                            required
                            value={formData.theme}
                            onChange={e => setFormData({ ...formData, theme: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                        >
                            <option value="">Select Theme</option>
                            {themes.map(t => (
                                <option key={t._id} value={t._id}>{t.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-semibold text-gray-500 uppercase">Credentials</span>
                            <button
                                type="button"
                                onClick={handleGenerateValues}
                                className="text-xs text-secondary hover:underline flex items-center"
                            >
                                <UserPlus size={12} className="mr-1" /> Generate
                            </button>
                        </div>
                        {generatedCreds ? (
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <span className="block text-gray-500 text-xs">Username</span>
                                    <span className="font-mono">{generatedCreds.username}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500 text-xs">Temp Password</span>
                                    <span className="font-mono">{generatedCreds.password}</span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 italic">Click generate to create login details.</p>
                        )}
                    </div>

                    <div className="mt-5 sm:mt-6">
                        <button
                            type="submit"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-secondary text-base font-medium text-white hover:bg-secondary-dark sm:text-sm"
                        >
                            Register Team
                        </button>
                    </div>
                </form>
            </Modal>


            {/* Success Modal */}
            <Modal
                isOpen={successModalOpen}
                onClose={() => setSuccessModalOpen(false)}
                title="Team Registered Successfully"
            >
                <div>
                    <div className="bg-green-50 p-4 rounded-md border border-green-200 mb-4">
                        <p className="text-green-800 text-sm font-medium mb-2">
                            Please save these credentials securely. They will not be shown again.
                        </p>
                        <div className="space-y-2 font-mono text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Username:</span>
                                <span className="font-bold select-all">{successCreds?.username}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Password:</span>
                                <span className="font-bold select-all">{successCreds?.password}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setSuccessModalOpen(false)}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-secondary text-base font-medium text-white hover:bg-secondary-dark sm:text-sm"
                    >
                        Close
                    </button>
                </div>
            </Modal>
        </div >
    );
}
