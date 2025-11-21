import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLayout } from "@/components/layout/auth-layout"
import { Loader2, ShieldAlert } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // We pass the username as email to our modified signIn function
    const { error } = await auth.signIn({ email: username, password });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Welcome, Super Admin!");
      navigate("/admin", { replace: true });
    }

    setLoading(false);
  };

  return (
    <AuthLayout
      title="Super Admin Access"
      description="Restricted area. Authorized personnel only."
    >
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-destructive/10 rounded-full">
            <ShieldAlert className="h-8 w-8 text-destructive" />
        </div>
      </div>
      
      <form onSubmit={handleLogin} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="admin_user"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        <Button type="submit" className="w-full" variant="destructive" disabled={loading}>
          {loading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
          Access Control Panel
        </Button>
      </form>
      
      <div className="mt-4 text-center text-sm">
        <Button variant="link" onClick={() => navigate('/login')}>
          Return to Standard Login
        </Button>
      </div>
    </AuthLayout>
  )
}
