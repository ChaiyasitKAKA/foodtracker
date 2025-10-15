"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supbaseclient';
import { v4 as uuidv4 } from 'uuid';


export default function Register() {
    const [fullName, setFullName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [gender, setGender] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null); // State for the actual file
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImageFile(file); // Store the file object

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

    // 3. Updated handleSubmit function to be async and handle Supabase logic
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!fullName || !email || !password || !gender) {
            setMessage('กรุณากรอกข้อมูลให้ครบทุกช่อง');
            return;
        }

        setIsSubmitting(true);
        setMessage('');

        try {
            
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: email,
                password: password,
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error("Registration successful, but no user data returned.");

            const user = authData.user;
            let imageUrl: string | null = null;

            
            if (imageFile) {
                const fileName = `${user.id}/${uuidv4()}`;
                const { error: uploadError } = await supabase.storage
                    .from('user_bk') 
                    .upload(fileName, imageFile);

                if (uploadError) throw uploadError;

                const { data: urlData } = supabase.storage.from('user_bk').getPublicUrl(fileName);
                imageUrl = urlData.publicUrl;
            }

            
            const { error: insertError } = await supabase.from('user_tb').insert({
                id: user.id,
                fullname: fullName,
                email: email,
                gender: gender,
                user_image_url: imageUrl,
                
            });

            if (insertError) throw insertError;

            setMessage('ลงทะเบียนสำเร็จ! กรุณาตรวจสอบอีเมลเพื่อยืนยัน');
            setTimeout(() => {
                window.location.href = '/login';
            }, 3000);

        } catch (error: any) {
            console.error('Registration error:', error);
            setMessage(`เกิดข้อผิดพลาด: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg text-center">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 uppercase tracking-wide mb-6">
                    Register
                </h1>

                {/* Message display for success or error */}
                {message && (
                    <div className={`p-3 mb-4 text-sm rounded-lg ${message.startsWith('เกิดข้อผิดพลาด') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                )}

                <form className="w-full space-y-6" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-500"
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>

                    <div className="flex flex-col items-center space-y-4">
                         <label htmlFor="profile-image" className="cursor-pointer text-sm font-medium text-gray-700">
                            Choose Profile Picture
                        </label>
                        <input
                            type="file"
                            id="profile-image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                        />
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Profile Preview"
                                className="w-32 h-32 rounded-full object-cover shadow-md border-2 border-emerald-500"
                            />
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-emerald-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-emerald-600 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100"
                    >
                        {isSubmitting ? 'Registering...' : 'Register'}
                    </button>
                </form>

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

