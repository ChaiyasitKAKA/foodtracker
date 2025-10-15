"use client";
import React, { useState } from 'react';
import { supabase } from '@/lib/supbaseclient';

export default function Login() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(''); // Clear previous messages

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                throw error;
            }

            setMessage('Login successful! Redirecting...');
            window.location.href = '/dashboard';

        } catch (error: unknown) { // Improved error handling for TypeScript
            console.error('Login error:', error);
            let errorMessage = "An unknown error occurred.";
            // Type check to safely access error properties
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            setMessage(`Login failed: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg text-center">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 uppercase tracking-wide mb-6">
                    LOGIN
                </h1>

                {message && (
                    <div className={`p-3 mb-4 text-sm rounded-lg ${message.startsWith('Login failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                )}

                <form className="w-full space-y-6" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-emerald-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-emerald-600 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100"
                    >
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="mt-8 text-sm text-gray-600">
                    Don{"'"}t have an account?{' '}
                    <a href="/register" className="text-emerald-500 font-semibold hover:underline">
                        Register here
                    </a>
                </p>
            </div>
        </main>
    );
}
