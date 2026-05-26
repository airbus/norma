import { useCallback, useEffect, useState } from 'react';
import { api, type User } from '@/lib/api';
import { AuthContext } from '@/lib/auth-context';
import { changeLanguage } from '@/lib/i18n';

const TOKEN_KEY = 'norma-token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(() => !!localStorage.getItem(TOKEN_KEY));

  const fetchUser = useCallback(async () => {
    try {
      const u = await api.get<User>('/auth/me');
      setUser(u);
      if (u.language_preference) changeLanguage(u.language_preference);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return;
    let cancelled = false;
    api
      .get<User>('/auth/me')
      .then((u) => {
        if (!cancelled) {
          setUser(u);
          if (u.language_preference) changeLanguage(u.language_preference);
        }
      })
      .catch(() => {
        if (!cancelled) {
          localStorage.removeItem(TOKEN_KEY);
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post<{ access_token: string }>('/auth/login', { email, password });
    localStorage.setItem(TOKEN_KEY, res.access_token);
    await fetchUser();
  };

  const register = async (email: string, password: string, name: string, inviteToken?: string) => {
    const res = await api.post<{ access_token: string }>('/auth/register', {
      email,
      password,
      name,
      invite_token: inviteToken,
    });
    localStorage.setItem(TOKEN_KEY, res.access_token);
    await fetchUser();
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return <AuthContext value={{ user, isLoading, login, register, logout }}>{children}</AuthContext>;
}
