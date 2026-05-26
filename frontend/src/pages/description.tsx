import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AskNormaButton } from '@/components/ask-norma-button';
import { PageHeader } from '@/components/page-header';
import { useProject } from '@/hooks/use-project';

export function DescriptionPage() {
  const { t } = useTranslation(['pages', 'common']);
  const { currentProject, updateProject } = useProject();

  const saveField = useCallback(
    (field: string, value: string) => {
      if (!currentProject) return;
      updateProject(currentProject.id, { [field]: value });
    },
    [currentProject, updateProject],
  );

  if (!currentProject) {
    return (
      <div className="flex h-svh flex-col">
        <PageHeader title={t('description.title') + ' > ' + t('description.overview')}>
          <AskNormaButton question="Review my project description and suggest improvements" />
        </PageHeader>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">{t('description.noProject')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-svh flex-col">
      <PageHeader title={t('description.title') + ' > ' + t('description.overview')}>
        <AskNormaButton question="Review my project description and suggest improvements" />
      </PageHeader>

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('description.projectSummary')}</CardTitle>
              <CardDescription>{t('description.projectSummaryDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('common:form.name')}</Label>
                <Input
                  id="name"
                  defaultValue={currentProject.name}
                  onBlur={(e) => saveField('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t('common:form.description')}</Label>
                <Textarea
                  id="description"
                  defaultValue={currentProject.description}
                  onBlur={(e) => saveField('description', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('description.intendedPurpose')}</CardTitle>
              <CardDescription>{t('description.intendedPurposeDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                defaultValue={currentProject.intended_purpose}
                onBlur={(e) => saveField('intended_purpose', e.target.value)}
                rows={4}
                placeholder={t('description.intendedPurposePlaceholder')}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('description.intendedUsers')}</CardTitle>
              <CardDescription>{t('description.intendedUsersDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                defaultValue={currentProject.intended_users}
                onBlur={(e) => saveField('intended_users', e.target.value)}
                rows={4}
                placeholder={t('description.intendedUsersPlaceholder')}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('description.deploymentContext')}</CardTitle>
              <CardDescription>{t('description.deploymentContextDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                defaultValue={currentProject.deployment_context}
                onBlur={(e) => saveField('deployment_context', e.target.value)}
                rows={4}
                placeholder={t('description.deploymentContextPlaceholder')}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
