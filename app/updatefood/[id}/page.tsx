"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// Define the type for the food item data
interface FoodItem {
    foodName: string;
    date: string;
    imageURL: string;
}

// Component นี้สามารถรับ Props ได้อย่างถูกต้อง
interface EditFoodProps {
    initialData: FoodItem;
}

export default function EditFoodForm({ initialData }: EditFoodProps) {
    const router = useRouter();
    const [foodName, setFoodName] = useState<string>(initialData.foodName);
    const [date, setDate] = useState<string>(initialData.date);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(initialData.imageURL);

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
            setImagePreview(initialData.imageURL);
        }
    };

    // Handles form submission to save changes
    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Saving changes for:', { foodName, date, imageFile });
        // You should use a custom modal instead of alert()
        alert('Food item updated successfully!');
        // In a real application, you would navigate back after a successful API call
        // router.push('/dashboard');
    };

    return (
        <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-lg w-full text-center">
                {/* Header */}
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 uppercase tracking-wide mb-8">
                    Edit Food
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
                            Save Changes
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push('/dashboard')}
                            className="w-full sm:w-1/2 py-3 px-8 rounded-full border border-gray-400 text-gray-600 font-bold hover:bg-gray-100 transition-colors duration-300 transform hover:scale-105"
                        >
                            Back
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
