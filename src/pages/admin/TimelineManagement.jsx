import React, { useState, useEffect } from 'react';
import { useHackathon } from '../../context/HackathonContext';
import { hackathonApi } from '../../api/hackathonApi';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Plus, Edit, Trash, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function TimelineManagement() {
    const { timeline, loading: contextLoading } = useHackathon();
    const [localTimeline, setLocalTimeline] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSlot, setCurrentSlot] = useState(null); // null for new, object for edit
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLocalTimeline(timeline);
    }, [timeline]);

    const refreshTimeline = async () => {
        const data = await hackathonApi.getTimeline();
        setLocalTimeline(data);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const slotData = {
            from: formData.get('from'),
            to: formData.get('to'),
            activity: formData.get('activity'),
            type: formData.get('type')
        };

        setLoading(true);
        try {
            if (currentSlot) {
                await hackathonApi.updateTimelineSlot(currentSlot.id, slotData);
            } else {
                await hackathonApi.addTimelineSlot(slotData);
            }
            await refreshTimeline();
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
            alert('Failed to save slot');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this slot?')) return;
        setLoading(true);
        try {
            await hackathonApi.deleteTimelineSlot(id);
            await refreshTimeline();
        } catch (err) {
            console.error(err);
            alert('Failed to delete slot');
        } finally {
            setLoading(false);
        }
    };

    const openModal = (slot = null) => {
        setCurrentSlot(slot);
        setIsModalOpen(true);
    };

    const columns = [
        { key: 'activity', header: 'Activity' },
        {
            key: 'time',
            header: 'Time',
            render: (row) => (
                <div className="flex flex-col text-sm">
                    <span>From: {format(new Date(row.from), 'MMM d, h:mm a')}</span>
                    <span>To: {format(new Date(row.to), 'MMM d, h:mm a')}</span>
                </div>
            )
        },
        {
            key: 'type',
            header: 'Type',
            render: (row) => (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
          ${row.type === 'EVALUATION' ? 'bg-yellow-100 text-yellow-800' :
                        row.type === 'DEV' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'}`}>
                    {row.type}
                </span>
            )
        }
    ];

    if (contextLoading) return <LoadingSpinner />;

    return (
        <div>
            <div className="sm:flex sm:items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Timeline Management</h1>
                <button
                    onClick={() => openModal()}
                    className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Slot
                </button>
            </div>

            <Table
                columns={columns}
                data={localTimeline}
                actions={(row) => (
                    <div className="flex space-x-2 justify-end">
                        <button
                            onClick={() => openModal(row)}
                            className="text-secondary hover:text-secondary-dark font-medium"
                        >
                            <Edit size={18} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.id)}
                            className="text-red-600 hover:text-red-900 font-medium"
                        >
                            <Trash size={18} />
                        </button>
                    </div>
                )}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentSlot ? 'Edit Activity' : 'Add Activity'}
            >
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Activity Name</label>
                        <input
                            type="text"
                            name="activity"
                            required
                            defaultValue={currentSlot?.activity}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">From</label>
                            <input
                                type="datetime-local"
                                name="from"
                                required
                                defaultValue={currentSlot?.from ? new Date(currentSlot.from).toISOString().slice(0, 16) : ''}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">To</label>
                            <input
                                type="datetime-local"
                                name="to"
                                required
                                defaultValue={currentSlot?.to ? new Date(currentSlot.to).toISOString().slice(0, 16) : ''}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Type</label>
                        <select
                            name="type"
                            required
                            defaultValue={currentSlot?.type || 'GENERAL'}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                        >
                            <option value="GENERAL">General</option>
                            <option value="DEV">Development</option>
                            <option value="EVALUATION">Evaluation</option>
                            <option value="BREAK">Break</option>
                            <option value="FINAL">Final Round</option>
                        </select>
                    </div>

                    <div className="mt-5 sm:mt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-secondary text-base font-medium text-white hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary sm:text-sm disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Activity'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
