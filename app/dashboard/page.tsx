"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supbaseclient';


interface Profile {
    fullname: string;
    user_image_url: string;
}

interface Food {
    id: number;
    foodname: string;
    meal: string;
    fooddate_at: string;
    food_image_url: string;
}

export default function Dashboard() {
    
    const [profile, setProfile] = useState<Profile | null>(null);
    const [foods, setFoods] = useState<Food[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

   
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 5;

   
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                if (sessionError || !session?.user) {
                    window.location.href = '/login';
                    return;
                }
                const user = session.user;

                const { data: profileData, error: profileError } = await supabase
                    .from('user_tb')
                    .select('fullname, user_image_url')
                    .eq('id', user.id)
                    .single();
                if (profileError) throw profileError;
                setProfile(profileData);

                const { data: foodsData, error: foodsError } = await supabase
                    .from('food_tb')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('fooddate_at', { ascending: false });
                if (foodsError) throw foodsError;
                setFoods(foodsData);

            } catch (err: unknown) {
                let errorMessage = "An unknown error occurred.";
                if (err instanceof Error) errorMessage = err.message;
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    
    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                const { error } = await supabase.from('food_tb').delete().match({ id });
                if (error) throw error;
                
                setFoods(foods.filter(food => food.id !== id));
            } catch (err: unknown) {
                let errorMessage = "Could not delete the item.";
                if (err instanceof Error) errorMessage = err.message;
                alert(`Error: ${errorMessage}`);
            }
        }
    };

   
    const filteredFoods = foods.filter(food =>
        food.foodname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredFoods.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentFoods = filteredFoods.slice(startIndex, startIndex + itemsPerPage);
    

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p className="text-xl font-semibold">Loading dashboard...</p></div>;
    }

    if (error) {
        return <div className="min-h-screen flex items-center justify-center bg-red-50"><p className="text-xl text-red-600">Error: {error}</p></div>;
    }

    return (
        <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
           
                <header className="flex justify-between items-center bg-white p-4 rounded-xl shadow-md mb-8">
                    <div className="flex items-center space-x-4">
                        <img
                            src={profile?.user_image_url || 'https://placehold.co/60x60/E2E8F0/4A5568?text=User'}
                            alt="Profile"
                            className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500"
                        />
                        <div>
                            <p className="text-gray-600">Welcome back,</p>
                            <h1 className="text-2xl font-bold text-gray-900">{profile?.fullname || 'User'}</h1>
                            <a href="/profile" className="text-sm text-emerald-600 hover:underline font-medium">View Profile</a>
                        </div>
                    </div>
                    <button onClick={() => supabase.auth.signOut().then(() => window.location.href = '/login')}
                        className="bg-red-500 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-red-600 transition-colors duration-300">
                        Logout
                    </button>
                </header>

             
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full">
                    <div className="flex flex-col sm:flex-row w-full mb-6 space-y-4 sm:space-y-0 sm:space-x-4 items-center">
                        <input
                            type="text"
                            placeholder="Search food by name..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="flex-grow w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <a href="/addfood" className="w-full sm:w-auto text-center bg-emerald-500 text-white font-bold py-2 px-8 rounded-lg shadow-lg hover:bg-emerald-600 transition-colors duration-300">
                            Add Food
                        </a>
                    </div>

                    <div className="w-full overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Food Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Meal</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentFoods.length > 0 ? (
                                    currentFoods.map((food) => (
                                        <tr key={food.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4"><img className="h-12 w-12 rounded-lg object-cover" src={food.food_image_url || 'https://placehold.co/100x100/E2E8F0/4A5568?text=No+Img'} alt={food.foodname} /></td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{food.foodname}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">{food.meal}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(food.fooddate_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <a href={`/updatefood/${food.id}`} className="text-emerald-600 hover:text-emerald-900 mr-4">Edit</a>
                                                <button onClick={() => handleDelete(food.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-500">No food items found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-between items-center w-full mt-6">
                            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 border rounded-lg text-sm font-semibold transition-colors disabled:opacity-50">Previous</button>
                            <span>Page {currentPage} of {totalPages}</span>
                            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 border rounded-lg text-sm font-semibold transition-colors disabled:opacity-50">Next</button>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

