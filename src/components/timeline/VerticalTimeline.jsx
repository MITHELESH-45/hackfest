import React from 'react';
import { useHackathon } from '../../context/HackathonContext';
import TimelineSlot from './TimelineSlot';
import LoadingSpinner from '../common/LoadingSpinner'; // Need to create this if not exists

export default function VerticalTimeline() {
    const { timeline, activeSlot, loading } = useHackathon();

    if (loading) {
        return <div className="p-4 text-center">Loading timeline...</div>;
    }

    return (
        <div className="py-2">
            <div className="ml-2">
                {timeline.map((slot) => (
                    <TimelineSlot
                        key={slot.id}
                        slot={slot}
                        isActive={activeSlot?.id === slot.id}
                    />
                ))}
            </div>
        </div>
    );
}
