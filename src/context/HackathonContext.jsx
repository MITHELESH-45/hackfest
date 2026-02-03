import React, { createContext, useContext, useState, useEffect } from 'react';
import { hackathonApi } from '../api/hackathonApi';
import { isWithinInterval } from 'date-fns';

const HackathonContext = createContext(null);

export const HackathonProvider = ({ children }) => {
    const [hackathon, setHackathon] = useState(null);
    const [timeline, setTimeline] = useState([]);
    const [activeSlot, setActiveSlot] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initial fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [configData, timelineData] = await Promise.all([
                    hackathonApi.getConfig(),
                    hackathonApi.getTimeline()
                ]);
                setHackathon(configData);
                setTimeline(timelineData);
            } catch (err) {
                console.error('Failed to load hackathon data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Timer loop for active slot detection
    useEffect(() => {
        if (timeline.length === 0) return;

        const checkActiveSlot = () => {
            const now = new Date();
            const current = timeline.find(slot =>
                isWithinInterval(now, {
                    start: new Date(slot.from),
                    end: new Date(slot.to)
                })
            );
            setActiveSlot(current || null);
        };

        checkActiveSlot(); // Run immediately
        const interval = setInterval(checkActiveSlot, 30000); // Check every 30s

        return () => clearInterval(interval);
    }, [timeline]);

    return (
        <HackathonContext.Provider value={{
            hackathon,
            timeline,
            activeSlot,
            loading
        }}>
            {children}
        </HackathonContext.Provider>
    );
};

export const useHackathon = () => useContext(HackathonContext);
