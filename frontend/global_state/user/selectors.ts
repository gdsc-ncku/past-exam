import { UserState } from './types';

export const selectIsAuthenticated = (state: UserState) => !!state.currentUser;