'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/ui/Button';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* 404 Number */}
        <div className="relative">
          <h1 className="select-none text-9xl font-bold text-gray-200">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                頁面未找到
              </h2>
              <p className="mt-2 text-gray-600">
                抱歉，您要找的頁面不存在或已被移除
              </p>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="relative">
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur"></div>
          <div className="relative rounded-lg bg-white p-8 shadow-lg">
            {/* Navigation Options */}
            <div className="space-y-4">
              <p className="mb-6 text-gray-600">您可以：</p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Button
                  variant="secondary"
                  className="group h-12 w-full"
                  onClick={() => router.push('/')}
                >
                  <Home className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                  返回首頁
                </Button>

                <Button
                  variant="secondary"
                  className="group h-12 w-full"
                  onClick={() => router.push('/search')}
                >
                  <Search className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                  搜尋課程
                </Button>
              </div>

              <Button
                variant="ghost"
                className="group mt-4 w-full"
                onClick={() => router.back()}
              >
                <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
                返回上一頁
              </Button>
            </div>
          </div>
        </div>

        {/* Additional Help Text */}
        <p className="mt-8 text-sm text-gray-500">
          如果您認為這是一個錯誤，請聯繫系統管理員
        </p>
      </div>
    </div>
  );
}
