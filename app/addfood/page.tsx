"use client";

import { useState } from "react";
import { supabase } from "@/lib/supbaseclient"; 
import { v4 as uuidv4 } from "uuid";


function isErrorWithMessage(error: unknown): error is { message: string } {
    return (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
    
        typeof (error as { message: unknown }).message === 'string'
    );
}

export default function AddFood() {
    const [foodName, setFoodName] = useState<string>('');
    const [meal, setMeal] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

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

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!foodName || !date || !meal) {
            setMessage('กรุณากรอกข้อมูลให้ครบทุกช่อง');
            return;
        }

        setIsSubmitting(true);
        setMessage('');
        let imageUrl: string | null = null;

        try {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError || !session?.user) {
                throw new Error("You must be logged in to add food.");
            }
            const user = session.user;

            if (imageFile) {
                const fileName = `${user.id}/${uuidv4()}`;

              
                const { error: uploadError } = await supabase.storage
                    .from('food_bk')
                    .upload(fileName, imageFile);

                if (uploadError) {
                    throw uploadError;
                }

                const { data: publicUrlData } = supabase.storage
                    .from("food_bk")
                    .getPublicUrl(fileName);
                
                imageUrl = publicUrlData.publicUrl;
            }

            const { error: insertError } = await supabase.from('food_tb').insert({
                foodname: foodName,
                meal: meal,
                fooddate_at: date,
                food_image_url: imageUrl,
                user_id: user.id,
            });

            if (insertError) {
                throw insertError;
            }

            setMessage('บันทึกข้อมูลสำเร็จ!');
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1500);

        } catch (error: unknown) { 
            console.error('Error saving food:', error);
            
            let errorMessage = 'An unexpected error occurred.';
           
            if (isErrorWithMessage(error)) {
                errorMessage = error.message;
            }
            setMessage(`เกิดข้อผิดพลาด: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg text-center">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 uppercase tracking-wide mb-6">
                    Add Food
                </h1>
                
                {message && (
                    <div className={`p-3 mb-4 text-sm rounded-lg ${message.startsWith('เกิดข้อผิดพลาด') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                )}

                <form className="w-full space-y-6" onSubmit={handleSave}>
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
                    <div className="flex flex-col items-start w-full">
                        <label className="text-sm font-medium text-gray-700 mb-2">Food Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                        />
                        {imagePreview && (
                            <div className="mt-4 w-full flex justify-center">
                                <img src={imagePreview} alt="Image Preview" className="rounded-lg max-w-full h-48 object-cover shadow-md" />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col sm:flex-row w-full space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full sm:w-1/2 bg-emerald-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-emerald-600 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Food'}
                        </button>
                        <a
                            href="/dashboard"
                            className="w-full sm:w-1/2 py-3 px-8 rounded-full border border-emerald-500 text-emerald-500 font-bold hover:bg-emerald-50 transition-colors duration-300 transform hover:scale-105 inline-flex items-center justify-center"
                        >
                            Go to Dashboard
                        </a>
                    </div>
                </form>
            </div>
        </main>
    );
}

