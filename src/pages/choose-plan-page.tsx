import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Plan } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Loader2, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export function ChoosePlanPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      const { data, error } = await supabase.from('plans').select('*').order('price');
      if (error) {
        toast.error('Failed to load plans');
        console.error(error);
      } else {
        setPlans(data || []);
      }
      setLoading(false);
    };
    fetchPlans();
  }, []);

  const handleSelectPlan = (plan: Plan) => {
    localStorage.setItem('selectedPlanId', plan.id);
    navigate('/signup');
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Choose Your Plan</h1>
        <p className="mt-4 text-lg text-muted-foreground">Select the perfect package to get started.</p>
      </div>
      
      {plans.length === 0 ? (
         <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg">
            <AlertTriangle className="h-10 w-10 text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold">No Plans Found</h3>
            <p className="text-muted-foreground mt-2 text-center max-w-md">
                It looks like the plans table is empty. Please run the seed SQL script in your Supabase dashboard to populate the default plans.
            </p>
         </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {plans.map((plan) => (
            <Card key={plan.id} className="flex flex-col hover:border-primary transition-colors shadow-sm hover:shadow-md">
                <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                <div className="text-3xl font-bold mb-6">
                    ${plan.price}
                    <span className="text-sm font-normal text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3">
                    {plan.features?.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                        {feature}
                    </li>
                    ))}
                </ul>
                </CardContent>
                <CardFooter>
                <Button className="w-full" onClick={() => handleSelectPlan(plan)}>
                    Select This Plan
                </Button>
                </CardFooter>
            </Card>
            ))}
        </div>
      )}
    </div>
  );
}
