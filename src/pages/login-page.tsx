import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLayout } from "@/components/layout/auth-layout"
import { Loader2 } from "lucide-react"

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // --- Placeholder for Supabase Auth ---
    // Once Supabase is connected, the following logic will be implemented:
    //
    // const { error } = await supabase.auth.signInWithPassword({
    //   email,
    //   password,
    // });
    //
    // if (error) {
    //   setError(error.message);
    // } else {
    //   navigate('/dashboard'); // Redirect to dashboard on success
    // }
    
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === "test@example.com" && password === "password") {
       console.log("Simulated successful login");
       // In a real scenario, you'd navigate to the dashboard.
       // navigate('/dashboard');
    } else {
       setError("Invalid email or password. Please connect Supabase to enable real authentication.");
    }
    // --- End of Placeholder ---

    setLoading(false);
  };

  return (
    <AuthLayout
      title="Welcome Back"
      description="Enter your credentials to access your account"
    >
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
            <Link
              to="/forgot-password"
              className="ms-auto inline-block text-sm underline"
            >
              Forgot your password?
            </Link>
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
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
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
