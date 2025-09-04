import React from 'react';
import EditFoodForm from './EditFoodForm';

interface UpdateFoodPageProps {
  params: {
    foodId: string;
  };
}

export default function UpdateFoodPage({ params }: UpdateFoodPageProps) {
  const { foodId } = params;

  const initialData = {
    foodName: 'ข้าวผัด',
    date: '2023-10-27',
    imageURL: 'https://placehold.co/600x400/0284C7/FFFFFF?text=Food+Image',
  };

  if (!foodId) {
    return <div>Food ID is missing.</div>;
  }

  return <EditFoodForm initialData={initialData} />;
}
