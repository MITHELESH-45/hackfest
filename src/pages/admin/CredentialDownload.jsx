import React, { useEffect, useState } from 'react';
import { teamApi } from '../../api/teamApi';
import { judgeApi } from '../../api/judgeApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Table from '../../components/common/Table';
import { Download, FileText } from 'lucide-react';

function escapeHtml(text) {
    if (text == null) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

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

    const handleExportPDF = (type) => {
        const data = type === 'TEAMS' ? teams : judges;
        if (!data.length) return alert('No data to export');

        const title = type === 'TEAMS'
            ? 'Team Credentials (initial password = username)'
            : 'Judge Credentials (initial password = username)';
        const headers = type === 'TEAMS'
            ? ['Team Name', 'Leader', 'Theme', 'Username', 'Password']
            : ['Name', 'Theme', 'Username', 'Password'];

        const rows = type === 'TEAMS'
            ? data.map(team => [
                team.name || '',
                team.leaderName || '',
                team.themeId?.name || 'N/A',
                team.leaderId?.username || 'N/A',
                team.leaderId?.username || 'N/A'
            ])
            : data.map(judge => [
                judge.name || '',
                judge.assignedTheme?.name || 'N/A',
                judge.username || 'N/A',
                judge.username || 'N/A'
            ]);

        const headerRow = headers.map(h => `<th>${escapeHtml(h)}</th>`).join('');
        const bodyRows = rows.map(row =>
            '<tr>' + row.map(cell => `<td>${escapeHtml(cell)}</td>`).join('') + '</tr>'
        ).join('');

        const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: sans-serif; padding: 20px; }
    h1 { font-size: 18px; margin-bottom: 16px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #333; padding: 8px; text-align: left; }
    th { background: #f0f0f0; font-weight: bold; }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <table>
    <thead><tr>${headerRow}</tr></thead>
    <tbody>${bodyRows}</tbody>
  </table>
</body>
</html>`;

        const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const w = window.open(url, '_blank', 'noopener');
        if (w) {
            w.onload = () => {
                URL.revokeObjectURL(url);
                w.print();
            };
        } else {
            URL.revokeObjectURL(url);
            alert('Allow popups to print/save as PDF.');
        }
    };

    const handleExport = (type) => {
        const data = type === 'TEAMS' ? teams : judges;
        if (!data.length) return alert('No data to export');

        let csvContent = "data:text/csv;charset=utf-8,";

        if (type === 'TEAMS') {
            // Headers
            csvContent += "Team ID,Team Name,Theme,Username,Password\n";
            // Rows
            csvContent += data.map(team => {
                const id = team._id;
                // Escape commas and quotes in names
                const name = `"${(team.name || '').replace(/"/g, '""')}"`;
                const theme = `"${(team.themeId?.name || 'N/A').replace(/"/g, '""')}"`;
                const username = team.leaderId?.username || 'N/A';
                const password = username; // Initial password = username
                return `${id},${name},${theme},${username},${password}`;
            }).join("\n");
        } else {
            // Headers for Judges
            csvContent += "Judge ID,Name,Assigned Theme,Username,Password\n";
            // Rows
            csvContent += data.map(judge => {
                const id = judge._id;
                const name = `"${(judge.name || '').replace(/"/g, '""')}"`;
                const theme = `"${(judge.assignedTheme?.name || 'N/A').replace(/"/g, '""')}"`;
                const username = judge.username || 'N/A';
                const password = username; // Initial password = username
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
                        <button
                            onClick={() => handleExportPDF('TEAMS')}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                        >
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
                        <button
                            onClick={() => handleExportPDF('JUDGES')}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                        >
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
