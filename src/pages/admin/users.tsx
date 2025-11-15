import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserTable } from '@/components/admin/users/UserTable';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types';
import { Loader2 } from 'lucide-react';

const AdminUsersPage: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin' });
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) {
        toast.error(error.message);
      } else {
        setUsers(data as Profile[]);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('manage_users')}</CardTitle>
        <CardDescription>View, edit, and manage all users on the platform.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
        ) : (
          <UserTable users={users} />
        )}
      </CardContent>
    </Card>
  );
};

export default AdminUsersPage;
