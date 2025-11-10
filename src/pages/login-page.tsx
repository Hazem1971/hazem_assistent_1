import React, { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import ReCAPTCHA from "react-google-recaptcha"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLayout } from "@/components/layout/auth-layout"
import { Loader2 } from "lucide-react"
import { GoogleIcon } from "@/components/ui/icons"
import { useAuth } from "@/hooks/use-auth"

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const from = location.state?.from?.pathname || "/dashboard";

  const recaptchaRef = React.createRef<ReCAPTCHA>();
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) {
      setError("Please complete the reCAPTCHA.");
      return;
    }
    setLoading(true);
    setError(null);

    // --- Placeholder for Supabase Auth ---
    // In a real app, you would call Supabase here.
    // const { error } = await supabase.auth.signInWithPassword({ email, password });
    // if (error) setError(error.message);
    // else navigate(from, { replace: true });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password) {
       auth.signIn(email); // Mock sign-in
       navigate(from, { replace: true });
    } else {
       setError("Invalid credentials. This is a demo.");
    }
    // --- End of Placeholder ---

    setLoading(false);
    recaptchaRef.current?.reset();
    setCaptchaToken(null);
  };

  const handleGoogleLogin = async () => {
    // --- Placeholder for Supabase Google Auth ---
    // const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    // if (error) setError(error.message);
    console.log("Simulating Google login. Connect Supabase to enable.");
    setError("Google login is a placeholder. Connect Supabase to enable.");
  };

  return (
    <AuthLayout
      title="Welcome Back"
      description="Enter your credentials to access your account"
    >
      <div className="grid gap-4">
        <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={loading}>
          {loading ? <Loader2 className="me-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="me-2 h-4 w-4" />}
          Login with Google
        </Button>
      </div>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <form onSubmit={handleLogin} className="grid gap-4">
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
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input 
            id="password" 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="grid gap-2">
            {siteKey ? (
                <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={siteKey}
                    onChange={setCaptchaToken}
                    theme="dark"
                />
            ) : (
                <p className="text-sm text-yellow-500">reCAPTCHA is not configured.</p>
            )}
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading || !captchaToken}>
          {loading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
          Log in
        </Button>
      </form>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/signup" className="underline">
          Sign up
        </Link>
      </div>
    </AuthLayout>
  )
}
