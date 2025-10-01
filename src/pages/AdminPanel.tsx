import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EventManagement from '@/components/EventManagement';
import AnnouncementManagement from '@/components/AnnouncementManagement';
import UserManagement from '@/components/UserManagement';
import StatsManagement from '@/components/StatsManagement';

const AdminPanel = () => {
  const { user, isAdmin, isOverseer, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && (!user || (!isAdmin && !isOverseer))) {
      toast({
        title: "Access Denied",
        description: "You need admin privileges to access this page.",
        variant: "destructive"
      });
      navigate('/admins');
    }
  }, [user, isAdmin, isOverseer, loading, navigate, toast]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully."
    });
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || (!isAdmin && !isOverseer)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-primary truncate">Admin Dashboard</h1>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">
              Welcome, {user.email} ({isOverseer ? 'Overseer' : 'Admin'})
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut} size="sm" className="shrink-0">
            <LogOut className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1">
            <TabsTrigger value="stats" className="text-xs sm:text-sm">Statistics</TabsTrigger>
            <TabsTrigger value="events" className="text-xs sm:text-sm">Events</TabsTrigger>
            <TabsTrigger value="announcements" className="text-xs sm:text-sm">Announcements</TabsTrigger>
            {isOverseer && <TabsTrigger value="users" className="text-xs sm:text-sm">Users</TabsTrigger>}
          </TabsList>

          <TabsContent value="stats" className="mt-6">
            <StatsManagement />
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <EventManagement />
          </TabsContent>

          <TabsContent value="announcements" className="mt-6">
            <AnnouncementManagement />
          </TabsContent>

          {isOverseer && (
            <TabsContent value="users" className="mt-6">
              <UserManagement />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPanel;