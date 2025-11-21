import React, { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLayout } from "@/components/layout/auth-layout"
import { Loader2, Beaker } from "lucide-react"
import { GoogleIcon } from "@/components/ui/icons"
import { useAuth } from "@/hooks/use-auth"

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const from = location.state?.from?.pathname || "/dashboard";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await auth.signIn({ email, password });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Logged in successfully!");
      navigate(from, { replace: true });
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await auth.signInWithGoogle();
    if (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const handleCreateTestUser = async () => {
    setLoading(true);
    try {
      await auth.signInAsTestUser();
      toast.success("Logged in as Test User (Local Mode)");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error("Failed to create test user session");
      console.error(error);
    } finally {
      setLoading(false);
    }
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
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
          Log in
        </Button>
      </form>
      
      <div className="mt-4">
        <Button 
            variant="secondary" 
            className="w-full border-dashed border-2 border-primary/20" 
            onClick={handleCreateTestUser} 
            disabled={loading}
        >
            {loading ? <Loader2 className="me-2 h-4 w-4 animate-spin" /> : <Beaker className="me-2 h-4 w-4" />}
            Create Test User & Auto Login
        </Button>
      </div>

      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/signup" className="underline">
          Sign up
        </Link>
      </div>
      
      <div className="mt-2 text-center text-sm">
        <Link to="/admin-login" className="text-muted-foreground hover:text-primary transition-colors text-xs">
          Admin Login
        </Link>
      </div>
    </AuthLayout>
  )
}
