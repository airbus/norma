import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useProject } from '@/hooks/use-project';

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewProjectDialog({ open, onOpenChange }: NewProjectDialogProps) {
  const { t } = useTranslation(['components', 'common']);
  const navigate = useNavigate();
  const { createProject } = useProject();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [intendedPurpose, setIntendedPurpose] = useState('');
  const [intendedUsers, setIntendedUsers] = useState('');
  const [deploymentContext, setDeploymentContext] = useState('');

  function reset() {
    setName('');
    setDescription('');
    setIntendedPurpose('');
    setIntendedUsers('');
    setDeploymentContext('');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await createProject({
      name: name.trim(),
      description: description.trim(),
      intended_purpose: intendedPurpose.trim(),
      intended_users: intendedUsers.trim(),
      deployment_context: deploymentContext.trim(),
    });
    reset();
    onOpenChange(false);
    navigate('/description');
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) reset();
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="flex h-[85vh] flex-col overflow-hidden backdrop-blur-lg sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{t('newProjectDialog.title')}</DialogTitle>
          <DialogDescription>{t('newProjectDialog.description')}</DialogDescription>
        </DialogHeader>

        <div className="-mx-4 flex-1 overflow-auto px-4">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('newProjectDialog.projectSummary')}</CardTitle>
                <CardDescription>{t('newProjectDialog.projectSummaryDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <form id="new-project-form" onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-name">{t('common:form.name')}</Label>
                    <Input
                      id="project-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('newProjectDialog.namePlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-desc">{t('common:form.description')}</Label>
                    <Textarea
                      id="project-desc"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={t('newProjectDialog.descriptionPlaceholder')}
                      rows={3}
                    />
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('newProjectDialog.intendedPurpose')}</CardTitle>
                <CardDescription>{t('newProjectDialog.intendedPurposeDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  form="new-project-form"
                  value={intendedPurpose}
                  onChange={(e) => setIntendedPurpose(e.target.value)}
                  placeholder={t('newProjectDialog.intendedPurposePlaceholder')}
                  rows={4}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('newProjectDialog.intendedUsers')}</CardTitle>
                <CardDescription>{t('newProjectDialog.intendedUsersDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  form="new-project-form"
                  value={intendedUsers}
                  onChange={(e) => setIntendedUsers(e.target.value)}
                  placeholder={t('newProjectDialog.intendedUsersPlaceholder')}
                  rows={4}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('newProjectDialog.deploymentContext')}</CardTitle>
                <CardDescription>{t('newProjectDialog.deploymentContextDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  form="new-project-form"
                  value={deploymentContext}
                  onChange={(e) => setDeploymentContext(e.target.value)}
                  placeholder={t('newProjectDialog.deploymentContextPlaceholder')}
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="-mx-4 -mb-4 flex justify-end gap-2 rounded-b-xl border-t bg-muted/50 p-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t('common:buttons.cancel')}
          </Button>
          <Button type="submit" form="new-project-form" disabled={!name.trim()}>
            {t('newProjectDialog.createProject')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
