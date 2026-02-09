import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { complaintApi } from '../../api/complaintApi';
import { AlertTriangle, Send, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const TYPE_TO_ENUM = {
    'Technical Issue': 'TECHNICAL',
    'Evaluation Issue': 'EVALUATION',
    'Timeline Issue': 'OTHER',
    'Facility / Wifi': 'OTHER',
    'Other': 'OTHER'
};

export default function ComplaintSubmission() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ type: 'Technical Issue', description: '' });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await complaintApi.create({
                type: TYPE_TO_ENUM[formData.type] || 'OTHER',
                description: formData.description
            });
            alert('Complaint submitted successfully. Admin has been notified.');
            navigate('/participant/dashboard');
        } catch (err) {
            alert('Failed to submit complaint: ' + (err.message || 'Unknown error'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Link to="/participant/dashboard" className="text-sm text-gray-500 hover:text-gray-900 flex items-center mb-6">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
            </Link>

            <div className="bg-white shadow rounded-lg p-8">
                <div className="flex items-center mb-6">
                    <div className="bg-red-100 p-3 rounded-full mr-4">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Report an Issue</h1>
                        <p className="text-gray-500">
                            Directly notify the hackathon admin about any problems.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Issue Type</label>
                        <select
                            required
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm rounded-md"
                        >
                            <option>Technical Issue</option>
                            <option>Evaluation Issue</option>
                            <option>Timeline Issue</option>
                            <option>Facility / Wifi</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            required
                            rows={4}
                            placeholder="Describe the issue in detail..."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                        >
                            <Send className="mr-2 h-4 w-4" />
                            {submitting ? 'Sending...' : 'Submit Complaint'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
