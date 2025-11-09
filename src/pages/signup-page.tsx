import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLayout } from "@/components/layout/auth-layout"
import { Loader2 } from "lucide-react"

export function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // --- Placeholder for Supabase Auth ---
    // Once Supabase is connected, the following logic will be implemented:
    //
    // const { error } = await supabase.auth.signUp({
    //   email,
    //   password,
    // });
    //
    // if (error) {
    //   setError(error.message);
    // } else {
    //   setSuccess(true); // Show success message
    // }

    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (password.length < 6) {
        setError("Password should be at least 6 characters. Please connect Supabase to enable real authentication.");
    } else {
        setSuccess(true);
        console.log("Simulated successful signup");
    }
    // --- End of Placeholder ---

    setLoading(false);
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
            {error && <p className="text-sm text-destructive">{error}</p>}
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
