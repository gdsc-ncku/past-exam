'use client';
import { useAuthentication } from '@/hooks/useAuthentication';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/ui/Button';
import Image from 'next/image';

export default function SettingPage() {
  const { currentUser, handleRefreshProfile } = useAuthentication();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      handleRefreshProfile();
    }
  }, []);

  if (!currentUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>請先登入</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-24 px-4">
      <h1 className="mb-8 text-2xl font-bold">個人設定</h1>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="mb-4 text-xl font-semibold">個人資料</h2>
          <div className="flex items-start space-x-4">
            <div className="relative h-24 w-24">
              <Image
                src={currentUser.avatar}
                alt="Profile"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  使用者名稱
                </label>
                <p className="text-gray-900">{currentUser.userName}</p>
              </div>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  電子郵件
                </label>
                <p className="text-gray-900">{currentUser.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="mb-4 text-xl font-semibold">帳號設定</h2>
          <div className="space-y-4">
            <Button
              className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => {
                // TODO: Implement delete account functionality
                console.log('Delete account clicked');
              }}
            >
              刪除帳號
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
