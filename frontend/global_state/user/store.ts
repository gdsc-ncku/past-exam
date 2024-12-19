// useUserStore.ts
import { create } from 'zustand';
import { User, UserState } from './types'; // Import the User interface

export const useUserStore = create<UserState>((set, get) => ({
  currentUser: null, // Initialize currentUser as null
  setUser: (user: User) => set({ currentUser: user }), // Set user
  getUser: () => get().currentUser, // Return the current user
  logout: () => set({ currentUser: null }), // Clear user data
  login: async () => mockLogin(),
  }));

async function mockLogin(){
    return new Promise<void>((resolve, reject) => { //using Promise for better manage async function
        // Simulate a mock login process (fake API call)
        const mockUser: User = {
            userName: 'JohnDoe',
            avatar: '/nextjs-icon-light-background.png',
            email: 'johndoe@example.com',
            isProfileCompleted: true,
        };

        // Simulate a delay as if calling an API
        const timer = setTimeout(() => {
            useUserStore.setState({ currentUser: mockUser });
            resolve();
        }, 1000); // 1 second delay for mock login

        return () => clearTimeout(timer);
    });
}