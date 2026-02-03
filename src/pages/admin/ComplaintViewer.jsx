import React, { useState, useEffect } from 'react';
import { complaintApi } from '../../api/complaintApi';
import Table from '../../components/common/Table';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { format } from 'date-fns';
import { AlertCircle } from 'lucide-react';

export default function ComplaintViewer() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const data = await complaintApi.getAll();
                setComplaints(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchComplaints();
        // In real app, poll for new complaints
    }, []);

    const columns = [
        { key: 'teamName', header: 'Team' },
        { key: 'theme', header: 'Theme' },
        { key: 'type', header: 'Issue Type' },
        { key: 'description', header: 'Description', render: (row) => <span className="text-gray-600 block max-w-xs">{row.description}</span> },
        {
            key: 'timestamp',
            header: 'Time',
            render: (row) => format(new Date(row.timestamp), 'h:mm a')
        }
    ];

    if (loading) return <LoadingSpinner />;

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Complaint Log</h1>

            {complaints.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No complaints</h3>
                    <p className="mt-1 text-sm text-gray-500">Everything seems to be running smoothly!</p>
                </div>
            ) : (
                <Table columns={columns} data={complaints} />
            )}
        </div>
    );
}
