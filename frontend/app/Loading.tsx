'use client';
import React from 'react';

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-primary-300"></div>
        <p className="text-small text-secondary">Loading...</p>
      </div>
    </div>
  );
}
