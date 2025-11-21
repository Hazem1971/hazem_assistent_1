import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import { Plan } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CreditCard, ShieldCheck, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export function PaymentPage() {
  const { user, loading: authLoading, updateLocalSession } = useAuth();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlanDetails = async () => {
      const planId = localStorage.getItem('selectedPlanId');
      
      // If no plan in local storage, try to get from user profile if logged in
      let targetPlanId = planId;
      
      if (!targetPlanId && user?.plan_id) {
        targetPlanId = user.plan_id;
      }

      if (!targetPlanId) {
        if (!authLoading) {
            toast.error("No plan selected. Please choose a plan.");
            navigate('/choose-plan');
        }
        return;
      }

      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('id', targetPlanId)
        .single();

      if (error) {
        console.error("Error fetching plan:", error);
        toast.error("Failed to load plan details.");
      } else {
        setPlan(data);
      }
      setLoading(false);
    };

    if (!authLoading) {
      fetchPlanDetails();
    }
  }, [user, authLoading, navigate]);

  const handleTestPayment = async () => {
    if (!user) {
        toast.error("You must be logged in to pay.");
        return;
    }
    if (!plan) return;
    
    setProcessing(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const isLocalUser = user.app_metadata?.provider === 'local';

      if (isLocalUser) {
        // --- LOCAL USER PATH (Rate Limit Bypass) ---
        updateLocalSession({
          subscription_status: 'active',
          plan_id: plan.id,
          subscription_plan: plan.name,
          payment_date: new Date().toISOString()
        });
        
        toast.success(`Payment successful (Test Mode)! You are now on the ${plan.name} plan.`);
      } else {
        // --- REAL USER PATH ---
        const { error } = await supabase
          .from('profiles')
          .update({
            subscription_status: 'active',
            plan_id: plan.id,
            subscription_plan: plan.name,
            payment_date: new Date().toISOString()
          })
          .eq('id', user.id);

        if (error) throw error;
        toast.success(`Payment successful! You are now on the ${plan.name} plan.`);
      }

      // Clear local storage
      localStorage.removeItem('selectedPlanId');
      navigate('/dashboard');

    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error.message || "Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
      return (
        <div className="container mx-auto py-20 px-4 flex justify-center items-center min-h-screen">
            <Card className="w-full max-w-md border-destructive/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-6 w-6" />
                        Authentication Required
                    </CardTitle>
                    <CardDescription>
                        We could not find your active session.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>If you just signed up, please check if <strong>Email Confirmation</strong> is enabled in your Supabase project settings. You may need to verify your email before logging in.</p>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={() => navigate('/login')}>Go to Login</Button>
                </CardFooter>
            </Card>
        </div>
      )
  }

  if (!plan) return null;

  return (
    <div className="container mx-auto py-20 px-4 flex justify-center items-center min-h-screen bg-muted/20">
      <Card className="w-full max-w-md border-2 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-6 w-6" />
            Complete Payment
          </CardTitle>
          <CardDescription>Subscribe to <strong>{plan.name}</strong></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center p-4 bg-secondary/50 rounded-lg border">
            <span className="font-medium">Total Due Today:</span>
            <span className="text-3xl font-bold text-primary">${plan.price}</span>
          </div>
          
          <div className="space-y-3 p-4 border rounded-md bg-background">
            <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Plan:</span>
                <span className="font-medium">{plan.name}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Billing Cycle:</span>
                <span className="font-medium">Monthly</span>
            </div>
            <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">User:</span>
                <span className="font-medium truncate max-w-[200px]">{user.email}</span>
            </div>
          </div>
          
          <div className="text-xs text-center text-muted-foreground bg-muted p-2 rounded">
            Test Mode Enabled: No real charge will be made.
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button 
            className="w-full font-bold" 
            size="lg" 
            onClick={handleTestPayment} 
            disabled={processing}
          >
            {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
            Confirm Payment
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/choose-plan')}>
            Change Plan
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
