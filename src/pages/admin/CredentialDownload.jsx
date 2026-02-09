import React, { useEffect, useState } from 'react';
// We'll reuse logic from management pages or fetch simple data
import { teamApi } from '../../api/teamApi';
import { judgeApi } from '../../api/judgeApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Table from '../../components/common/Table';
import { Download, FileText } from 'lucide-react';

export default function CredentialDownload() {
    const [teams, setTeams] = useState([]);
    const [judges, setJudges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            const [t, j] = await Promise.all([teamApi.getAll(), judgeApi.getAll()]);
            setTeams(t);
            setJudges(j);
            setLoading(false);
        };
        fetchAll();
    }, []);

    const handleExport = (type) => {
        const data = type === 'TEAMS' ? teams : judges;
        if (!data.length) return alert('No data to export');

        let csvContent = "data:text/csv;charset=utf-8,";

        if (type === 'TEAMS') {
            // Headers
            csvContent += "Team ID,Team Name,Theme,Username,Password Status\n";
            // Rows
            csvContent += data.map(team => {
                const id = team._id;
                // Escape commas and quotes in names
                const name = `"${(team.name || '').replace(/"/g, '""')}"`;
                const theme = `"${(team.themeId?.name || 'N/A').replace(/"/g, '""')}"`;
                const username = team.leaderId?.username || 'N/A';
                const password = "Saved at creation (Hash protected)";
                return `${id},${name},${theme},${username},${password}`;
            }).join("\n");
        } else {
            // Headers for Judges
            csvContent += "Judge ID,Name,Assigned Theme,Username,Password Status\n";
            // Rows
            csvContent += data.map(judge => {
                const id = judge._id;
                const name = `"${(judge.name || '').replace(/"/g, '""')}"`;
                const theme = `"${(judge.assignedTheme?.name || 'N/A').replace(/"/g, '""')}"`;
                const username = judge.username || 'N/A';
                const password = "Saved at creation (Hash protected)";
                return `${id},${name},${theme},${username},${password}`;
            }).join("\n");
        }

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${type.toLowerCase()}_credentials.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Credential Distribution</h1>
                <p className="text-gray-500">Download and print credentials for teams and judges.</p>
            </div>

            {/* Teams Section */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Teams</h2>
                    <div className="space-x-2">
                        <button
                            onClick={() => handleExport('TEAMS')}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <Download className="mr-1 h-3 w-3" /> CSV
                        </button>
                        <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                            <FileText className="mr-1 h-3 w-3" /> PDF
                        </button>
                    </div>
                </div>
                <Table
                    columns={[
                        { key: 'name', header: 'Team Name' },
                        { key: 'leaderName', header: 'Leader' },
                        {
                            key: 'theme',
                            header: 'Theme',
                            render: (row) => row.themeId?.name || 'N/A'
                        },
                        {
                            key: 'username',
                            header: 'Username',
                            render: (row) => {
                                // The username is stored in the leader user account
                                // We need to fetch this from the leaderId if populated
                                // For now, show the team leader's username if available
                                return row.leaderId?.username || 'N/A';
                            }
                        }
                    ]}
                    data={teams}
                    keyField="_id"
                />
            </div>

            {/* Judges Section */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Judges</h2>
                    <div className="space-x-2">
                        <button
                            onClick={() => handleExport('JUDGES')}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <Download className="mr-1 h-3 w-3" /> CSV
                        </button>
                        <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                            <FileText className="mr-1 h-3 w-3" /> PDF
                        </button>
                    </div>
                </div>
                <Table
                    columns={[
                        { key: 'name', header: 'Name' },
                        {
                            key: 'assignedTheme',
                            header: 'Assigned Theme',
                            render: (row) => row.assignedTheme?.name || 'N/A'
                        },
                        { key: 'username', header: 'Username' }
                    ]}
                    data={judges}
                    keyField="_id"
                />
            </div>
        </div>
    );
}
