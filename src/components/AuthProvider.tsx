import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// Assuming @supabase/supabase-js is available in the environment
interface User {
  id: string;
  email: string | undefined;
  // Add other necessary User properties from Supabase here
}

interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: User;
}

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

// Correctly exported custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Correctly exported provider component
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
        // NOTE: Using localStorage is required for this specific Netlify/Supabase integration pattern
        const storedAuth = localStorage.getItem('supabase.auth.token');
        if (storedAuth) {
          const authData = JSON.parse(storedAuth);
          if (authData.user && authData.access_token) {
            setUser(authData.user);
            // Mocking Session type based on stored data
            const sessionData: Session = {
              access_token: authData.access_token,
              refresh_token: authData.refresh_token,
              expires_at: authData.expires_at,
              user: authData.user as User,
            };
            setSession(sessionData);
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

    // Listen for storage changes (from login/logout)
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
      // Get access token from localStorage
      const storedAuth = localStorage.getItem('supabase.auth.token');
      let accessToken = '';
      
      if (storedAuth) {
        const authData = JSON.parse(storedAuth);
        accessToken = authData.access_token;
      }
      
      // Call Netlify function to check roles (server-side)
      // This is the function that needs to be implemented to properly check roles in Supabase
      const response = await fetch('/.netlify/functions/check-user-roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Optionally send Authorization header here too, although the token is in the body for this specific check
        },
        body: JSON.stringify({ userId, accessToken })
      });
      
      const data = await response.json();
      
      if (data.roles && Array.isArray(data.roles)) {
        // Assuming the server returns an array of objects like [{ role: 'admin' }, ...]
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
