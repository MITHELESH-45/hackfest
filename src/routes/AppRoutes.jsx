import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

// Layouts
import AdminLayout from '../layouts/AdminLayout';
import JudgeLayout from '../layouts/JudgeLayout';
import ParticipantLayout from '../layouts/ParticipantLayout';

// Public Pages
import Login from '../pages/Login';
import ChangePassword from '../pages/ChangePassword';
import AccessDenied from '../components/common/AccessDenied';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import HackathonManagement from '../pages/admin/HackathonManagement';
import TimelineManagement from '../pages/admin/TimelineManagement';
import ThemeManagement from '../pages/admin/ThemeManagement';
import TeamManagement from '../pages/admin/TeamManagement';
import JudgeManagement from '../pages/admin/JudgeManagement';
import CredentialDownload from '../pages/admin/CredentialDownload';
import RoundControl from '../pages/admin/RoundControl';
import EvaluationMonitoring from '../pages/admin/EvaluationMonitoring';
import FinalRoundMonitor from '../pages/admin/FinalRoundMonitor';
import ComplaintViewer from '../pages/admin/ComplaintViewer';
import ScoresLeaderboard from '../pages/admin/ScoresLeaderboard';

// Judge Pages
import JudgeDashboard from '../pages/judge/JudgeDashboard';
import EvaluationHistory from '../pages/judge/EvaluationHistory';
import EvaluateTeams from '../pages/judge/EvaluateTeams';

// Participant Pages
import ParticipantDashboard from '../pages/participant/ParticipantDashboard';
import ComplaintSubmission from '../pages/participant/ComplaintSubmission';

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/access-denied" element={<AccessDenied />} />

            {/* Protected: Change Password */}
            <Route
                path="/change-password"
                element={
                    <PrivateRoute allowedRoles={['ADMIN', 'JUDGE', 'PARTICIPANT']}>
                        <ChangePassword />
                    </PrivateRoute>
                }
            />

            {/* Admin Routes */}
            <Route
                path="/admin"
                element={
                    <PrivateRoute allowedRoles={['ADMIN']}>
                        <AdminLayout />
                    </PrivateRoute>
                }
            >
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="hackathon" element={<HackathonManagement />} />
                <Route path="timeline" element={<TimelineManagement />} />
                <Route path="themes" element={<ThemeManagement />} />
                <Route path="teams" element={<TeamManagement />} />
                <Route path="judges" element={<JudgeManagement />} />
                <Route path="credentials" element={<CredentialDownload />} />
                <Route path="rounds" element={<RoundControl />} />
                <Route path="monitoring" element={<EvaluationMonitoring />} />
                <Route path="final-round" element={<FinalRoundMonitor />} />
                <Route path="complaints" element={<ComplaintViewer />} />
                <Route path="leaderboard" element={<ScoresLeaderboard />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Route>

            {/* Judge Routes */}
            <Route
                path="/judge"
                element={
                    <PrivateRoute allowedRoles={['JUDGE']}>
                        <JudgeLayout />
                    </PrivateRoute>
                }
            >
                <Route path="dashboard" element={<JudgeDashboard />} />
                <Route path="evaluate" element={<EvaluateTeams />} />
                <Route path="history" element={<EvaluationHistory />} />
                <Route path="*" element={<Navigate to="/judge/dashboard" replace />} />
            </Route>

            {/* Participant Routes */}
            <Route
                path="/participant"
                element={
                    <PrivateRoute allowedRoles={['PARTICIPANT']}>
                        <ParticipantLayout />
                    </PrivateRoute>
                }
            >
                <Route path="dashboard" element={<ParticipantDashboard />} />
                <Route path="complaint" element={<ComplaintSubmission />} />
                <Route path="*" element={<Navigate to="/participant/dashboard" replace />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}
