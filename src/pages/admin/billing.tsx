import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SubscriptionPlans } from '@/components/admin/billing/SubscriptionPlans';
import { Plan } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { EditPlanModal } from '@/components/admin/billing/EditPlanModal';
import { faker } from '@faker-js/faker';

const initialPlans: Plan[] = [
  { id: 'free', name: 'Free', price: '$0/month', description: 'For individuals starting out.', features: ['10 generations/mo', '1 brand voice'] },
  { id: 'pro', name: 'Pro', price: '$29/month', description: 'For professionals and small teams.', features: ['100 generations/mo', '5 brand voices', 'Priority support'] },
  { id: 'enterprise', name: 'Enterprise', price: 'Custom', description: 'For large organizations.', features: ['Unlimited everything', 'Dedicated AI model', '24/7 support'] },
];

const AdminBillingPage: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin' });
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSavePlan = (planToSave: Plan) => {
    if (planToSave.id) {
      // Update existing plan
      setPlans(plans.map(p => p.id === planToSave.id ? planToSave : p));
      console.log('Updated plan:', planToSave);
    } else {
      // Add new plan
      const newPlan = { ...planToSave, id: faker.string.uuid() };
      setPlans([...plans, newPlan]);
      console.log('Added new plan:', newPlan);
    }
    setIsModalOpen(false);
    setEditingPlan(null);
  };

  const handleDeletePlan = (planId: string) => {
    setPlans(plans.filter(p => p.id !== planId));
    console.log('Deleted plan ID:', planId);
  };

  const handleOpenModal = (plan: Plan | null) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t('manage_billing')}</CardTitle>
            <CardDescription>Configure subscription plans and pricing.</CardDescription>
          </div>
          <Button onClick={() => handleOpenModal(null)}>
            <Plus className="mr-2 h-4 w-4" /> {t('add_plan')}
          </Button>
        </CardHeader>
        <CardContent>
          <SubscriptionPlans 
            plans={plans} 
            onEdit={(plan) => handleOpenModal(plan)}
            onDelete={handleDeletePlan}
          />
        </CardContent>
      </Card>
      {isModalOpen && (
        <EditPlanModal
          plan={editingPlan}
          onSave={handleSavePlan}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default AdminBillingPage;
