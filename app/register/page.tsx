"use client";

import React, { useState } from 'react';

export default function Register() {
    const [fullName, setFullName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [gender, setGender] = useState<string>('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Your registration logic here
        console.log({ fullName, email, password, gender, imagePreview });
        alert('Form submitted! Check the console for data.');
    };

    return (
        <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-lg w-full text-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 uppercase tracking-wide mb-8">
                    Register
                </h1>
                <form className="w-full space-y-6" onSubmit={handleSubmit}>
                    {/* Full Name Input */}
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                    />
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
                    {/* Gender Select */}
                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors text-gray-500"
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>

                    {/* Image Upload and Preview */}
                    <div className="flex flex-col items-center space-y-4">
                        <label htmlFor="profile-image" className="cursor-pointer text-gray-600 font-semibold">
                            Choose Profile Picture
                        </label>
                        <input
                            type="file"
                            id="profile-image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Profile Preview"
                                className="w-32 h-32 rounded-full object-cover shadow-md border-2 border-emerald-500"
                            />
                        )}
                    </div>

                    {/* Register Button */}
                    <button
                        type="submit"
                        className="w-full bg-emerald-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-emerald-600 transition-colors duration-300 transform hover:scale-105"
                    >
                        Register
                    </button>
                </form>

                {/* Login Link */}
                <p className="mt-8 text-sm text-gray-600">
                    Already have an account?{' '}
                    <a href="/login" className="text-emerald-500 font-semibold hover:underline">
                        Login here
                    </a>
                </p>
            </div>
        </main>
    );
}