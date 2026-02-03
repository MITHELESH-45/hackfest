import React, { useState, useEffect } from 'react';
import { themeApi } from '../../api/themeApi'; // Need to create this
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Plus, Edit, Trash } from 'lucide-react';

export default function ThemeManagement() {
    const [themes, setThemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentTheme, setCurrentTheme] = useState(null);

    useEffect(() => {
        fetchThemes();
    }, []);

    const fetchThemes = async () => {
        setLoading(true);
        try {
            const data = await themeApi.getAll();
            setThemes(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const themeData = {
            name: formData.get('name'),
            maxTeams: parseInt(formData.get('maxTeams'))
        };

        try {
            if (currentTheme) {
                await themeApi.update(currentTheme.id, themeData);
            } else {
                await themeApi.create(themeData);
            }
            await fetchThemes();
            setModalOpen(false);
        } catch (err) {
            alert('Failed to save theme');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this theme?')) return;
        try {
            await themeApi.delete(id);
            await fetchThemes();
        } catch (err) {
            alert('Failed to delete theme');
        }
    };

    const openModal = (theme = null) => {
        setCurrentTheme(theme);
        setModalOpen(true);
    };

    const columns = [
        { key: 'name', header: 'Theme Name' },
        { key: 'maxTeams', header: 'Max Teams' },
        { key: 'assignedCount', header: 'Assigned Teams', render: (row) => row.assignedCount || 0 }
    ];

    if (loading && themes.length === 0) return <LoadingSpinner />;

    return (
        <div>
            <div className="sm:flex sm:items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Theme Management</h1>
                <button
                    onClick={() => openModal()}
                    className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Theme
                </button>
            </div>

            <Table
                columns={columns}
                data={themes}
                actions={(row) => (
                    <div className="flex space-x-2 justify-end">
                        <button onClick={() => openModal(row)} className="text-secondary hover:text-secondary-dark">
                            <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(row.id)} className="text-red-600 hover:text-red-900">
                            <Trash size={18} />
                        </button>
                    </div>
                )}
            />

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={currentTheme ? 'Edit Theme' : 'Add Theme'}
            >
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Theme Name</label>
                        <input
                            name="name"
                            required
                            defaultValue={currentTheme?.name}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Max Teams</label>
                        <input
                            type="number"
                            name="maxTeams"
                            required
                            defaultValue={currentTheme?.maxTeams || 10}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                        />
                    </div>
                    <div className="mt-5 sm:mt-6">
                        <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-secondary text-base font-medium text-white hover:bg-secondary-dark sm:text-sm">
                            Save Theme
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
