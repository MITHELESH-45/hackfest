import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export default function AccessDenied() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
            <div className="text-center">
                <ShieldAlert className="mx-auto h-24 w-24 text-red-500" />
                <h1 className="mt-4 text-4xl font-extrabold text-gray-900">Access Denied</h1>
                <p className="mt-2 text-lg text-gray-600">You do not have permission to view this page.</p>
                <div className="mt-6">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-secondary hover:bg-secondary-dark"
                    >
                        Go back home
                    </Link>
                </div>
            </div>
        </div>
    );
}
