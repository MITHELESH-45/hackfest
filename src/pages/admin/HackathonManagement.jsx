import React, { useState, useEffect } from 'react';
import { useHackathon } from '../../context/HackathonContext';
import { hackathonApi } from '../../api/hackathonApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Save } from 'lucide-react';

export default function HackathonManagement() {
    const { hackathon, loading } = useHackathon();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: '', // Format for datetime-local input
        endDate: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    // Function to format Date to 'YYYY-MM-DDTHH:mm' for input type="datetime-local"
    const formatDateForInput = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        // Adjust for local timezone offset if needed, but simplistic approach here:
        // This simple slice works for ISO strings, but ISO is UTC. 
        // We want local time in the input. 
        // A robust way:
        const offset = date.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
        return localISOTime;
    };

    useEffect(() => {
        if (hackathon) {
            setFormData({
                name: hackathon.name,
                description: hackathon.description,
                startDate: formatDateForInput(hackathon.startDate),
                endDate: formatDateForInput(hackathon.endDate)
            });
        }
    }, [hackathon]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage('');
        try {
            await hackathonApi.updateConfig({
                ...formData,
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString()
            });
            setMessage('Settings saved successfully!');
            // Assuming context might update on refresh or we force reload? 
            // For now, simpler to just show success message.
        } catch (err) {
            setMessage('Failed to save settings.');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Hackathon Configuration</h1>

            <div className="bg-white shadow rounded-lg p-8">
                <form onSubmit={handleSubmit} className="space-y-6">

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Hackathon Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring-secondary sm:text-sm p-2 border"
                        />
                        <p className="mt-1 text-sm text-gray-500">Official name of the event.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            rows={3}
                            required
                            value={formData.description}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring-secondary sm:text-sm p-2 border"
                        />
                        <p className="mt-1 text-sm text-gray-500">Brief overview displayed to participants.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Start Date & Time</label>
                            <input
                                type="datetime-local"
                                name="startDate"
                                required
                                value={formData.startDate}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring-secondary sm:text-sm p-2 border"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">End Date & Time</label>
                            <input
                                type="datetime-local"
                                name="endDate"
                                required
                                value={formData.endDate}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring-secondary sm:text-sm p-2 border"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                                Note: Changing duration affects the valid range for timeline slots.
                            </span>

                            <button
                                type="submit"
                                disabled={isSaving}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50"
                            >
                                <Save className="mr-2 h-4 w-4" />
                                {isSaving ? 'Saving...' : 'Save Configuration'}
                            </button>
                        </div>
                        {message && (
                            <p className={`mt-2 text-sm text-right ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                                {message}
                            </p>
                        )}
                    </div>
                </form>
            </div>

            <div className="mt-8 bg-blue-50 border-l-4 border-secondary p-4">
                <div className="flex">
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">System Behavior</h3>
                        <div className="mt-2 text-sm text-blue-700">
                            <p>
                                The number of rounds is fixed to 3 (Round 1, Round 2, and Final Round).
                                Once the hackathon starts, changing dates might cause inconsistencies in the timeline.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
