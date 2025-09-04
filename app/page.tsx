

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import food from './images/food.jpg'

export default function Home() {
  return (
    // Main container with a clean background and full-screen height
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Container for content, centered and with rounded corners */}
      <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-lg w-full text-center">
        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 uppercase tracking-wide mb-4">
          welcome to food tracker
        </h1>
        {/* Sub-heading */}
        <p className="text-base sm:text-lg text-gray-600 mb-8">
          track you meal!!!
        </p>

        {/* Placeholder image for the app, with appropriate styling */}
        <div className="mb-8 overflow-hidden rounded-xl w-full max-w-xs sm:max-w-sm lg:max-w-md">
          <Image
            src={food}
            alt="An illustration of a person tracking meals on a digital device, with various food items in the background."
            className="object-cover w-full h-auto shadow-md rounded-xl"
          />
        </div>

        {/* Container for the buttons, using flexbox for horizontal layout */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          {/* Register button */}
          <Link href="/register" className="w-full sm:w-auto">
            <button className="bg-emerald-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-emerald-600 transition-colors duration-300 w-full transform hover:scale-105">
              Register
            </button>
          </Link>

          {/* Login button */}
          <Link href="/login" className="w-full sm:w-auto">
            <button className="bg-slate-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-slate-800 transition-colors duration-300 w-full transform hover:scale-105">
              Login
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}