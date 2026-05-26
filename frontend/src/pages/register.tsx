import { useEffect, useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NormaLogo } from '@/components/icons/norma-logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { api } from '@/lib/api';

export function RegisterPage() {
  const { t } = useTranslation(['pages', 'common']);
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
            setPageError(t('register.inviteInvalid'));
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
        setPageError(t('register.verifyFailed'));
      } finally {
        setPageLoading(false);
      }
    };
    check();
  }, [inviteToken, navigate, t]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('common:errors.passwordsDoNotMatch'));
      return;
    }

    setLoading(true);
    try {
      await register(email, password, name, inviteToken ?? undefined);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common:errors.registrationFailed'));
    } finally {
      setLoading(false);
    }
  };

  if (user) return <Navigate to="/" replace />;

  if (pageLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <p className="text-muted-foreground">{t('common:loading.loading')}</p>
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
                {t('common:buttons.backToLogin')}
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
          <div className="flex items-center justify-center gap-2">
            <NormaLogo className="size-7" />
            <CardTitle className="text-2xl font-medium" style={{ fontFamily: 'var(--font-logo)' }}>
              Norma
            </CardTitle>
          </div>
          <CardDescription>
            {inviteToken ? t('register.createAccount') : t('register.setupAdmin')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('common:form.name')}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('common:form.email')}</Label>
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
              <Label htmlFor="password">{t('common:form.password')}</Label>
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
              <Label htmlFor="confirm-password">{t('common:form.confirmPassword')}</Label>
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
              {loading ? t('common:loading.creatingAccount') : t('common:buttons.createAccount')}
            </Button>
          </form>
          {inviteToken && (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              {t('register.alreadyHaveAccount')}{' '}
              <Link to="/login" className="underline">
                {t('common:buttons.signIn')}
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
