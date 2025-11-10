import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

export const SettingsPanel: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin' });

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('feature_flags')}</CardTitle>
          <CardDescription>Enable or disable features across the platform.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="new-user-onboarding">New User Onboarding Wizard</Label>
            <Switch id="new-user-onboarding" defaultChecked />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="video-script-generation">Video Script Generation</Label>
            <Switch id="video-script-generation" defaultChecked />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t('maintenance_mode')}</CardTitle>
          <CardDescription>
            Put the platform in maintenance mode to perform updates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="maintenance-mode">{t('enable_maintenance')}</Label>
              <p className="text-sm text-muted-foreground">
                This will make the site temporarily unavailable to users.
              </p>
            </div>
            <Switch id="maintenance-mode" />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
};
