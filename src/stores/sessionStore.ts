import { create } from 'zustand';

export interface UserLocation {
  zone: string;
  area: string;
}

export interface SessionState {
  sessionId: string | null;
  location: UserLocation | null;
  setLocation: (location: UserLocation) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  sessionId: null,
  location: null,
  setLocation: (location) => set({ location }),
}));
