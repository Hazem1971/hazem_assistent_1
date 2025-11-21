import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CouponsManager } from '@/components/admin/marketing/CouponsManager';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const AdminMarketingPage: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin' });
  // Force re-render to refresh coupons
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{t('marketing')}</h1>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t('manage_coupons')}</CardTitle>
            <CardDescription>Create and manage discount codes for special offers.</CardDescription>
          </div>
          <Button variant="outline" size="icon" onClick={handleRefresh}>
             <RefreshCw className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <CouponsManager key={refreshKey} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMarketingPage;
