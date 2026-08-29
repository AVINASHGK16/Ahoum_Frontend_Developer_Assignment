import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserLocation {
  zone: string;
  area: string;
}

export interface UserSession {
  email: string;
  username?: string;
  isAuthenticated: boolean;
}

export interface SessionState {
  sessionId: string | null;
  location: UserLocation | null;
  user: UserSession | null;
  favorites: string[];
  setLocation: (location: UserLocation) => void;
  login: (email: string, username?: string) => void;
  signup: (email: string, username: string) => void;
  logout: () => void;
  toggleFavorite: (productId: string) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      sessionId: null,
      location: null,
      user: null,
      favorites: [],
      setLocation: (location) => set({ location }),
      login: (email, username) =>
        set({
          sessionId: `session_${Date.now()}`,
          user: {
            email,
            username,
            isAuthenticated: true,
          },
        }),
      signup: (email, username) =>
        set({
          sessionId: `session_${Date.now()}`,
          user: {
            email,
            username,
            isAuthenticated: true,
          },
        }),
      logout: () =>
        set({
          sessionId: null,
          user: null,
        }),
      toggleFavorite: (productId) =>
        set((state) => ({
          favorites: state.favorites.includes(productId)
            ? state.favorites.filter((id) => id !== productId)
            : [...state.favorites, productId],
        })),
    }),
    {
      name: 'ahoum-session',
      partialize: (state) => ({
        sessionId: state.sessionId,
        location: state.location,
        user: state.user,
        favorites: state.favorites,
      }),
    }
  )
);
