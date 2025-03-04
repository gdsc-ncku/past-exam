import { useUserStore } from '@/module/zustand/user/store';

export const useAuthentication = () => {
  const store = useUserStore();
  const isAuthenticated = !!store.currentUser;
  const { currentUser, login, logout, refreshProfile } = store;

  // Handle the login button click
  const handleLogin = () => {
    if (isAuthenticated) {
      return;
    }
    login();
  };

  const handleLogout = () => {
    logout(); // Clear user data when logging out
    window.location.reload();
  };
  const handleRefreshProfile = () => {
    refreshProfile();
  };
  return {
    currentUser,
    handleLogin,
    handleLogout,
    handleRefreshProfile,
  };
};
