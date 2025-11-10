import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { HeroContent } from '@/types';

interface HeroEditorProps {
  content: HeroContent;
  onSave: (data: HeroContent) => void;
}

export const HeroEditor: React.FC<HeroEditorProps> = ({ content, onSave }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin' });
  const { register, handleSubmit } = useForm<HeroContent>({ defaultValues: content });

  return (
    <Card>
      <form onSubmit={handleSubmit(onSave)}>
        <CardHeader>
          <CardTitle>{t('edit_hero_section')}</CardTitle>
          <CardDescription>Update the main title and subtitle on the homepage.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hero-title">{t('hero_title')}</Label>
            <Input id="hero-title" {...register('title')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-subtitle">{t('hero_subtitle')}</Label>
            <Textarea id="hero-subtitle" {...register('subtitle')} />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">{t('save_changes')}</Button>
        </CardFooter>
      </form>
    </Card>
  );
};
