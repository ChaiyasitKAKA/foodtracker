"use client";

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supbaseclient";

export default function EditFoodPage() {
    // State for form fields
    const [foodName, setFoodName] = useState<string>('');
    const [meal, setMeal] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [foodId, setFoodId] = useState<string | null>(null);

    // State for image handling
    const [newImageFile, setNewImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);

    // State for UI feedback
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

    // On component mount, get food ID from URL and fetch data
    useEffect(() => {
        // Function to extract ID from URL path (e.g., /edit-food/123)
        const getFoodIdFromUrl = () => {
            const pathParts = window.location.pathname.split('/');
            return pathParts[pathParts.length - 1] || null;
        };

        const foodIdFromUrl = getFoodIdFromUrl();
        setFoodId(foodIdFromUrl);

        if (!foodIdFromUrl) {
            setMessage("Error: Food ID not found in URL.");
            setLoading(false);
            return;
        }

        const fetchFood = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session?.user) {
                    window.location.href = '/login';
                    return;
                }

                const { data, error } = await supabase
                    .from("food_tb")
                    .select("foodname, meal, fooddate_at, food_image_url")
                    .eq("id", foodIdFromUrl)
                    .single();

                if (error) throw error;

                if (data) {
                    setFoodName(data.foodname);
                    setMeal(data.meal);
                    // Format date for the input type="date" which expects 'YYYY-MM-DD'
                    const formattedDate = new Date(data.fooddate_at).toISOString().split('T')[0];
                    setDate(formattedDate);
                    setImagePreview(data.food_image_url || "");
                    setOriginalImageUrl(data.food_image_url || "");
                } else {
                    setMessage("Food item not found.");
                }
            } catch (err: unknown) {
                 let errorMessage = "Could not fetch food data.";
                if (err instanceof Error) errorMessage = err.message;
                setMessage(`Error: ${errorMessage}`);
            } finally {
                setLoading(false);
            }
        };

        fetchFood();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!foodId) return;
        
        setIsSaving(true);
        setMessage('');

        try {
             const { data: { user } } = await supabase.auth.getUser();
             if (!user) throw new Error("User not authenticated.");

            let finalImageUrl = originalImageUrl;

            // If a new image is selected, upload it
            if (newImageFile) {
                // Optional: Delete the old image from storage to save space
                if (originalImageUrl) {
                    const oldFileName = originalImageUrl.split('/').pop();
                    if(oldFileName) {
                        await supabase.storage.from("food_bk").remove([`${user.id}/${oldFileName}`]);
                    }
                }
                
                const fileName = `${user.id}/${uuidv4()}`;
                const { error: uploadError } = await supabase.storage
                    .from("food_bk")
                    .upload(fileName, newImageFile);

                if (uploadError) throw uploadError;

                const { data: urlData } = supabase.storage.from("food_bk").getPublicUrl(fileName);
                finalImageUrl = urlData.publicUrl;
            }

            // Update the record in the database
            const { error } = await supabase
                .from("food_tb")
                .update({
                    foodname: foodName,
                    meal: meal,
                    fooddate_at: date,
                    food_image_url: finalImageUrl,
                })
                .eq("id", foodId);

            if (error) throw error;

            setMessage("Food item updated successfully!");
            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 1500);

        } catch (err: unknown) {
            let errorMessage = "An unexpected error occurred.";
            if (err instanceof Error) errorMessage = err.message;
            setMessage(`Error: ${errorMessage}`);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p>Loading food data...</p></div>;
    }

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg text-center">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 uppercase tracking-wide mb-6">
                    Edit Food
                </h1>
                
                {message && (
                    <div className={`p-3 mb-4 text-sm rounded-lg ${message.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                )}

                <form className="w-full space-y-6" onSubmit={handleSubmit}>
                    <div className="flex flex-col items-center w-full">
                        <img src={imagePreview || 'https://placehold.co/200x200/E2E8F0/4A5568?text=No+Image'} alt="Food Preview" className="rounded-lg w-48 h-48 object-cover shadow-md mb-4" />
                        <label className="text-sm font-medium text-gray-700 cursor-pointer bg-gray-100 py-2 px-4 rounded-full hover:bg-gray-200">
                            Change Image
                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </label>
                    </div>

                    <input
                        type="text"
                        placeholder="Food Name"
                        value={foodName}
                        onChange={(e) => setFoodName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <select
                        value={meal}
                        onChange={(e) => setMeal(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-500"
                    >
                        <option value="">Select Meal</option>
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                        <option value="snack">Snack</option>
                    </select>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    
                    <div className="flex flex-col sm:flex-row w-full space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full sm:w-1/2 bg-emerald-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-emerald-600 transition-all disabled:bg-gray-400"
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <a
                            href="/dashboard"
                            className="w-full sm:w-1/2 py-3 px-8 rounded-full border border-emerald-500 text-emerald-500 font-bold hover:bg-emerald-50 transition-colors inline-flex items-center justify-center"
                        >
                            Cancel
                        </a>
                    </div>
                </form>
            </div>
        </main>
    );
}
