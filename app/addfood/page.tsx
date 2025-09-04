"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function AddFood() {
    const [foodName, setFoodName] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

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
            setImagePreview(null);
        }
    };

    // Handles form submission
    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // In a real application, you would send this data to a backend
        console.log({
            foodName,
            date,
            imageFile,
        });
        // You could also add a success message or redirect the user
        alert('Food item saved! Check the console for data.');
    };

    return (
        <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-lg w-full text-center">
                {/* Header */}
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 uppercase tracking-wide mb-8">
                    Add Food
                </h1>

                <form className="w-full space-y-6" onSubmit={handleSave}>
                    {/* Food Name Input */}
                    <input
                        type="text"
                        placeholder="Food Name"
                        value={foodName}
                        onChange={(e) => setFoodName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                    />

                    {/* Date Input */}
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                    />

                    {/* Image Upload and Preview */}
                    <div className="flex flex-col items-start w-full">
                        <label className="text-sm font-medium text-gray-700 mb-2">Food Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                        />
                        {imagePreview && (
                            <div className="mt-4 w-full flex justify-center">
                                <img src={imagePreview} alt="Image Preview" className="rounded-lg max-w-full h-48 object-cover shadow-md" />
                            </div>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row w-full space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
                        <button
                            type="submit"
                            className="w-full sm:w-1/2 bg-emerald-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-emerald-600 transition-colors duration-300 transform hover:scale-105"
                        >
                            Save Food
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
