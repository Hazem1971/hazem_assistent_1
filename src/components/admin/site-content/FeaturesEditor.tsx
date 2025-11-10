import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FeatureContent } from '@/types';

interface FeaturesEditorProps {
  features: FeatureContent[];
  onSaveFeature: (data: FeatureContent) => void;
}

const FeatureForm: React.FC<{ feature: FeatureContent; onSave: (data: FeatureContent) => void }> = ({ feature, onSave }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin' });
  const { register, handleSubmit } = useForm<FeatureContent>({ defaultValues: feature });

  return (
    <form onSubmit={handleSubmit(onSave)} className="p-4 border rounded-lg space-y-4">
        <div className="space-y-2">
            <Label htmlFor={`feature-title-${feature.id}`}>{t('feature_title')}</Label>
            <Input id={`feature-title-${feature.id}`} {...register('title')} />
        </div>
        <div className="space-y-2">
            <Label htmlFor={`feature-desc-${feature.id}`}>{t('feature_description')}</Label>
            <Textarea id={`feature-desc-${feature.id}`} {...register('description')} />
        </div>
        <Button type="submit" size="sm">{t('save_changes')}</Button>
    </form>
  );
};

export const FeaturesEditor: React.FC<FeaturesEditorProps> = ({ features, onSaveFeature }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin' });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('edit_features_section')}</CardTitle>
        <CardDescription>Update the feature descriptions on the homepage.</CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6">
        {features.map(feature => (
          <FeatureForm key={feature.id} feature={feature} onSave={onSaveFeature} />
        ))}
      </CardContent>
    </Card>
  );
};
