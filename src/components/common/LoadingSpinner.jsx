import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner() {
    return (
        <div className="flex justify-center items-center p-4">
            <Loader2 className="animate-spin text-secondary h-8 w-8" />
        </div>
    );
}
