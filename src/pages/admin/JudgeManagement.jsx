import React, { useState, useEffect } from 'react';
import { judgeApi } from '../../api/judgeApi';
import { themeApi } from '../../api/themeApi';
import { generateCredential } from '../../utils/credentialGenerator';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Plus, UserPlus, Trash2 } from 'lucide-react';

export default function JudgeManagement() {
    const [judges, setJudges] = useState([]);
    const [themes, setThemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [judgeToDelete, setJudgeToDelete] = useState(null);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [successCreds, setSuccessCreds] = useState(null);

    // Form State
    const [formData, setFormData] = useState({ name: '', assignedTheme: '' });
    const [generatedCreds, setGeneratedCreds] = useState(null);

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            const [jData, tData] = await Promise.all([judgeApi.getAll(), themeApi.getAll()]);
            setJudges(jData);
            setThemes(tData);
            setLoading(false);
        };
        init();
    }, []);

    // Get themes that are already assigned to judges
    const assignedThemeIds = judges.map(j => j.assignedTheme?._id).filter(Boolean);

    // Filter available themes (exclude already assigned ones)
    const availableThemes = themes.filter(t => !assignedThemeIds.includes(t._id));

    const handleGenerateValues = () => {
        if (!formData.name) return alert('Enter name first');
        const creds = generateCredential('JUDGE', formData.name);
        setGeneratedCreds(creds);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!generatedCreds) return alert('Please generate credentials first');

        try {
            const response = await judgeApi.create({
                name: formData.name,
                assignedTheme: formData.assignedTheme,
                username: generatedCreds.username
            });

            // Refresh judges list
            const data = await judgeApi.getAll();
            setJudges(data);

            // IMPORTANT: Use the credentials returned from the backend!
            // The backend generates its own password, so we must show that one
            setSuccessCreds({
                username: response.credentials?.username || generatedCreds.username,
                password: response.credentials?.password || generatedCreds.password
            });

            setModalOpen(false);
            setSuccessModalOpen(true);

            // Reset form
            setFormData({ name: '', assignedTheme: '' });
            setGeneratedCreds(null);
        } catch (err) {
            alert('Failed to register judge: ' + (err.message || 'Unknown error'));
        }
    };

    const handleDeleteClick = (judge) => {
        setJudgeToDelete(judge);
        setDeleteConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!judgeToDelete) return;

        try {
            await judgeApi.delete(judgeToDelete._id);
            // Refresh
            const data = await judgeApi.getAll();
            setJudges(data);
            setDeleteConfirmOpen(false);
            setJudgeToDelete(null);
        } catch (err) {
            alert('Failed to delete judge');
        }
    };

    const columns = [
        { key: 'name', header: 'Judge Name' },
        {
            key: 'assignedTheme',
            header: 'Assigned Theme',
            render: (judge) => judge.assignedTheme?.name || 'N/A'
        },
        { key: 'username', header: 'Username' },
        {
            key: 'actions',
            header: 'Actions',
            render: (judge) => (
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleDeleteClick(judge); }}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors inline-flex items-center justify-center"
                    title="Delete Judge"
                >
                    <Trash2 size={18} />
                </button>
            )
        }
    ];

    if (loading) return <LoadingSpinner />;

    return (
        <div>
            <div className="sm:flex sm:items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Judge Management</h1>
                <button
                    onClick={() => setModalOpen(true)}
                    className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                >
                    <Plus className="mr-2 h-4 w-4" /> Register Judge
                </button>
            </div>

            <Table columns={columns} data={judges} keyField="_id" />

            {/* Register Judge Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Register New Judge"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            required
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Assigned Theme</label>
                        <select
                            required
                            value={formData.assignedTheme}
                            onChange={e => setFormData({ ...formData, assignedTheme: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                        >
                            <option value="">Select Theme</option>
                            {availableThemes.length > 0 ? (
                                availableThemes.map(t => (
                                    <option key={t._id} value={t._id}>{t.name}</option>
                                ))
                            ) : (
                                <option disabled>All themes are assigned</option>
                            )}
                        </select>
                        {availableThemes.length === 0 && (
                            <p className="mt-1 text-xs text-amber-600">
                                All themes have been assigned to judges. Delete a judge or add more themes.
                            </p>
                        )}
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
                                    <span className="block text-gray-500 text-xs">Initial Password</span>
                                    <span className="font-mono text-gray-600">Same as username</span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 italic">Click generate to create username (password = username until first login).</p>
                        )}
                    </div>

                    <div className="mt-5 sm:mt-6">
                        <button
                            type="submit"
                            disabled={availableThemes.length === 0}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-secondary text-base font-medium text-white hover:bg-secondary-dark sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Register Judge
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteConfirmOpen}
                onClose={() => {
                    setDeleteConfirmOpen(false);
                    setJudgeToDelete(null);
                }}
                title="Delete Judge"
            >
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Are you sure you want to delete <strong>{judgeToDelete?.name}</strong>?
                        This will also remove their login credentials.
                    </p>
                    <p className="text-sm text-gray-500">
                        Theme "<strong>{judgeToDelete?.assignedTheme?.name}</strong>" will become available for other judges.
                    </p>
                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={() => {
                                setDeleteConfirmOpen(false);
                                setJudgeToDelete(null);
                            }}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteConfirm}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                            Delete Judge
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Success Modal */}
            <Modal
                isOpen={successModalOpen}
                onClose={() => setSuccessModalOpen(false)}
                title="Judge Registered Successfully"
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
                                <span className="text-gray-500">Password (initial):</span>
                                <span className="font-bold select-all">{successCreds?.password}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">They must change password on first login.</p>
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
        </div>
    );
}
