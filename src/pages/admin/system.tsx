import React from 'react';
import { useTranslation } from 'react-i18next';
import { SettingsPanel } from '@/components/admin/system/SettingsPanel';

const AdminSystemPage: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin' });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{t('manage_system')}</h1>
      <SettingsPanel />
    </div>
  );
};

export default AdminSystemPage;
