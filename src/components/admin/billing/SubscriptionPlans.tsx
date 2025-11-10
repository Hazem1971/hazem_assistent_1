import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const plans = [
  { name: 'Free', price: '$0/month', features: '10 generations/mo' },
  { name: 'Pro', price: '$29/month', features: '100 generations/mo, 5 brands' },
  { name: 'Enterprise', price: 'Custom', features: 'Unlimited everything' },
];

export const SubscriptionPlans: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin' });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('plan_name')}</TableHead>
            <TableHead>{t('price')}</TableHead>
            <TableHead>{t('features')}</TableHead>
            <TableHead className="text-right">{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans.map((plan) => (
            <TableRow key={plan.name}>
              <TableCell className="font-medium">{plan.name}</TableCell>
              <TableCell>{plan.price}</TableCell>
              <TableCell>{plan.features}</TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm">Edit</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
