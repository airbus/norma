import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GitBranch, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GitHubConnectDialog } from '@/components/github-connect-dialog';
import { PageHeader } from '@/components/page-header';
import { useProject } from '@/hooks/use-project';
import { type GitHubIntegration, api } from '@/lib/api';

export function IntegrationsPage() {
  const { t } = useTranslation(['pages', 'common']);
  const { currentProject } = useProject();
  const [integration, setIntegration] = useState<GitHubIntegration | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchIntegration = useCallback(async () => {
    if (!currentProject) return;
    setLoading(true);
    try {
      const data = await api.get<GitHubIntegration>(`/projects/${currentProject.id}/integrations`);
      setIntegration(data);
    } catch {
      setIntegration(null);
    } finally {
      setLoading(false);
    }
  }, [currentProject]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchIntegration();
  }, [fetchIntegration]);

  const connected = !!integration;

  return (
    <div className="flex h-svh flex-col">
      <PageHeader title={t('integrations.title')} />

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-4xl space-y-4">
          <div className="flex justify-end">
            <Button variant="outline" disabled>
              <Plus className="mr-1 size-4" />
              {t('common:buttons.addIntegration', 'Add Integration')}
            </Button>
          </div>

          {!loading && (
            <Card
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => setDialogOpen(true)}
            >
              <CardHeader className="!flex !flex-row items-center gap-4">
                <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg">
                  <GitBranch className="size-5" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <CardTitle className="text-base">GitHub</CardTitle>
                  <CardDescription className="text-xs">
                    {connected
                      ? `${integration.repo_owner}/${integration.repo_name}`
                      : t('integrations.githubDesc')}
                  </CardDescription>
                </div>
                <Badge className="shrink-0" variant={connected ? 'default' : 'outline'}>
                  {connected ? t('common:status.connected') : t('common:status.notConnected')}
                </Badge>
              </CardHeader>
            </Card>
          )}
        </div>
      </div>

      <GitHubConnectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        projectId={currentProject?.id ?? ''}
        existing={integration}
        onSaved={fetchIntegration}
      />
    </div>
  );
}
