import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserTable } from '@/components/admin/users/UserTable';
import { EditUserModal } from '@/components/admin/users/EditUserModal';
import { ViewUserModal } from '@/components/admin/users/ViewUserModal';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminUsersPage: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin' });
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [viewUser, setViewUser] = useState<Profile | null>(null);
  const [editUser, setEditUser] = useState<Profile | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (error) {
      toast.error(error.message);
    } else {
      setUsers(data as Profile[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateUser = async (updates: Partial<Profile>) => {
    if (!editUser) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', editUser.id);

      if (error) throw error;

      toast.success('User updated successfully');
      // Update local state
      setUsers(users.map(u => u.id === editUser.id ? { ...u, ...updates } : u));
    } catch (error: any) {
      toast.error(`Failed to update: ${error.message}`);
    }
  };

  const handleDeleteUser = async (user: Profile) => {
    if (!window.confirm(`Are you sure you want to delete ${user.full_name || user.email}? This action cannot be undone.`)) {
      return;
    }

    try {
      // Note: This deletes from public.profiles. 
      // To delete from auth.users, you typically need a backend function with service_role key.
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (error) throw error;

      toast.success('User profile deleted');
      setUsers(users.filter(u => u.id !== user.id));
    } catch (error: any) {
      toast.error(`Failed to delete: ${error.message}`);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t('manage_users')}</CardTitle>
            <CardDescription>View, edit, and manage all users on the platform.</CardDescription>
          </div>
          <Button variant="outline" size="icon" onClick={fetchUsers} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : (
            <UserTable 
              users={users} 
              onView={setViewUser}
              onEdit={setEditUser}
              onDelete={handleDeleteUser}
            />
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {viewUser && (
        <ViewUserModal 
          user={viewUser} 
          onClose={() => setViewUser(null)} 
        />
      )}

      {editUser && (
        <EditUserModal 
          user={editUser} 
          onClose={() => setEditUser(null)} 
          onSave={handleUpdateUser}
        />
      )}
    </>
  );
};

export default AdminUsersPage;
