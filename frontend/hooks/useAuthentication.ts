import { selectIsAuthenticated } from '@/global_state/user/selectors';
import { useUserStore } from '@/global_state/user/store'; // Import Zustand store

export const useAuthentication = () =>{

  const isAuthenticated = selectIsAuthenticated(useUserStore());
  const {currentUser, login, logout} = useUserStore();

  // Handle the login button click
  const handleLogin = () => {
      if (!isAuthenticated) {
      login(); // Simulate user login (you can replace this with actual login logic)
      }
  };

  const handleLogout = () => {
    logout(); // Clear user data when logging out
  };

  return{
    currentUser,
    handleLogin,
    handleLogout,
  };
};

