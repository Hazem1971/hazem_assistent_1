import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CouponsManager } from '@/components/admin/marketing/CouponsManager';

const AdminMarketingPage: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin' });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{t('marketing')}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t('manage_coupons')}</CardTitle>
          <CardDescription>Create and manage discount codes for special offers.</CardDescription>
        </CardHeader>
        <CardContent>
          <CouponsManager />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMarketingPage;
