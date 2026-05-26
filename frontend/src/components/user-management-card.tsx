import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, MoreHorizontal, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { api, type Invite, type User } from '@/lib/api';

export function UserManagementCard() {
  const { t } = useTranslation(['components', 'common']);
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [resetPasswordUserId, setResetPasswordUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setUsers(await api.get<User[]>('/users'));
    } catch {
      /* ignore */
    }
  }, []);

  const fetchInvites = useCallback(async () => {
    try {
      setInvites(await api.get<Invite[]>('/invites'));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    api
      .get<User[]>('/users')
      .then((data) => {
        if (!cancelled) setUsers(data);
      })
      .catch(() => {});
    api
      .get<Invite[]>('/invites')
      .then((data) => {
        if (!cancelled) setInvites(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const handleUpdateUser = async (userId: string, body: { role?: string; is_active?: boolean }) => {
    try {
      await api.patch(`/users/${userId}`, body);
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common:errors.updateFailed'));
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await api.delete(`/users/${userId}`);
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common:errors.deleteFailed'));
    }
  };

  const handleResetPassword = async () => {
    if (!resetPasswordUserId) return;
    try {
      await api.post(`/users/${resetPasswordUserId}/reset-password`, {
        new_password: newPassword,
      });
      setResetPasswordUserId(null);
      setNewPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common:errors.passwordResetFailed'));
    }
  };

  const handleCreateInvite = async () => {
    setInviteError('');
    try {
      await api.post('/invites', {
        email: inviteEmail || null,
        role: inviteRole,
      });
      setInviteEmail('');
      setInviteRole('member');
      setInviteDialogOpen(false);
      await fetchInvites();
    } catch (err) {
      setInviteError(err instanceof Error ? err.message : t('common:errors.failedToCreateInvite'));
    }
  };

  const handleDeleteInvite = async (inviteId: string) => {
    try {
      await api.delete(`/invites/${inviteId}`);
      await fetchInvites();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common:errors.failedToDeleteInvite'));
    }
  };

  const copyInviteLink = (token: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/register?token=${token}`);
  };

  const getInviteStatus = (invite: Invite) => {
    if (invite.used_at) return 'used';
    if (new Date(invite.expires_at) < new Date()) return 'expired';
    return 'pending';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('userManagement.title')}</CardTitle>
        <CardDescription>{t('userManagement.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">{t('userManagement.users')}</TabsTrigger>
            <TabsTrigger value="invitations">{t('userManagement.invitations')}</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('common:form.name')}</TableHead>
                  <TableHead>{t('common:form.email')}</TableHead>
                  <TableHead>{t('common:form.role')}</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>{u.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.is_active ? 'default' : 'secondary'}>
                        {u.is_active ? t('common:status.active') : t('common:status.disabled')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {u.id !== currentUser?.id && (
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={<Button variant="ghost" size="icon" className="size-8" />}
                          >
                            <MoreHorizontal className="size-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                handleUpdateUser(u.id, {
                                  role: u.role === 'admin' ? 'member' : 'admin',
                                })
                              }
                            >
                              {u.role === 'admin'
                                ? t('common:buttons.makeMember')
                                : t('common:buttons.makeAdmin')}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setResetPasswordUserId(u.id);
                                setNewPassword('');
                              }}
                            >
                              {t('common:buttons.resetPassword')}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleUpdateUser(u.id, { is_active: !u.is_active })}
                            >
                              {u.is_active
                                ? t('common:buttons.disableAccount')
                                : t('common:buttons.enableAccount')}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteUser(u.id)}
                            >
                              {t('common:buttons.deleteUser')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="invitations" className="space-y-4">
            <Dialog
              open={inviteDialogOpen}
              onOpenChange={(open) => {
                setInviteDialogOpen(open);
                if (!open) setInviteError('');
              }}
            >
              <DialogTrigger
                render={
                  <Button size="sm">
                    <Plus className="mr-2 size-4" />
                    {t('common:buttons.createInvite')}
                  </Button>
                }
              />
              <DialogContent>
                <DialogTitle>{t('userManagement.createInviteLink')}</DialogTitle>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="invite-email">{t('userManagement.emailOptional')}</Label>
                    <Input
                      id="invite-email"
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder={t('userManagement.emailPlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invite-role">{t('common:form.role')}</Label>
                    <Select value={inviteRole} onValueChange={(v) => v && setInviteRole(v)}>
                      <SelectTrigger id="invite-role">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">{t('common:form.member')}</SelectItem>
                        <SelectItem value="admin">{t('common:form.admin')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {inviteError && <p className="text-sm text-destructive">{inviteError}</p>}
                  <Button className="w-full" onClick={handleCreateInvite}>
                    {t('common:buttons.create')}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('common:form.email')}</TableHead>
                  <TableHead>{t('common:form.role')}</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>{t('common:table.expires')}</TableHead>
                  <TableHead className="w-24" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {invites.map((inv) => {
                  const status = getInviteStatus(inv);
                  return (
                    <TableRow key={inv.id}>
                      <TableCell>{inv.email ?? t('common:form.any')}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{inv.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={status === 'pending' ? 'default' : 'secondary'}>
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(inv.expires_at).toLocaleDateString()}</TableCell>
                      <TableCell className="flex gap-1">
                        {status === 'pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                              onClick={() => copyInviteLink(inv.token)}
                            >
                              <Copy className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 text-destructive"
                              onClick={() => handleDeleteInvite(inv.id)}
                            >
                              &times;
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>

        <Dialog
          open={!!resetPasswordUserId}
          onOpenChange={(open) => {
            if (!open) setResetPasswordUserId(null);
          }}
        >
          <DialogContent>
            <DialogTitle>{t('userManagement.resetPasswordTitle')}</DialogTitle>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="new-password">{t('userManagement.newPassword')}</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={8}
                />
              </div>
              <Button
                className="w-full"
                onClick={handleResetPassword}
                disabled={newPassword.length < 8}
              >
                {t('common:buttons.resetPassword')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
