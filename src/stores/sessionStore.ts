import { create } from 'zustand';

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
  setLocation: (location: UserLocation) => void;
  login: (email: string, username?: string) => void;
  signup: (email: string, username: string) => void;
  logout: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  sessionId: null,
  location: null,
  user: null,
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
}));

