import { useEffect, useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { NormaLogo } from '@/components/icons/norma-logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { api } from '@/lib/api';

export function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get('token');
  const { user, register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState('');

  useEffect(() => {
    const check = async () => {
      try {
        if (inviteToken) {
          const res = await api.get<{ valid: boolean; email?: string }>(
            `/invites/${inviteToken}/validate`,
          );
          if (!res.valid) {
            setPageError('This invite link is invalid or has expired.');
            return;
          }
          if (res.email) setEmail(res.email);
        } else {
          const res = await api.get<{ needs_setup: boolean }>('/auth/setup-status');
          if (!res.needs_setup) {
            navigate('/login', { replace: true });
            return;
          }
        }
      } catch {
        setPageError('Unable to verify registration status.');
      } finally {
        setPageLoading(false);
      }
    };
    check();
  }, [inviteToken, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register(email, password, name, inviteToken ?? undefined);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (user) return <Navigate to="/" replace />;

  if (pageLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2">
              <NormaLogo className="size-7" />
              <CardTitle
                className="text-2xl font-medium"
                style={{ fontFamily: 'var(--font-logo)' }}
              >
                Norma
              </CardTitle>
            </div>
            <CardDescription>{pageError}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/login">
              <Button variant="outline" className="w-full">
                Back to login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">Norma</CardTitle>
          <CardDescription>
            {inviteToken ? 'Create your account' : 'Set up your admin account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                readOnly={!!inviteToken && !!email}
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
                minLength={8}
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
          {inviteToken && (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="underline">
                Sign in
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
