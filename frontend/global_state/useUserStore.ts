// useUserStore.ts
import { create } from 'zustand';
import { User } from './User'; // Import the User interface

interface UserState {
  currentUser: User | null; // Holds the current user or null
  setUser: (user: User) => void; // Set user data in the store
  getUser: () => User | null; // Get the current user
  logout: () => void; // Log out by resetting user data
  login: () => void; // Mock login function to simulate user login
}

export const useUserStore = create<UserState>((set, get) => ({
  currentUser: null, // Initialize currentUser as null
  setUser: (user: User) => set({ currentUser: user }), // Set user
  getUser: () => get().currentUser, // Return the current user
  logout: () => set({ currentUser: null }), // Clear user data
  login: async () => mockLogin(),
  }));

async function mockLogin(){
    // Simulate a mock login process (fake API call)
    const mockUser: User = {
        userName: 'JohnDoe',
        avatar: '/nextjs-icon-light-background.png',
        email: 'johndoe@example.com',
        is_profile_completed: true,
    };

    // Simulate a delay as if calling an API
    setTimeout(() => {
        useUserStore.setState({ currentUser: mockUser });
    }, 1000); // 1 second delay for mock login
}