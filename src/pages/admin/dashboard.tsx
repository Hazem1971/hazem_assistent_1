import React from 'react';
import { useTranslation } from 'react-i18next';
import { OverviewCards } from '@/components/admin/dashboard/OverviewCards';
import { MetricsCharts } from '@/components/admin/dashboard/MetricsCharts';

const AdminDashboardPage: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin' });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{t('overview')}</h1>
      <OverviewCards />
      <MetricsCharts />
    </div>
  );
};

export default AdminDashboardPage;
