import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BrandVoices } from './brand-voices';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export const ProfileTab: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'account' });
  const { user, loading: authLoading } = useAuth();

  const { register, handleSubmit, reset, formState: { isSubmitting: isProfileSubmitting } } = useForm({
    defaultValues: {
      full_name: '',
      company: '',
    },
  });
  
  const { register: registerPassword, handleSubmit: handleSubmitPassword, formState: { isSubmitting: isPasswordSubmitting }, reset: resetPassword } = useForm();

  useEffect(() => {
    if (user) {
      reset({
        full_name: user.full_name || '',
        company: user.company || '',
      });
    }
  }, [user, reset]);

  const onProfileSubmit = async (data: { full_name: string; company: string }) => {
    if (!user) return;
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: data.full_name, company: data.company })
      .eq('id', user.id);
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Profile updated successfully!');
    }
  };
  
  const onPasswordSubmit = async (data: any) => {
    const { error } = await supabase.auth.updateUser({ password: data.newPassword });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Password updated successfully! You will be logged out.');
      resetPassword();
      setTimeout(() => {
        supabase.auth.signOut();
      }, 2000);
    }
  };

  if (authLoading) {
    return <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

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
              <Input id="fullName" {...register('full_name')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input id="email" type="email" value={user?.email || ''} readOnly disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">{t('company')}</Label>
              <Input id="company" {...register('company')} />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isProfileSubmitting}>
              {isProfileSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('update_profile')}
            </Button>
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
            {/* Current password field is omitted for simplicity as it requires extra logic */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">{t('new_password')}</Label>
              <Input id="newPassword" type="password" {...registerPassword('newPassword', { required: true })} />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPasswordSubmitting}>
              {isPasswordSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('change_password')}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
