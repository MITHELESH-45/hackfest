import React from 'react';
import { format, isPast, isFuture, isWithinInterval } from 'date-fns';
import clsx from 'clsx';
import { Clock } from 'lucide-react';

export default function TimelineSlot({ slot, isActive }) {
    const fromDate = new Date(slot.from);
    const toDate = new Date(slot.to);

    // Custom past check: if it's NOT active and end date is in past
    // Because isPast(fromDate) would be true for active slot too.
    const isCompleted = !isActive && isPast(toDate);

    return (
        <div className={clsx(
            "relative pl-8 pb-8 border-l-2 last:pb-0",
            isActive ? "border-secondary" : isCompleted ? "border-gray-200" : "border-gray-300"
        )}>
            {/* Bullet Point */}
            <div className={clsx(
                "absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2",
                isActive ? "bg-white border-secondary animate-pulse" :
                    isCompleted ? "bg-gray-200 border-gray-200" : "bg-white border-gray-300"
            )}>
                {isActive && (
                    <div className="absolute inset-0 m-auto h-2 w-2 rounded-full bg-secondary"></div>
                )}
            </div>

            {/* Content */}
            <div className={clsx(
                "rounded-lg p-4 transition-all duration-300",
                isActive ? "bg-white shadow-lg border-l-4 border-secondary translate-x-2" :
                    isCompleted ? "opacity-50 grayscale" : "bg-white shadow-sm border border-gray-100"
            )}>
                <div className="flex justify-between items-start mb-1">
                    <h3 className={clsx("font-bold text-lg", isActive ? "text-secondary" : "text-gray-900")}>
                        {slot.activity}
                    </h3>
                    {isActive && (
                        <span className="px-2 py-1 text-xs font-bold text-white bg-secondary rounded-full animate-pulse">
                            LIVE
                        </span>
                    )}
                </div>

                <div className="flex items-center text-sm text-gray-500 mt-2">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>
                        {format(fromDate, 'h:mm a')} - {format(toDate, 'h:mm a')}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{format(fromDate, 'MMM d')}</span>
                </div>
            </div>
        </div>
    );
}
