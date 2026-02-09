import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { evaluationApi } from '../api/evaluationApi';
import { teamApi } from '../api/teamApi';
import { useAuth } from './AuthContext';

const EvaluationContext = createContext(null);

export const EvaluationProvider = ({ children }) => {
    const { user } = useAuth();
    const [evaluations, setEvaluations] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [teamsStatus, setTeamsStatus] = useState([]);
    const [loading, setLoading] = useState(true);

    const refreshData = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            if (user.role === 'JUDGE') {
                const [evalData, tData] = await Promise.all([
                    evaluationApi.getJudgeEvaluations(),
                    teamApi.getAll()
                ]);
                setEvaluations(evalData || []);
                setLeaderboard([]);
                setTeamsStatus(tData || []);
            } else if (user.role === 'ADMIN') {
                const [evalData, lbData, tData] = await Promise.all([
                    evaluationApi.getAllEvaluations(),
                    evaluationApi.getLeaderboard(),
                    teamApi.getAll()
                ]);
                setEvaluations(evalData || []);
                setLeaderboard(lbData || []);
                setTeamsStatus(tData || []);
            } else {
                const tData = await teamApi.getAll();
                setEvaluations([]);
                setLeaderboard([]);
                setTeamsStatus(tData || []);
            }
        } catch (err) {
            console.error(err);
            setEvaluations([]);
            setLeaderboard([]);
        } finally {
            setLoading(false);
        }
    }, [user?.role, user?.id]);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    return (
        <EvaluationContext.Provider value={{
            evaluations,
            leaderboard,
            teamsStatus,
            loading,
            refreshData
        }}>
            {children}
        </EvaluationContext.Provider>
    );
};

export const useEvaluation = () => useContext(EvaluationContext);
