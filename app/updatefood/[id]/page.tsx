"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Mock data to simulate fetching an existing food item for editing
const mockFoods = [
    { id: '1', foodName: 'ข้าวผัดกะเพรา', date: '2023-10-27', image: 'https://placehold.co/100x100/A8D1A3/ffffff?text=Food_1' },
    { id: '2', foodName: 'ส้มตำ', date: '2023-10-26', image: 'https://placehold.co/100x100/F5CBA7/ffffff?text=Food_2' },
    { id: '3', foodName: 'ก๋วยเตี๋ยวเรือ', date: '2023-10-25', image: 'https://placehold.co/100x100/D4A5A5/ffffff?text=Food_3' },
    { id: '4', foodName: 'ผัดไทย', date: '2023-10-24', image: 'https://placehold.co/100x100/B5B5B5/ffffff?text=Food_4' },
    { id: '5', foodName: 'แกงเขียวหวาน', date: '2023-10-23', image: 'https://placehold.co/100x100/A8D1A3/ffffff?text=Food_5' },
    { id: '6', foodName: 'ไข่เจียว', date: '2023-10-22', image: 'https://placehold.co/100x100/F5CBA7/ffffff?text=Food_6' },
    { id: '7', foodName: 'ต้มยำกุ้ง', date: '2023-10-21', image: 'https://placehold.co/100x100/D4A5A5/ffffff?text=Food_7' },
    { id: '8', foodName: 'ผัดซีอิ๊ว', date: '2023-10-20', image: 'https://placehold.co/100x100/B5B5B5/ffffff?text=Food_8' },
    { id: '9', foodName: 'ข้าวมันไก่', date: '2023-10-19', image: 'https://placehold.co/100x100/A8D1A3/ffffff?text=Food_9' },
    { id: '10', foodName: 'ข้าวขาหมู', date: '2023-10-18', image: 'https://placehold.co/100x100/F5CBA7/ffffff?text=Food_10' },
];

interface UpdateFoodProps {
    params: {
        foodId: string;
    };
}

export default function UpdateFood({ params }: UpdateFoodProps) {
    const router = useRouter();
    const { foodId } = params;

    // Find the food item from the mock data based on the dynamic foodId
    const foodItem = mockFoods.find(food => food.id === foodId);

    const [foodName, setFoodName] = useState<string>(foodItem?.foodName || '');
    const [date, setDate] = useState<string>(foodItem?.date || '');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(foodItem?.image || 'https://placehold.co/150x150/cccccc/ffffff?text=Food');
    const [loading, setLoading] = useState<boolean>(!foodItem);

    useEffect(() => {
        if (!foodItem) {
            // In a real app, you'd fetch the data and then set the state
            // For this mock example, we'll simulate a 1-second load time
            const timer = setTimeout(() => {
                setLoading(false);
                // You would handle the case where the food item is not found here
                if (!mockFoods.find(food => food.id === foodId)) {
                    alert("Food item not found!");
                    router.push('/dashboard');
                }
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [foodItem, foodId, router]);

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
            setImagePreview(foodItem?.image || 'https://placehold.co/150x150/cccccc/ffffff?text=Food');
        }
    };

    // Handles form submission to save changes
    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // In a real application, you would send this updated data to a backend
        console.log({
            id: foodId,
            foodName,
            date,
            imageFile,
        });
        alert(`Food item with ID ${foodId} updated successfully! Check the console for data.`);
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold text-gray-900">Loading food item...</h1>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-lg w-full text-center">
                {/* Header */}
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 uppercase tracking-wide mb-8">
                    Update Food
                </h1>

                <form className="w-full space-y-6" onSubmit={handleSave}>
                    {/* Image Preview and Upload */}
                    <div className="flex flex-col items-center w-full mb-4">
                        <div className="w-40 h-40 rounded-lg overflow-hidden border-4 border-emerald-500 shadow-lg mb-4">
                            <img
                                src={imagePreview || 'https://placehold.co/150x150/cccccc/ffffff?text=Food'}
                                alt="Food Preview"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <label className="text-sm font-medium text-gray-700 mb-2 cursor-pointer bg-gray-100 py-2 px-4 rounded-full hover:bg-gray-200 transition-colors">
                            Change Food Image
                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </label>
                    </div>

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

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row w-full space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
                        <button
                            type="submit"
                            className="w-full sm:w-1/2 bg-emerald-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-emerald-600 transition-colors duration-300 transform hover:scale-105"
                        >
                            Save Changes
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
