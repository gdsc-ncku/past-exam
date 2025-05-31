'use client';
import { useAuthentication } from '@/hooks/useAuthentication';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/ui/Button';
import { Icon } from '@/ui/icons';
import { getDepartmentInfo } from '@/module/data/departments';
import { getAvatarUrl } from '@/lib/utils';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
  const UserBar = () => {
    return (
      <div className="bg-white p-6 shadow-sm">
        <div>
          <div className="mb-4 flex items-start space-x-4">
            <div className="relative flex h-24 w-24 items-center">
              <Image
                src={currentUser?.avatar ? getAvatarUrl(currentUser.avatar) : '/default-avatar.svg'}
                alt="Profile"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div className="flex min-h-[96px] flex-1 items-center">
              <div className="my-auto space-y-2">
                <div className="text-mb-4 text-h2">{currentUser?.userName}</div>
                <div className="flex items-center space-x-2 text-secondary-500 text-subtle">
                  <Icon name="user" size={16} />
                  {currentUser?.department == null
                    ? '科系尚未設定'
                    : getDepartmentInfo(currentUser.department).name}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="link"
              className="text-large-content"
              onClick={() => router.push('/user/upload')}
            >
              上傳過的考古題
            </Button>
            <div className="text-gray-300 text-large-content">|</div>
            <Button
              variant="link"
              className="text-large-content"
              onClick={() => router.push('/user/bookmark')}
            >
              收藏的考古題
            </Button>
            <div className="text-gray-300 text-large-content">|</div>
            <Button
              variant="link"
              className="text-large-content"
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
    <div className="container mx-auto mt-24 px-4">
      <UserBar />
      {children}
    </div>
  );
}
