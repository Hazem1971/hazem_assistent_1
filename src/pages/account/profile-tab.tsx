import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BrandVoices } from './brand-voices';

export const ProfileTab: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'account' });
  const { user } = useAuth();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      fullName: 'Youssef Hassan',
      email: user?.email,
      company: 'Burger Shop',
    },
  });
  
  const { register: registerPassword, handleSubmit: handleSubmitPassword } = useForm();

  const onProfileSubmit = (data: any) => {
    console.log('Profile update:', data);
    // Placeholder for API call
  };
  
  const onPasswordSubmit = (data: any) => {
    console.log('Password change:', data);
    // Placeholder for API call
  };

  return (
    <div className="grid gap-6">
      <Card>
        <form onSubmit={handleSubmit(onProfileSubmit)}>
          <CardHeader>
            <CardTitle>{t('profile')}</CardTitle>
            <CardDescription>This is how others will see you on the site.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={`https://avatar.vercel.sh/${user?.email}.png`} />
                <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <Button type="button" variant="outline">Change Photo</Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">{t('full_name')}</Label>
              <Input id="fullName" {...register('fullName')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input id="email" type="email" {...register('email')} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">{t('company')}</Label>
              <Input id="company" {...register('company')} />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">{t('update_profile')}</Button>
          </CardFooter>
        </form>
      </Card>

      <BrandVoices />

      <Card>
        <form onSubmit={handleSubmitPassword(onPasswordSubmit)}>
          <CardHeader>
            <CardTitle>{t('password')}</CardTitle>
            <CardDescription>Change your password here. After saving, you'll be logged out.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">{t('current_password')}</Label>
              <Input id="currentPassword" type="password" {...registerPassword('currentPassword')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">{t('new_password')}</Label>
              <Input id="newPassword" type="password" {...registerPassword('newPassword')} />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">{t('change_password')}</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
