'use client';
import { useRouter } from 'next/navigation';
import { useAuthentication } from '@/hooks/useAuthentication';
import { Icon } from '@/ui/icons';
import { Button } from '@/ui/Button';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      handleRefreshProfile();
    }
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    closeMobileMenu();
  };

  const AvatarDropdown = ({ user }: { user: User }) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="relative h-8 w-8 overflow-hidden rounded-full">
            <Image
              src={
                user.avatar
                  ? getAvatarUrl(user.avatar, true)
                  : '/default-avatar.svg'
              }
              alt="avatar"
              fill
              className="object-cover"
              key={user.avatar || 'default'}
              unoptimized
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
              onClick={() => router.push('/user')}
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
    <div className="fixed top-0 z-50 w-full bg-white shadow-sm">
      {/* Desktop Navigation - Original Layout */}
      <div className="hidden w-full items-center justify-between px-16 py-6 lg:flex">
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
              onClick={() =>
                window.open('https://github.com/gdsc-ncku/past-exam', '_blank')
              }
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

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Button
                variant="ghost"
                className="p-0 hover:bg-transparent"
                onClick={() => handleNavigation('/')}
              >
                <Image
                  src={logoImage}
                  alt="logo"
                  width={80}
                  height={80}
                  className="h-10 w-auto sm:h-12"
                />
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center space-x-2">
              {currentUser && <AvatarDropdown user={currentUser} />}
              <Button
                variant="ghost"
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 text-gray-600 hover:bg-primary-50 hover:text-primary-600"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="bg-white px-2 pb-3 pt-2 shadow-lg sm:px-3">
            <div className="space-y-1">
              <Button
                variant="ghost"
                onClick={() => handleNavigation('/search')}
                className="block w-full rounded-md px-3 py-2 text-left text-base font-medium hover:bg-primary-50 hover:text-primary-600"
              >
                搜尋知識
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleNavigation('/upload')}
                className="block w-full rounded-md px-3 py-2 text-left text-base font-medium hover:bg-primary-50 hover:text-primary-600"
              >
                貢獻知識
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  window.open(
                    'https://github.com/gdsc-ncku/past-exam',
                    '_blank',
                  );
                  closeMobileMenu();
                }}
                className="block w-full rounded-md px-3 py-2 text-left text-base font-medium hover:bg-primary-50 hover:text-primary-600"
              >
                關於
              </Button>
              {!currentUser && (
                <div className="pt-4">
                  <Button
                    className="w-full rounded-full bg-primary-500 px-4 py-2 text-base font-medium text-white hover:bg-primary-600"
                    onClick={() => {
                      handleLogin();
                      closeMobileMenu();
                    }}
                  >
                    登入
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
