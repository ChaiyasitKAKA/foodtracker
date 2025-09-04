"use client";
import Link from 'next/link';
import React, { useState } from 'react';


// Mock data for demonstration
const mockFoods = [
    { id: 1, date: '2023-10-27', name: 'ข้าวผัดกะเพรา', image: 'https://placehold.co/100x100/A8D1A3/ffffff?text=Food' },
    { id: 2, date: '2023-10-26', name: 'ส้มตำ', image: 'https://placehold.co/100x100/F5CBA7/ffffff?text=Food' },
    { id: 3, date: '2023-10-25', name: 'ก๋วยเตี๋ยวเรือ', image: 'https://placehold.co/100x100/D4A5A5/ffffff?text=Food' },
    { id: 4, date: '2023-10-24', name: 'ผัดไทย', image: 'https://placehold.co/100x100/B5B5B5/ffffff?text=Food' },
    { id: 5, date: '2023-10-23', name: 'แกงเขียวหวาน', image: 'https://placehold.co/100x100/A8D1A3/ffffff?text=Food' },
    { id: 6, date: '2023-10-22', name: 'ไข่เจียว', image: 'https://placehold.co/100x100/F5CBA7/ffffff?text=Food' },
    { id: 7, date: '2023-10-21', name: 'ต้มยำกุ้ง', image: 'https://placehold.co/100x100/D4A5A5/ffffff?text=Food' },
    { id: 8, date: '2023-10-20', name: 'ผัดซีอิ๊ว', image: 'https://placehold.co/100x100/B5B5B5/ffffff?text=Food' },
    { id: 9, date: '2023-10-19', name: 'ข้าวมันไก่', image: 'https://placehold.co/100x100/A8D1A3/ffffff?text=Food' },
    { id: 10, date: '2023-10-18', name: 'ข้าวขาหมู', image: 'https://placehold.co/100x100/F5CBA7/ffffff?text=Food' },
];

export default function Dashboard() {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 5;

    const filteredFoods = mockFoods.filter(food =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredFoods.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentFoods = filteredFoods.slice(startIndex, startIndex + itemsPerPage);

    const handleSearch = () => {
        setCurrentPage(1); // Reset to first page on search
    };

    const handleDelete = (id: number) => {
        // In a real application, you would remove the item from state or call an API
        alert(`Deleting food with ID: ${id}`);
    };

    return (
        <main className="min-h-screen bg-white flex flex-col items-center p-4 sm:p-6 lg:p-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-5xl w-full text-center">
                {/* Header */}
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 uppercase tracking-wide mb-8">
                    Food Dashboard
                </h1>

                {/* Search Bar and Add Food Button */}
                <div className="flex flex-col sm:flex-row w-full mb-8 space-y-4 sm:space-y-0 sm:space-x-4 items-center">
                    <input
                        type="text"
                        placeholder="Search food by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-emerald-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:bg-emerald-600 transition-colors duration-300 transform hover:scale-105"
                    >
                        Search
                    </button>
                    <Link href="/addfood" passHref>
                        <button className="bg-emerald-500 text-white font-bold py-2 px-8 rounded-lg shadow-lg hover:bg-emerald-600 transition-colors duration-300 transform hover:scale-105">
                            Add Food
                        </button>
                    </Link>
                </div>

                {/* Food Table */}
                <div className="w-full overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Image
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentFoods.length > 0 ? (
                                currentFoods.map((food) => (
                                    <tr key={food.id} className="hover:bg-gray-100 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {food.date}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <img className="h-10 w-10 rounded-lg object-cover" src={food.image} alt={food.name} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {food.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => alert(`Editing food with ID: ${food.id}`)}
                                                className="text-emerald-600 hover:text-emerald-900 transition-colors mr-4"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(food.id)}
                                                className="text-red-600 hover:text-red-900 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                                        No food items found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center w-full mt-8">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>
        </main>
    );
}