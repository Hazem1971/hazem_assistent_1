import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ContentTable } from '@/components/admin/content/ContentTable';

const AdminContentPage: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin' });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('manage_content')}</CardTitle>
        <CardDescription>View, moderate, and manage all user-generated content.</CardDescription>
      </CardHeader>
      <CardContent>
        <ContentTable />
      </CardContent>
    </Card>
  );
};

export default AdminContentPage;
