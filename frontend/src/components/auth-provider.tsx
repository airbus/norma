import { useCallback, useEffect, useState } from 'react';
import { api, type User } from '@/lib/api';
import { AuthContext } from '@/hooks/use-auth';

const TOKEN_KEY = 'norma-token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const u = await api.get<User>('/auth/me');
      setUser(u);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      fetchUser().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [fetchUser]);

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
