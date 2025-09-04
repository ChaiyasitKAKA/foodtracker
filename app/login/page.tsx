"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Link from 'next/link';

export default function Login() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Your login logic here
        router.push('/dashboard')
        
        console.log({ email, password });
        alert('Login submitted! Check the console for data.');
    };




    return (
        <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-lg w-full text-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 uppercase tracking-wide mb-8">
                    LOGIN
                </h1>

                <form className="w-full space-y-6" onSubmit={handleSubmit}>
                    {/* Email Input */}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                    />
                    {/* Password Input */}
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                    />

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="w-full bg-emerald-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-emerald-600 transition-colors duration-300 transform hover:scale-105"
                    >
                        Login
                    </button>
                </form>

                {/* Register Link */}
                <p className="mt-8 text-sm text-gray-600">
                    Don{"'"}t have an account?{' '}
                    <Link href="/register" className="text-emerald-500 font-semibold hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </main>
    );
}
