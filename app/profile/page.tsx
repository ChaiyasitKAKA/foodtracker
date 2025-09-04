"use client";

import React, { useState } from 'react';
import Link from 'next/link';

// Mock data to simulate an authenticated user's profile
// In a real application, this data would come from an API or a state management system
const mockUserProfile = {
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    gender: 'male',
    image: 'https://placehold.co/150x150/cccccc/ffffff?text=Profile',
};

export default function Profile() {
    const [fullName, setFullName] = useState<string>(mockUserProfile.fullName);
    const [email, setEmail] = useState<string>(mockUserProfile.email);
    const [password, setPassword] = useState<string>('');
    const [gender, setGender] = useState<string>(mockUserProfile.gender);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(mockUserProfile.image);

    // Handles image file selection and sets the preview
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImageFile(file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(mockUserProfile.image);
        }
    };

    // Handles form submission to save changes
    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // In a real application, you would send this data to a backend for update
        console.log({
            fullName,
            email,
            password,
            gender,
            imageFile,
        });
        // You would typically show a success message or redirect the user
        alert('Profile updated successfully! Check the console for data.');
    };

    return (
        <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-lg w-full text-center">
                {/* Header */}
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 uppercase tracking-wide mb-8">
                    User Profile
                </h1>

                <form className="w-full space-y-6" onSubmit={handleSave}>
                    {/* Image Preview and Upload */}
                    <div className="flex flex-col items-center w-full mb-4">
                        <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-emerald-500 shadow-lg mb-4">
                            <img
                                src={imagePreview || 'https://placehold.co/150x150/cccccc/ffffff?text=Profile'}
                                alt="Profile Preview"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <label className="text-sm font-medium text-gray-700 mb-2 cursor-pointer bg-gray-100 py-2 px-4 rounded-full hover:bg-gray-200 transition-colors">
                            Change Profile Picture
                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </label>
                    </div>

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
                        placeholder="New Password (optional)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                    />

                    {/* Gender Selection */}
                    <div className="w-full text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row w-full space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
                        <button
                            type="submit"
                            className="w-full sm:w-1/2 bg-emerald-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-emerald-600 transition-colors duration-300 transform hover:scale-105"
                        >
                            Save Profile
                        </button>
                        <Link href="/dashboard" passHref className="w-full sm:w-1/2">
                            <button
                                type="button"
                                className="w-full py-3 px-8 rounded-full border border-emerald-500 text-emerald-500 font-bold hover:bg-emerald-50 transition-colors duration-300 transform hover:scale-105"
                            >
                                Go to Dashboard
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
        </main>
    );
}