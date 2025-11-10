import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SubscriptionPlans } from '@/components/admin/billing/SubscriptionPlans';

const AdminBillingPage: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin' });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('manage_billing')}</CardTitle>
        <CardDescription>Configure subscription plans and pricing.</CardDescription>
      </CardHeader>
      <CardContent>
        <SubscriptionPlans />
      </CardContent>
    </Card>
  );
};

export default AdminBillingPage;
