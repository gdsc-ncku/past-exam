export interface User{
    userName: string;
    avatar: string;
    email: string;
    isProfileCompleted: boolean;
}

export interface UserState {
    currentUser: User | null; // Holds the current user or null
    setUser: (user: User) => void; // Set user data in the store
    getUser: () => User | null; // Get the current user
    logout: () => void; // Log out by resetting user data
    login: () => Promise<void>; // Mock login function to simulate user login
}