"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

// ประเภทข้อมูลอาหาร
interface FoodItem {
  foodName: string;
  date: string;
  imageURL: string;
}

// ฟอร์มแก้ไขอาหาร
function EditFoodForm({ initialData }: { initialData: FoodItem }) {
  const router = useRouter();
  const [foodName, setFoodName] = useState(initialData.foodName);
  const [date, setDate] = useState(initialData.date);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(initialData.imageURL);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(initialData.imageURL);
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Saving changes:", { foodName, date, imageFile });
    alert("Food item updated successfully!");
    // router.push('/dashboard'); // ถ้าต้องการกลับหน้า dashboard
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-lg w-full text-center">
      <h1 className="text-4xl font-extrabold text-gray-900 uppercase mb-8">
        Edit Food
      </h1>
      <form className="w-full space-y-6" onSubmit={handleSave}>
        <input
          type="text"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg"
          placeholder="Food Name"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg"
        />
        <div className="flex flex-col items-start w-full">
          <label className="text-sm font-medium mb-2">Food Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && (
            <div className="mt-4 w-full flex justify-center">
              <img
                src={imagePreview}
                alt="Preview"
                className="rounded-lg max-w-full h-48 object-cover"
              />
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row w-full space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
          <button
            type="submit"
            className="w-full sm:w-1/2 bg-emerald-500 text-white py-3 rounded-full"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="w-full sm:w-1/2 py-3 rounded-full border"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
}

// หน้า UpdateFoodPage แบบรวมทุกอย่าง
export default function UpdateFoodPage() {
  const mockInitialData: FoodItem = {
    foodName: "ข้าวผัด",
    date: "2023-10-27",
    imageURL: "https://placehold.co/600x400/0284C7/FFFFFF?text=Food+1",
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <EditFoodForm initialData={mockInitialData} />
    </main>
  );
}
