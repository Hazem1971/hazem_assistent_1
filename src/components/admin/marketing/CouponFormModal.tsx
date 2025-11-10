import React from 'react';
import { useForm, Controller } from 'react-hook-form';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Coupon } from '@/types';

interface CouponFormModalProps {
  coupon: Coupon | null;
  onSave: (coupon: Coupon) => void;
  onClose: () => void;
}

export const CouponFormModal: React.FC<CouponFormModalProps> = ({ coupon, onSave, onClose }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin' });
  const isEditing = !!coupon;
  const { register, control, handleSubmit } = useForm<Coupon>({
    defaultValues: coupon || { discountType: 'percentage' },
  });

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? t('edit_coupon') : t('create_coupon')}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the details of this coupon.' : 'Create a new coupon for promotions.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSave)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">{t('coupon_code')}</Label>
              <Input id="code" {...register('code')} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="discountType" className="text-right">{t('discount_type')}</Label>
              <Controller
                name="discountType"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select discount type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">{t('percentage')}</SelectItem>
                      <SelectItem value="fixed">{t('fixed_amount')}</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="discountValue" className="text-right">{t('discount_value')}</Label>
              <Input id="discountValue" type="number" {...register('discountValue', { valueAsNumber: true })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expiresAt" className="text-right">{t('expires_at')}</Label>
              <Input id="expiresAt" type="date" {...register('expiresAt')} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="usageLimit" className="text-right">{t('usage')}</Label>
              <Input id="usageLimit" type="number" placeholder="Unlimited" {...register('usageLimit', { valueAsNumber: true })} className="col-span-3" />
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
