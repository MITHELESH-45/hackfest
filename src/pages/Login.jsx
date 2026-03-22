import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Listbox, Transition } from '@headlessui/react';
import { Check, ChevronDown, Lock } from 'lucide-react';
import clsx from 'clsx';

const ROLES = [
    { id: 'ADMIN', name: 'Administrator' },
    { id: 'JUDGE', name: 'Judge' },
    { id: 'PARTICIPANT', name: 'Participant (Team Leader)' },
];

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState(ROLES[0]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await login(username, password, selectedRole.id);
            if (result.success) {
                if (result.user.isFirstLogin) {
                    navigate('/change-password');
                } else {
                    // Redirect based on role
                    switch (result.user.role) {
                        case 'ADMIN': navigate('/admin/dashboard'); break;
                        case 'JUDGE': navigate('/judge/dashboard'); break;
                        case 'PARTICIPANT': navigate('/participant/dashboard'); break;
                        default: navigate('/');
                    }
                }
            } else {
                setError(result.message || 'Login failed');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-mesh-light selection:bg-pink-500 selection:text-white">
            {/* Animated Background Blobs */}
            <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-96 h-96 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" style={{ animationDelay: '2s' }}></div>
            <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" style={{ animationDelay: '4s' }}></div>

            <div className="relative w-full max-w-md z-10 animate-fade-in-up">
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-white/80 backdrop-blur-md rounded-2xl shadow-glass-card flex items-center justify-center mb-6 transform -rotate-3 hover:rotate-0 transition-all duration-300 border border-white/50 group">
                        <Lock className="h-8 w-8 text-secondary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h2 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 pb-1">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 font-medium tracking-wide uppercase">
                        Hackfest Platform
                    </p>
                </div>

                <div className="card !p-8 shadow-glass-card hover:shadow-glass-card-hover border border-white/60 backdrop-blur-xl bg-white/50 relative overflow-hidden">
                    {/* Subtle inner highlight */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80"></div>
                    
                    <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="role" className="block text-sm font-semibold text-slate-700">
                                Select Role
                            </label>
                            <div className="mt-1.5 relative">
                                <Listbox value={selectedRole} onChange={setSelectedRole}>
                                    <div className="relative">
                                        <Listbox.Button className="relative w-full cursor-default rounded-xl border border-white/40 bg-white/70 py-3 pl-4 pr-10 text-left shadow-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/50 sm:text-sm backdrop-blur-sm transition-all hover:bg-white/90">
                                            <span className="block truncate font-medium text-slate-800">{selectedRole.name}</span>
                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                <ChevronDown className="h-5 w-5 text-slate-400" aria-hidden="true" />
                                            </span>
                                        </Listbox.Button>
                                        <Transition
                                            as={React.Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <Listbox.Options className="absolute z-20 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white/95 py-1 text-base shadow-glass-card ring-1 ring-black/5 backdrop-blur-xl focus:outline-none sm:text-sm">
                                                {ROLES.map((role, roleIdx) => (
                                                    <Listbox.Option
                                                        key={roleIdx}
                                                        className={({ active }) =>
                                                            `relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors ${active ? 'bg-indigo-50/80 text-secondary-dark' : 'text-slate-700'
                                                            }`
                                                        }
                                                        value={role}
                                                    >
                                                        {({ selected, active }) => (
                                                            <>
                                                                <span className={`block truncate ${selected ? 'font-semibold text-indigo-700' : 'font-medium'}`}>
                                                                    {role.name}
                                                                </span>
                                                                {selected ? (
                                                                    <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-indigo-600' : 'text-secondary'}`}>
                                                                        <Check className="h-5 w-5" aria-hidden="true" />
                                                                    </span>
                                                                ) : null}
                                                            </>
                                                        )}
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Transition>
                                    </div>
                                </Listbox>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="username" className="block text-sm font-semibold text-slate-700">
                                Username
                            </label>
                            <div className="mt-1.5">
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="block w-full appearance-none rounded-xl border border-white/40 bg-white/70 px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm focus:border-secondary focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50 sm:text-sm backdrop-blur-sm transition-all hover:bg-white/90"
                                    placeholder="Enter your username"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                                Password
                            </label>
                            <div className="mt-1.5">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full appearance-none rounded-xl border border-white/40 bg-white/70 px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm focus:border-secondary focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50 sm:text-sm backdrop-blur-sm transition-all hover:bg-white/90"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-xl bg-red-50/90 border border-red-100 p-4 backdrop-blur-sm animate-fade-in">
                                <div className="flex items-center">
                                    <h3 className="text-sm font-semibold text-red-800">{error}</h3>
                                </div>
                            </div>
                        )}

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative flex w-full justify-center overflow-hidden rounded-xl border border-transparent bg-gradient-to-r from-indigo-600 to-purple-600 py-3 px-4 text-sm font-bold text-white shadow-btn-glow hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40"></span>
                                {isLoading ? 'Authenticating...' : (
                                    <span className="flex items-center">
                                        <Lock className="mr-2 h-4 w-4" /> Sign In Securely
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
