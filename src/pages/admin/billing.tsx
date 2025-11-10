import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SubscriptionPlans } from '@/components/admin/billing/SubscriptionPlans';
import { Plan } from '@/types';

const initialPlans: Plan[] = [
  { id: 'free', name: 'Free', price: '$0/month', description: 'For individuals starting out.', features: ['10 generations/mo', '1 brand voice'] },
  { id: 'pro', name: 'Pro', price: '$29/month', description: 'For professionals and small teams.', features: ['100 generations/mo', '5 brand voices', 'Priority support'] },
  { id: 'enterprise', name: 'Enterprise', price: 'Custom', description: 'For large organizations.', features: ['Unlimited everything', 'Dedicated AI model', '24/7 support'] },
];

const AdminBillingPage: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin' });
  const [plans, setPlans] = useState<Plan[]>(initialPlans);

  const handleUpdatePlan = (updatedPlan: Plan) => {
    setPlans(plans.map(p => p.id === updatedPlan.id ? updatedPlan : p));
    // In a real app, you'd also make an API call to save this to the database
    console.log('Updated plan:', updatedPlan);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('manage_billing')}</CardTitle>
        <CardDescription>Configure subscription plans and pricing.</CardDescription>
      </CardHeader>
      <CardContent>
        <SubscriptionPlans plans={plans} onUpdatePlan={handleUpdatePlan} />
      </CardContent>
    </Card>
  );
};

export default AdminBillingPage;
