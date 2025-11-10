import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserTable } from '@/components/admin/users/UserTable';

const AdminUsersPage: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin' });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('manage_users')}</CardTitle>
        <CardDescription>View, edit, and manage all users on the platform.</CardDescription>
      </CardHeader>
      <CardContent>
        <UserTable />
      </CardContent>
    </Card>
  );
};

export default AdminUsersPage;
