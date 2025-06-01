'use client';
import { useAuthentication } from '@/hooks/useAuthentication';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/ui/Button';
import { Icon } from '@/ui/icons';
import { getDepartmentInfo } from '@/module/data/departments';
import { getAvatarUrl } from '@/lib/utils';
import { User, Lock, ArrowRight } from 'lucide-react';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, handleRefreshProfile, handleLogin } =
    useAuthentication();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      handleRefreshProfile();
    }
  }, []);

  if (!currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="rounded-2xl bg-white p-6 text-center shadow-xl sm:p-8">
            {/* Icon */}
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 sm:h-20 sm:w-20">
              <Lock className="h-8 w-8 text-primary-600 sm:h-10 sm:w-10" />
            </div>

            {/* Title */}
            <h1 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl">
              請先登入
            </h1>

            {/* Description */}
            <p className="mb-6 text-sm leading-relaxed text-gray-600 sm:text-base">
              您需要登入才能訪問個人頁面
              <br />
              登入後可以管理您的上傳檔案和收藏
            </p>

            {/* Login Button */}
            <Button
              onClick={handleLogin}
              className="flex w-full items-center justify-center space-x-2 rounded-lg bg-primary-600 px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-primary-700"
            >
              <User className="h-4 w-4" />
              <span>立即登入</span>
              <ArrowRight className="h-4 w-4" />
            </Button>

            {/* Additional Info */}
            <p className="mt-4 text-xs text-gray-500 sm:text-sm">
              登入後即可享受完整的個人化服務
            </p>
          </div>

          {/* Back to Home Link */}
          <div className="mt-6 text-center">
            <Button
              variant="link"
              onClick={() => router.push('/')}
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              ← 返回首頁
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const UserBar = () => {
    return (
      <div className="bg-white p-4 shadow-sm sm:p-6">
        <div>
          <div className="mb-4 flex flex-col items-start space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <div className="relative flex h-16 w-16 flex-shrink-0 items-center lg:h-24 lg:w-24">
              <Image
                src={
                  currentUser?.avatar
                    ? getAvatarUrl(currentUser.avatar, true)
                    : '/default-avatar.svg'
                }
                alt="Profile"
                fill
                className="rounded-full object-cover"
                key={currentUser?.avatar || 'default'}
                unoptimized
              />
            </div>
            <div className="flex min-h-[64px] flex-1 items-start lg:min-h-[96px] lg:items-center">
              <div className="my-auto space-y-1 sm:space-y-2">
                <div className="text-xl font-bold lg:text-2xl">
                  {currentUser?.userName}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Icon name="user" size={16} />
                  <span>
                    {currentUser?.department == null
                      ? '科系尚未設定'
                      : getDepartmentInfo(currentUser.department).name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: Stacked Navigation */}
          <div className="flex flex-col space-y-2 lg:hidden">
            <Button
              variant="link"
              className="justify-start text-left text-base"
              onClick={() => router.push('/user/upload')}
            >
              上傳過的考古題
            </Button>
            <Button
              variant="link"
              className="justify-start text-left text-base"
              onClick={() => router.push('/user/bookmark')}
            >
              收藏的考古題
            </Button>
            <Button
              variant="link"
              className="justify-start text-left text-base"
              onClick={() => router.push('/user')}
            >
              個人設定
            </Button>
          </div>

          {/* Desktop: Horizontal Navigation */}
          <div className="hidden items-center space-x-4 lg:flex">
            <Button
              variant="link"
              className="text-base"
              onClick={() => router.push('/user/upload')}
            >
              上傳過的考古題
            </Button>
            <div className="text-base text-gray-300">|</div>
            <Button
              variant="link"
              className="text-base"
              onClick={() => router.push('/user/bookmark')}
            >
              收藏的考古題
            </Button>
            <div className="text-base text-gray-300">|</div>
            <Button
              variant="link"
              className="text-base"
              onClick={() => router.push('/user')}
            >
              個人設定
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto mt-16 px-4 lg:mt-24">
      <UserBar />
      {children}
    </div>
  );
}
