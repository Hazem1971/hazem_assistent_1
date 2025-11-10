import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plan } from '@/types';
import { X, Plus } from 'lucide-react';

interface EditPlanModalProps {
  plan: Plan;
  onSave: (plan: Plan) => void;
  onClose: () => void;
}

export const EditPlanModal: React.FC<EditPlanModalProps> = ({ plan, onSave, onClose }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin' });
  const { register, control, handleSubmit, formState: { errors } } = useForm<Plan>({
    defaultValues: plan,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'features',
  });

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{t('edit_plan')}: {plan.name}</DialogTitle>
          <DialogDescription>
            Modify the details of this subscription plan.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSave)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">{t('plan_name')}</Label>
              <Input id="name" {...register('name')} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">{t('price')}</Label>
              <Input id="price" {...register('price')} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">{t('plan_description')}</Label>
              <Input id="description" {...register('description')} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right mt-2">{t('plan_features')}</Label>
              <div className="col-span-3 space-y-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <Input {...register(`features.${index}`)} />
                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => append('')}>
                  <Plus className="mr-2 h-4 w-4" /> {t('add_feature')}
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{t('save_changes')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
