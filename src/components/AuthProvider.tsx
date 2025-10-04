import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';

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

    // Check for stored session on mount
    checkStoredSession();

    // Listen for storage changes (from login)
    const handleStorageChange = () => {
      checkStoredSession();
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const checkUserRoles = async (userId: string) => {
    try {
      // Small delay to ensure auth is fully established
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Get access token from localStorage
      const storedAuth = localStorage.getItem('supabase.auth.token');
      let accessToken = '';
      
      if (storedAuth) {
        const authData = JSON.parse(storedAuth);
        accessToken = authData.access_token;
      }
      
      if (!accessToken) {
        console.warn('No access token available for role check');
        setLoading(false);
        return;
      }
      
      // Call Netlify function to check roles (server-side)
      const response = await fetch('/.netlify/functions/check-user-roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, accessToken })
      });
      
      if (!response.ok) {
        console.warn('Role check failed:', response.status);
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      
      if (data.roles && Array.isArray(data.roles)) {
        const roleNames = data.roles.map((r: { role: string }) => r.role);
        setIsAdmin(roleNames.includes('admin'));
        setIsOverseer(roleNames.includes('overseer'));
      }
    } catch (error) {
      console.error('Error checking user roles:', error);
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