import React, { useState } from "react"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLayout } from "@/components/layout/auth-layout"
import { Loader2 } from "lucide-react"
import { GoogleIcon } from "@/components/ui/icons"
import { useAuth } from "@/hooks/use-auth"

export function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const auth = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: window.location.origin,
      }
    });

    if (error) {
      toast.error(error.message);
    } else if (data.user && data.user.identities?.length === 0) {
      toast.error("This user already exists. Please log in.");
    } else {
      toast.success("Confirmation email sent! Please check your inbox.");
      setSuccess(true);
    }

    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    const { error } = await auth.signInWithGoogle();
    if (error) {
      toast.error(error.message);
      setLoading(false);
    }
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
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
