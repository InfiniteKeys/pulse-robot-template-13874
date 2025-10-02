import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isOverseer: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAdmin: false,
  isOverseer: false,
  loading: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOverseer, setIsOverseer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for manually stored session from Netlify auth
    const checkStoredSession = async () => {
      try {
        const storedAuth = localStorage.getItem('supabase.auth.token');
        if (storedAuth) {
          const authData = JSON.parse(storedAuth);
          if (authData.user && authData.access_token) {
            // Set the session in Supabase client so it can make authenticated requests
            await supabase.auth.setSession({
              access_token: authData.access_token,
              refresh_token: authData.refresh_token
            });
            
            setUser(authData.user);
            setSession({
              access_token: authData.access_token,
              refresh_token: authData.refresh_token,
              expires_at: authData.expires_at,
              user: authData.user
            } as Session);
            checkUserRoles(authData.user.id);
            return;
          }
        }
      } catch (error) {
        console.error('Error reading stored session:', error);
      }
      setLoading(false);
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer role checking with setTimeout
        if (session?.user) {
          setTimeout(() => {
            checkUserRoles(session.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
          setIsOverseer(false);
        }
      }
    );

    // Check for stored session first
    checkStoredSession();
    
    // Also check Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          checkUserRoles(session.user.id);
        }
      }
    });

    // Listen for storage changes (from login)
    const handleStorageChange = () => {
      checkStoredSession();
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const checkUserRoles = async (userId: string) => {
    try {
      // Get the auth token from localStorage
      const storedAuth = localStorage.getItem('supabase.auth.token');
      if (!storedAuth) {
        setIsAdmin(false);
        setIsOverseer(false);
        setLoading(false);
        return;
      }
      
      const authData = JSON.parse(storedAuth);
      const token = authData.access_token;
      
      const SUPABASE_URL = "https://woosegomxvbgzelyqvoj.supabase.co";
      const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvb3NlZ29teHZiZ3plbHlxdm9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2Nzg3OTAsImV4cCI6MjA3NDI1NDc5MH0.htpKQLRZjqwochLN7MBVI8tA5F-AAwktDd5SLq6vUSc";
      
      const response = await fetch(`${SUPABASE_URL}/functions/v1/check-user-roles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsAdmin(data.isAdmin || false);
        setIsOverseer(data.isOverseer || false);
      } else {
        setIsAdmin(false);
        setIsOverseer(false);
      }
    } catch (error) {
      console.error('Error checking user roles:', error);
      setIsAdmin(false);
      setIsOverseer(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, isOverseer, loading }}>
      {children}
    </AuthContext.Provider>
  );
};