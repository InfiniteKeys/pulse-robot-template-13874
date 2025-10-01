import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Shield, UserCog } from 'lucide-react';

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  email: string | null;
}

interface UserWithRole extends UserProfile {
  isAdmin: boolean;
  isOverseer: boolean;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      const usersWithRoles: UserWithRole[] = (profiles || []).map(profile => {
        const userRoles = roles?.filter(r => r.user_id === profile.user_id) || [];
        return {
          ...profile,
          isAdmin: userRoles.some(r => r.role === 'admin'),
          isOverseer: userRoles.some(r => r.role === 'overseer')
        };
      });

      setUsers(usersWithRoles);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, role: 'admin' | 'overseer', action: 'add' | 'remove') => {
    try {
      if (action === 'add') {
        const { error } = await supabase
          .from('user_roles')
          .insert([{ user_id: userId, role }]);

        if (error) throw error;
        toast({
          title: "Role Added",
          description: `${role} role has been added successfully.`
        });
      } else {
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', role);

        if (error) throw error;
        toast({
          title: "Role Removed",
          description: `${role} role has been removed successfully.`
        });
      }

      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage user roles and permissions (Overseer only)</CardDescription>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4">
            <Badge variant="outline" className="flex items-center gap-1 justify-center sm:justify-start">
              <Shield className="h-3 w-3" />
              Overseer: Can manage all roles
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1 justify-center sm:justify-start">
              <UserCog className="h-3 w-3" />
              Admin: Can manage content
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No users found</p>
            ) : (
              users.map((user) => (
                <Card key={user.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1 flex-1 min-w-0">
                        <p className="font-medium break-words">{user.display_name || 'Unnamed User'}</p>
                        <p className="text-sm text-muted-foreground break-all">{user.email || user.user_id}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {user.isOverseer && (
                            <Badge variant="default">
                              <Shield className="h-3 w-3 mr-1" />
                              Overseer
                            </Badge>
                          )}
                          {user.isAdmin && (
                            <Badge variant="secondary">
                              <UserCog className="h-3 w-3 mr-1" />
                              Admin
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Select
                          onValueChange={(value) => {
                            if (value === 'add-admin') {
                              updateUserRole(user.user_id, 'admin', 'add');
                            } else if (value === 'remove-admin') {
                              updateUserRole(user.user_id, 'admin', 'remove');
                            } else if (value === 'add-overseer') {
                              updateUserRole(user.user_id, 'overseer', 'add');
                            } else if (value === 'remove-overseer') {
                              updateUserRole(user.user_id, 'overseer', 'remove');
                            }
                          }}
                        >
                          <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Manage Roles" />
                          </SelectTrigger>
                          <SelectContent>
                            {!user.isAdmin && (
                              <SelectItem value="add-admin">Add Admin Role</SelectItem>
                            )}
                            {user.isAdmin && (
                              <SelectItem value="remove-admin">Remove Admin Role</SelectItem>
                            )}
                            {!user.isOverseer && (
                              <SelectItem value="add-overseer">Add Overseer Role</SelectItem>
                            )}
                            {user.isOverseer && (
                              <SelectItem value="remove-overseer">Remove Overseer Role</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;