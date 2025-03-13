'use client';
import React from 'react';

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-blue-500"></div>
        <p className="mt-4 text-xl text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
