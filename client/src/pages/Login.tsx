import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Footer } from '@/components/Footer';

export default function Login() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(username, password);
      const user = useAuthStore.getState().user;
      
      if (user && !user.investorType) {
        setLocation('/onboarding');
      } else {
        setLocation('/portfolios');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {/* Hero Section */}
        <div className="w-full max-w-md mb-8 text-center space-y-4">
          <div className="flex items-center justify-center mb-6">
            <div className="h-12 w-12 bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">ORCA</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight">
            Institutional software, built for every portfolio.
          </h1>
          
          <p className="text-muted-foreground text-lg">
            Orca gives asset managers, family offices, and RIAs the tools to manage portfolios, 
            monitor risk, and track performance with the same power as the world's largest funds.
          </p>
        </div>

        {/* Login Form */}
        <Card className="w-full max-w-md" data-testid="card-login">
          <CardHeader>
            <CardTitle data-testid="text-login-title">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" data-testid="alert-login-error">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">Email</Label>
                <Input
                  id="username"
                  type="email"
                  placeholder="demo@orca.io"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                  data-testid="input-email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  data-testid="input-password"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                data-testid="button-login"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
