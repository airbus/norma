import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageHeader } from '@/components/page-header';
import { UserManagementCard } from '@/components/user-management-card';
import { useAuth } from '@/hooks/use-auth';
import { useProject } from '@/hooks/use-project';
import { useTheme } from '@/hooks/use-theme';
import { changeLanguage } from '@/lib/i18n';
import { api } from '@/lib/api';

export function SettingsPage() {
  const { t, i18n } = useTranslation(['pages', 'common']);
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const { currentProject, deleteProject } = useProject();
  const isAdmin = user?.role === 'admin';
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDeleteProject = async () => {
    if (!currentProject) return;
    await deleteProject(currentProject.id);
    setDeleteOpen(false);
  };

  return (
    <div className="flex h-svh flex-col">
      <PageHeader title={t('settings.title')} />

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.preferences')}</CardTitle>
              <CardDescription>{t('settings.customise')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="theme">{t('settings.theme')}</Label>
                <Select
                  value={theme}
                  onValueChange={(v) => setTheme(v as 'light' | 'dark' | 'system')}
                >
                  <SelectTrigger id="theme" className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">{t('settings.themeLight')}</SelectItem>
                    <SelectItem value="dark">{t('settings.themeDark')}</SelectItem>
                    <SelectItem value="system">{t('settings.themeSystem')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="language">{t('settings.language')}</Label>
                <Select
                  value={i18n.language?.split('-')[0] ?? 'en'}
                  onValueChange={(v) => {
                    if (!v) return;
                    changeLanguage(v);
                    api.patch('/auth/me', { language_preference: v }).catch(() => {});
                  }}
                >
                  <SelectTrigger id="language" className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {isAdmin && currentProject && (
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle>{t('settings.dangerZone')}</CardTitle>
                <CardDescription>{t('settings.dangerZoneDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{t('common:buttons.deleteProject')}</p>
                    <p className="text-muted-foreground text-xs">
                      {t('settings.deleteProjectDesc', { name: currentProject.name })}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => setDeleteOpen(true)}
                  >
                    <Trash2 className="mr-1 size-3" />
                    {t('common:buttons.delete')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {isAdmin && <UserManagementCard />}
        </div>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('common:buttons.deleteProject')}</DialogTitle>
            <DialogDescription>
              {t('settings.deleteProjectConfirm', { name: currentProject?.name })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              {t('common:buttons.cancel')}
            </Button>
            <Button variant="destructive" className="cursor-pointer" onClick={handleDeleteProject}>
              {t('common:buttons.deletePermanently')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
