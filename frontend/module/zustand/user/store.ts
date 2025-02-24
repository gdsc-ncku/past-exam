// useUserStore.ts
import { create } from 'zustand';
import User from '@/types/user';
import { userAPI } from '@/module/api/user';

interface UserState {
  currentUser: User | null; // Holds the current user or null
  setUser: (user: User) => void; // Set user data in the store
  getUser: () => User | null; // Get the current user
  logout: () => void; // Log out by resetting user data
  login: () => void; // Mock login function to simulate user login
  refreshProfile: () => void; // Get the current user
}

export const useUserStore = create<UserState>((set, get) => ({
  currentUser: null, // Initialize currentUser as null
  setUser: (user: User) => set({ currentUser: user }), // Set user
  getUser: () => get().currentUser, // Return the current user
  logout: () => set({ currentUser: null }), // Clear user data
  login: async () => login(),
  refreshProfile: async () => refreshProfile(),
}));

async function login() {
  if (useUserStore.getState().currentUser) {
    return;
  }
  if (useUserStore.getState().currentUser === null) {
    // Check if we have an existing session cookie first
    const profile = await userAPI.getProfile();
    if (profile.data.status === 'success') {
      // Transform API response to match User interface
      const userData: User = {
        userName: profile.data.data.username,
        email: profile.data.data.email,
        avatar: profile.data.data.avatar,
        isProfileCompleted: profile.data.data.is_profile_completed,
      };
      console.log(userData);
      useUserStore.getState().setUser(userData);
      return;
    }
    userAPI.googleLogin();
  }
}
async function refreshProfile() {
  const profile = await userAPI.getProfile();
  if (profile.data.status === 'success') {
    const userData: User = {
      userName: profile.data.data.username,
      email: profile.data.data.email,
      avatar: profile.data.data.avatar,
      isProfileCompleted: profile.data.data.is_profile_completed,
    };
    useUserStore.getState().setUser(userData);
  } else {
    useUserStore.getState().logout();
  }
}
