import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockVoices = [
  { name: 'Burger Shop', tone: 'Humorous, Engaging' },
  { name: 'Personal Brand', tone: 'Inspirational, Professional' },
];

export const BrandVoices: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'account' });
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{t('brand_voices')}</CardTitle>
          <CardDescription>Manage your saved brand voice profiles.</CardDescription>
        </div>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          <Plus className="mr-2 h-4 w-4" />
          {t('add_voice')}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockVoices.map((voice) => (
          <div key={voice.name} className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-semibold">{voice.name}</p>
              <p className="text-sm text-muted-foreground">{voice.tone}</p>
            </div>
            <Button variant="ghost" size="sm">Edit</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
