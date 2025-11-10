import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ModelManager } from '@/components/admin/ai/ModelManager';

const AdminAiSettingsPage: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin' });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('manage_ai')}</CardTitle>
        <CardDescription>Manage AI providers, API keys, and model configurations.</CardDescription>
      </CardHeader>
      <CardContent>
        <ModelManager />
      </CardContent>
    </Card>
  );
};

export default AdminAiSettingsPage;
