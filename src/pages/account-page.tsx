import React from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/layout/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileTab } from './account/profile-tab';
import { BillingTab } from './account/billing-tab';
import { SavedContentTab } from './account/saved-content-tab';
import { ApiKeysTab } from './account/api-keys-tab';

const AccountPage: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'account' });

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
            <p className="mt-1 text-muted-foreground">{t('description')}</p>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="profile">{t('profile')}</TabsTrigger>
              <TabsTrigger value="billing">{t('billing')}</TabsTrigger>
              <TabsTrigger value="saved_content">{t('saved_content')}</TabsTrigger>
              <TabsTrigger value="api_keys">{t('api_keys')}</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="mt-6">
              <ProfileTab />
            </TabsContent>
            <TabsContent value="billing" className="mt-6">
              <BillingTab />
            </TabsContent>
            <TabsContent value="saved_content" className="mt-6">
              <SavedContentTab />
            </TabsContent>
            <TabsContent value="api_keys" className="mt-6">
              <ApiKeysTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AccountPage;
