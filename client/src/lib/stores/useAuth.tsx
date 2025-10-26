import { create } from 'zustand';
import { User } from 'firebase/auth';

export interface PlayerProfile {
  uid: string;
  email: string;
  displayName: string;
  avatar: string;
  createdAt: number;
}

interface AuthState {
  user: User | null;
  profile: PlayerProfile | null;
  loading: boolean;
  
  setUser: (user: User | null) => void;
  setProfile: (profile: PlayerProfile | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: true,
  
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  logout: () => set({ user: null, profile: null }),
}));
