import { create } from 'zustand';

export interface UserLocation {
  zone: string;
  area: string;
}

export interface UserSession {
  email: string;
  isAuthenticated: boolean;
}

export interface SessionState {
  sessionId: string | null;
  location: UserLocation | null;
  user: UserSession | null;
  setLocation: (location: UserLocation) => void;
  login: (email: string) => void;
  logout: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  sessionId: null,
  location: null,
  user: null,
  setLocation: (location) => set({ location }),
  login: (email) =>
    set({
      sessionId: `session_${Date.now()}`,
      user: {
        email,
        isAuthenticated: true,
      },
    }),
  logout: () =>
    set({
      sessionId: null,
      user: null,
    }),
}));

