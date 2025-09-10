import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isDemoMode: boolean;
  signOut: () => Promise<void>;
  getAuthToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Check for demo mode
    const checkDemoMode = () => {
      const demoMode = localStorage.getItem('demoMode') === 'true';
      setIsDemoMode(demoMode);
      
      if (demoMode) {
        // In demo mode, create mock user and session
        const mockUser = {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'demo@example.com'
        } as User;
        
        const mockSession = {
          access_token: 'demo-token',
          user: mockUser
        } as Session;
        
        setUser(mockUser);
        setSession(mockSession);
        setLoading(false);
        return true;
      } else {
        // Not in demo mode, clear demo state
        if (isDemoMode) {
          setUser(null);
          setSession(null);
          setIsDemoMode(false);
        }
      }
      return false;
    };

    // Initial check
    if (checkDemoMode()) return;

    // Listen for storage changes (demo mode changes from other tabs)
    const handleStorageChange = () => {
      checkDemoMode();
    };
    
    // Listen for custom demo mode events (same tab changes)
    const handleDemoModeChange = () => {
      checkDemoMode();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('demoModeChange', handleDemoModeChange);

    // Normal auth flow
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('demoModeChange', handleDemoModeChange);
    };
  }, []);

  const signOut = async () => {
    if (isDemoMode) {
      // Clear demo mode and redirect immediately without triggering state updates
      localStorage.removeItem('demoMode');
      window.location.href = '/';
      return;
    }
    
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const getAuthToken = () => {
    if (isDemoMode) {
      return 'demo-token'; // Will be handled by backend test mode
    }
    return session?.access_token ?? null;
  };

  const value = {
    user,
    session,
    loading,
    isDemoMode,
    signOut,
    getAuthToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}