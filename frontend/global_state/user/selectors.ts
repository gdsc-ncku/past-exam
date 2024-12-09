import { UserState } from './types';

export const selectCurrentUser = (state: UserState) => state.currentUser;

export const selectIsAuthenticated = (state: UserState) => !!state.currentUser;

export const selectUserProfile = (state: UserState) => {
  const user = state.currentUser;
  return user ? {
    userName: `${user.userName}`,
    avatar: user.avatar,
    email: user.email,
    isProfileCompleted: user.isProfileCompleted,
  } : null;
};