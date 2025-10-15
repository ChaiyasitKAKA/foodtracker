"use client";
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supbaseclient';

interface Profile {
    id: string;
    fullname: string;
    email: string;
    gender: string;
    user_image_url: string | null;
}

export default function Profile() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [fullName, setFullName] = useState<string>('');
    const [gender, setGender] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [loading, setLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

    // Fetch user profile on component mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                if (sessionError || !session?.user) {
                    window.location.href = '/login';
                    return;
                }
                const user = session.user;

                const { data, error } = await supabase
                    .from('user_tb')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;

                setProfile(data);
                setFullName(data.fullname || '');
                setGender(data.gender || '');
                setImagePreview(data.user_image_url || null);

            } catch (err: unknown) {
                let errorMessage = "Could not fetch profile.";
                if (err instanceof Error) errorMessage = err.message;
                setMessage(`Error: ${errorMessage}`);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImageFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage('');

        if (!profile) return;

        try {
            let imageUrl = profile.user_image_url;

            // Step 1: Upload new image if one is selected
            if (imageFile) {
                // To update a file, you might first remove the old one or just upload with a new name.
                // For simplicity, we'll upload with a new name. A more robust solution might delete the old file.
                const fileName = `${profile.id}/${uuidv4()}`;
                const { error: uploadError } = await supabase.storage
                    .from('user_bk')
                    .upload(fileName, imageFile, { upsert: true }); // Use upsert to overwrite if needed

                if (uploadError) throw uploadError;

                const { data: urlData } = supabase.storage.from('user_bk').getPublicUrl(fileName);
                imageUrl = urlData.publicUrl;
            }

            // Step 2: Update the user profile in 'user_tb'
            const { data, error } = await supabase
                .from('user_tb')
                .update({
                    fullname: fullName,
                    gender: gender,
                    user_image_url: imageUrl,
                })
                .eq('id', profile.id)
                .select()
                .single();

            if (error) throw error;
            
            // Update local state with the newly saved data
            setProfile(data); 
            setImagePreview(data.user_image_url);
            setImageFile(null); // Clear the file input state

            setMessage('Profile updated successfully!');

        } catch (err: unknown) {
            let errorMessage = "An unknown error occurred.";
            if (err instanceof Error) errorMessage = err.message;
            setMessage(`Error: ${errorMessage}`);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p>Loading profile...</p></div>;
    }

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg text-center">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 uppercase tracking-wide mb-8">
                    User Profile
                </h1>

                 {message && (
                    <div className={`p-3 mb-4 text-sm rounded-lg ${message.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                )}

                <form className="w-full space-y-6" onSubmit={handleSave}>
                    <div className="flex flex-col items-center w-full mb-4">
                        <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-emerald-500 shadow-lg mb-4">
                            <img
                                src={imagePreview || 'https://placehold.co/150x150/E2E8F0/4A5568?text=Profile'}
                                alt="Profile Preview"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <label className="text-sm font-medium text-gray-700 mb-2 cursor-pointer bg-gray-100 py-2 px-4 rounded-full hover:bg-gray-200 transition-colors">
                            Change Profile Picture
                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </label>
                    </div>

                    <div className="w-full text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={profile?.email || ''}
                            disabled
                            className="w-full px-4 py-3 bg-gray-100 border-gray-300 rounded-lg cursor-not-allowed"
                        />
                         <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
                    </div>

                    <div className="w-full text-left">
                         <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    
                    <div className="w-full text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="flex flex-col sm:flex-row w-full space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full sm:w-1/2 bg-emerald-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-emerald-600 transition-colors duration-300 disabled:bg-gray-400"
                        >
                            {isSaving ? 'Saving...' : 'Save Profile'}
                        </button>
                        <a href="/dashboard" className="w-full sm:w-1/2">
                             <button
                                type="button"
                                className="w-full py-3 px-8 rounded-full border border-emerald-500 text-emerald-500 font-bold hover:bg-emerald-50 transition-colors duration-300"
                            >
                                Go to Dashboard
                            </button>
                        </a>
                    </div>
                </form>
            </div>
        </main>
    );
}
