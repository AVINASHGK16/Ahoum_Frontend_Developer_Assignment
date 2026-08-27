import { create } from 'zustand';

export interface SessionState {
  sessionId: string | null;
}

export const useSessionStore = create<SessionState>(() => ({
  sessionId: null,
}));
