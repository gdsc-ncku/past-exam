'use client';

import { useNavigation } from '@/hooks/useNavigation';
import { useAuthentication } from '@/hooks/useAuthentication';
import { Icon } from '@/ui/icons';
import { Button } from '@/ui/Button';
import Image from 'next/image';
import { useEffect } from 'react';
export const GlobalNav = () => {
  const { isDropdownOpen, toggleDropdown } = useNavigation();

  const { currentUser, handleLogout, handleLogin, handleRefreshProfile } =
    useAuthentication();

  useEffect(() => {
    if (!currentUser) {
      handleRefreshProfile();
    }
  }, []);

  return (
    <div className="fixed top-0 z-10 w-full border-b border-gray-800 lg:w-full lg:border-b-0 lg:border-r lg:border-gray-800">
      <div className="flex w-full items-center justify-between px-4 py-4">
        <div className="flex items-center space-x-4">
          <Icon name="logo" />
        </div>
        <div className="mr-16 flex items-center space-x-4">
          <div>
            <Button variant="ghost">搜尋知識</Button>
          </div>
          <div>
            <Button variant="ghost">貢獻知識</Button>
          </div>
          <div>
            <Button variant="ghost">關於</Button>
          </div>
          <div>
            {currentUser ? (
              <Image
                src={currentUser.avatar}
                alt="avatar"
                width={32}
                height={32}
                className="rounded-full"
              />
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
