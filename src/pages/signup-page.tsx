import React, { useState } from "react"
import { Link } from "react-router-dom"
import ReCAPTCHA from "react-google-recaptcha"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLayout } from "@/components/layout/auth-layout"
import { Loader2 } from "lucide-react"
import { GoogleIcon } from "@/components/ui/icons"

export function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = React.createRef<ReCAPTCHA>();
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;


  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) {
      setError("Please complete the reCAPTCHA.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);

    // --- Placeholder for Supabase Auth ---
    // const { error } = await supabase.auth.signUp({ email, password });
    // if (error) setError(error.message);
    // else setSuccess(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (password.length < 6) {
        setError("Password should be at least 6 characters.");
    } else {
        setSuccess(true);
        console.log("Simulated successful signup");
    }
    // --- End of Placeholder ---

    setLoading(false);
    recaptchaRef.current?.reset();
    setCaptchaToken(null);
  };

  const handleGoogleSignup = async () => {
    // --- Placeholder for Supabase Google Auth ---
    // const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    // if (error) setError(error.message);
    console.log("Simulating Google signup. Connect Supabase to enable.");
    setError("Google signup is a placeholder. Connect Supabase to enable.");
  };

  return (
    <AuthLayout
      title="Create an account"
      description="Enter your email below to create your account"
    >
      {success ? (
        <div className="text-center">
          <h3 className="text-lg font-semibold">Check your email</h3>
          <p className="text-muted-foreground mt-2">We've sent a verification link to your email address. Please check your inbox to continue.</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link to="/login">Back to Login</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            <Button variant="outline" className="w-full" onClick={handleGoogleSignup} disabled={loading}>
              {loading ? <Loader2 className="me-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="me-2 h-4 w-4" />}
              Sign up with Google
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
          <form onSubmit={handleSignup} className="grid gap-4">
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
              Create account
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="underline">
              Log in
            </Link>
          </div>
        </>
      )}
    </AuthLayout>
  )
}
