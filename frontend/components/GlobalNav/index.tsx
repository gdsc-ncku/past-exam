'use client';
import { useRouter } from 'next/navigation';
import { useAuthentication } from '@/hooks/useAuthentication';
import { Icon } from '@/ui/icons';
import { Button } from '@/ui/Button';
import Image from 'next/image';
import { useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/MenuItem';
import User from '@/types/user';
import logoImage from '@/assets/images/logo.png';
import { getAvatarUrl } from '@/lib/utils';

export const GlobalNav = () => {
  const router = useRouter();
  const { currentUser, handleLogout, handleLogin, handleRefreshProfile } =
    useAuthentication();

  useEffect(() => {
    if (!currentUser) {
      handleRefreshProfile();
    }
  }, []);
  const AvatarDropdown = ({ user }: { user: User }) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="relative h-8 w-8 overflow-hidden rounded-full">
            <Image
              src={user.avatar ? getAvatarUrl(user.avatar) : '/default-avatar.svg'}
              alt="avatar"
              fill
              className="object-cover"
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-white">
          <DropdownMenuLabel className="whitespace-normal break-words">
            {user.userName}，歡迎回來！
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-secondary-100" />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="flex items-center gap-2 hover:bg-primary-50"
              onClick={() => router.push('/user')}
            >
              <Icon name="user" size={30} /> 個人頁面
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2 hover:bg-primary-50"
              onClick={() => router.push('/user/bookmark')}
            >
              <Icon name="bookmark" size={30} /> 收藏的考古題
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2 hover:bg-primary-50"
              onClick={() => router.push('/user/upload')}
            >
              <Icon name="upload" size={30} /> 上傳過的考古題
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2 hover:bg-primary-50"
              onClick={() => router.push('/user/setting')}
            >
              <Icon name="setting" size={30} /> 個人設定
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="bg-secondary-100" />
          <DropdownMenuItem
            className="flex items-center gap-2 text-red-500 hover:bg-primary-50"
            onClick={() => handleLogout()}
          >
            登出
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="fixed top-0 z-10 w-full border-b border-gray-800 lg:w-full lg:border-b-0 lg:border-r lg:border-gray-800">
      <div className="flex w-full items-center justify-between px-16 py-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            className="hover:bg-transparent"
            onClick={() => router.push('/')}
          >
            <Image src={logoImage} alt="logo" width={110} height={110} />
          </Button>
        </div>
        <div className="mr-16 flex items-center space-x-4">
          <div>
            <Button variant="ghost" onClick={() => router.push('/search')}>
              搜尋知識
            </Button>
          </div>
          <div>
            <Button variant="ghost" onClick={() => router.push('/upload')}>
              貢獻知識
            </Button>
          </div>
          <div>
            <Button
              variant="ghost"
              onClick={() => window.open('https://github.com/gdsc-ncku/past-exam', '_blank')}
            >
              關於
            </Button>
          </div>
          <div>
            {currentUser ? (
              <AvatarDropdown user={currentUser} />
            ) : (
              <Button className="!rounded-[50px]" onClick={() => handleLogin()}>
                登入
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
