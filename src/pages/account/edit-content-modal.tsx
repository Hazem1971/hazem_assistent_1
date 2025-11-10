import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GeneratedContent, Platform } from '@/types';

interface EditContentModalProps {
  content: GeneratedContent | null;
  onSave: (content: GeneratedContent) => void;
  onClose: () => void;
}

export const EditContentModal: React.FC<EditContentModalProps> = ({ content, onSave, onClose }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'account' });
  const isEditing = !!content;
  const { register, control, handleSubmit } = useForm<GeneratedContent>({
    defaultValues: content || { platform: 'facebook', text: '' },
  });

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? t('edit_post') : t('create_post')}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Make changes to your saved post.' : 'Create a new post to save to your account.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSave)}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="platform">{t('platform')}</Label>
              <Controller
                name="platform"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="text">{t('content')}</Label>
              <Textarea id="text" {...register('text')} className="min-h-[150px]" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
