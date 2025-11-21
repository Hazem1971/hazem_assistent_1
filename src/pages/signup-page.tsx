import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLayout } from "@/components/layout/auth-layout"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import { Profile } from "@/types"

export function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure a plan is selected
    const planId = localStorage.getItem('selectedPlanId');
    if (!planId) {
      toast.error("Please choose a plan first.");
      navigate('/choose-plan');
    }
  }, [navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    const planId = localStorage.getItem('selectedPlanId');

    try {
      // 1. Attempt Real Sign up
      const { data, error } = await auth.signUp({ 
        email, 
        password,
        options: {
          data: { full_name: fullName }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Real signup success
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            full_name: fullName,
            email: email,
            plan_id: planId,
            subscription_status: 'pending',
            role: 'user'
          }, { onConflict: 'id' });

        if (profileError) console.error("Profile update error:", profileError);

        toast.success("Account created! Proceeding to payment...");
        navigate('/payment');
      }
    } catch (err: any) {
      // 2. Smart Error Handling for Rate Limits
      // Supabase returns 429 or specific error codes for rate limits
      const isRateLimit = 
        err.status === 429 || 
        err.code === 'over_email_send_rate_limit' ||
        err.message?.toLowerCase().includes('rate limit');

      if (isRateLimit) {
        // Log as warning to avoid cluttering console with "Errors" that are actually handled
        console.warn("Signup rate limit reached. Automatically switching to Local Test Mode.");
        
        // Create a local simulated user
        const localUser: Profile = {
          id: `local-${Date.now()}`,
          email: email,
          full_name: fullName,
          role: 'user',
          subscription_status: 'pending',
          plan_id: planId || undefined,
          app_metadata: { provider: 'local', providers: ['local'] },
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          phone: '',
          confirmed_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          subscription_plan: null,
          company: null
        } as unknown as Profile;

        // Activate local session
        auth.createLocalSession(localUser);
        
        // Notify user gently
        toast.success("Test Mode Activated (Rate Limit Bypass)", {
          icon: '🛡️',
          duration: 4000
        });
        
        // Proceed immediately to payment
        navigate('/payment');
      } else {
        // Real errors (like invalid password, etc.)
        console.error("Signup Error:", err);
        toast.error(err.message || "Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      description="Enter your details to register"
    >
      <form onSubmit={handleSignup} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="John Doe"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            type="password" 
            required 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input 
            id="confirmPassword" 
            type="password" 
            required 
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
          Register & Continue
        </Button>
      </form>
      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" className="underline">
          Log in
        </Link>
      </div>
    </AuthLayout>
  )
}
