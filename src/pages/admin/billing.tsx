import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SubscriptionPlans } from '@/components/admin/billing/SubscriptionPlans';
import { Plan } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, RefreshCw } from 'lucide-react';
import { EditPlanModal } from '@/components/admin/billing/EditPlanModal';
import { supabase } from '@/lib/supabase';

const AdminBillingPage: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin' });
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPlans = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('plans').select('*').order('created_at');
    if (error) {
      toast.error(error.message);
    } else {
      setPlans(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSavePlan = async (planToSave: Plan) => {
    if (planToSave.id) {
      // Update existing plan
      const { data, error } = await supabase
        .from('plans')
        .update({ ...planToSave, id: undefined, created_at: undefined }) 
        .eq('id', planToSave.id)
        .select()
        .single();
      
      if (error) {
        toast.error(error.message);
      } else {
        setPlans(plans.map(p => p.id === data.id ? data : p));
        toast.success('Plan updated successfully!');
      }
    } else {
      // Add new plan
      const { data, error } = await supabase
        .from('plans')
        .insert(planToSave)
        .select()
        .single();
        
      if (error) {
        toast.error(error.message);
      } else {
        setPlans([...plans, data]);
        toast.success('Plan created successfully!');
      }
    }
    setIsModalOpen(false);
    setEditingPlan(null);
  };

  const handleDeletePlan = async (planId: string) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      const { error } = await supabase.from('plans').delete().eq('id', planId);
      if (error) {
        toast.error(error.message);
      } else {
        setPlans(plans.filter(p => p.id !== planId));
        toast.success('Plan deleted successfully!');
      }
    }
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
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={fetchPlans} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button onClick={() => handleOpenModal(null)}>
                <Plus className="mr-2 h-4 w-4" /> {t('add_plan')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : (
            <SubscriptionPlans 
              plans={plans} 
              onEdit={(plan) => handleOpenModal(plan)}
              onDelete={handleDeletePlan}
            />
          )}
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
