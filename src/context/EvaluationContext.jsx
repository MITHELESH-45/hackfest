import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { evaluationApi } from '../api/evaluationApi';
import { teamApi } from '../api/teamApi';

const EvaluationContext = createContext(null);

export const EvaluationProvider = ({ children }) => {
    const [evaluations, setEvaluations] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [teamsStatus, setTeamsStatus] = useState([]); // With readiness info
    const [loading, setLoading] = useState(true);

    const refreshData = useCallback(async () => {
        setLoading(true);
        try {
            const [evalData, lbData, tData] = await Promise.all([
                evaluationApi.getAllEvaluations(),
                evaluationApi.getLeaderboard(),
                teamApi.getAll()
            ]);
            setEvaluations(evalData);
            setLeaderboard(lbData);
            setTeamsStatus(tData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial load
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
