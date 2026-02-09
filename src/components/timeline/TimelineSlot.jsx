import React from 'react';
import { format, isPast, isFuture } from 'date-fns';
import clsx from 'clsx';
import { Clock, CheckCircle2, Circle } from 'lucide-react';

export default function TimelineSlot({ slot, isActive }) {
    const fromDate = new Date(slot.from);
    const toDate = new Date(slot.to);
    const isCompleted = !isActive && isPast(toDate);
    const isUpcoming = !isActive && isFuture(fromDate);

    return (
        <div
            className={clsx(
                'relative pl-10 pb-8 last:pb-0',
                'border-l-2 transition-colors duration-300',
                isActive && 'border-blue-500',
                isCompleted && 'border-slate-200',
                isUpcoming && 'border-slate-300'
            )}
        >
            {/* Bullet: only active slot has the blinking ring */}
            <div
                className={clsx(
                    'absolute left-0 top-0 -translate-x-1/2 flex items-center justify-center',
                    'w-5 h-5 rounded-full border-2 bg-white',
                    isActive && 'border-blue-500 timeline-live-blink',
                    isCompleted && 'border-slate-200 bg-slate-50',
                    isUpcoming && 'border-slate-300'
                )}
            >
                {isCompleted && (
                    <CheckCircle2 className="w-3 h-3 text-slate-400" />
                )}
                {isActive && (
                    <span className="absolute w-2 h-2 rounded-full bg-blue-500" />
                )}
                {isUpcoming && (
                    <Circle className="w-2 h-2 text-slate-300" />
                )}
            </div>

            {/* Card */}
            <div
                className={clsx(
                    'rounded-xl p-4 transition-all duration-300 border',
                    isActive &&
                        'bg-gradient-to-br from-blue-50 to-white border-blue-200 shadow-md shadow-blue-100/50 timeline-live-glow',
                    isCompleted &&
                        'bg-slate-50/80 border-slate-100 opacity-75',
                    isUpcoming && 'bg-white border-slate-100 shadow-sm'
                )}
            >
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <h3
                        className={clsx(
                            'font-semibold text-base',
                            isActive && 'text-blue-800',
                            isCompleted && 'text-slate-500',
                            isUpcoming && 'text-slate-800'
                        )}
                    >
                        {slot.activity}
                    </h3>
                    {/* Only the active slot shows the LIVE badge — and it's the only thing that blinks */}
                    {isActive && (
                        <span
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold text-white bg-blue-500 timeline-live-blink"
                            aria-label="Current time slot"
                        >
                            LIVE
                        </span>
                    )}
                </div>
                <div
                    className={clsx(
                        'flex items-center gap-2 mt-2 text-sm',
                        isActive ? 'text-blue-600' : 'text-slate-500'
                    )}
                >
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>
                        {format(fromDate, 'h:mm a')} – {format(toDate, 'h:mm a')}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span>{format(fromDate, 'MMM d')}</span>
                </div>
            </div>
        </div>
    );
}
