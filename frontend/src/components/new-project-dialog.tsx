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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { SectionPanel } from '@/components/questionnaire/section-panel';
import { useProject } from '@/hooks/use-project';
import { getQuestionnaireSections } from '@/data/questionnaire';

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewProjectDialog({ open, onOpenChange }: NewProjectDialogProps) {
  const { t } = useTranslation(['components', 'common', 'data']);
  const navigate = useNavigate();
  const { createProject } = useProject();
  const questionnaireSections = getQuestionnaireSections(t);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [intendedPurpose, setIntendedPurpose] = useState('');
  const [intendedUsers, setIntendedUsers] = useState('');
  const [deploymentContext, setDeploymentContext] = useState('');
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  function handleAnswerChange(questionId: string, value: string | string[]) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function reset() {
    setName('');
    setDescription('');
    setIntendedPurpose('');
    setIntendedUsers('');
    setDeploymentContext('');
    setAnswers({});
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
      questionnaire_answers: Object.keys(answers).length > 0 ? answers : undefined,
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
      <DialogContent className="sm:max-w-4xl h-[85vh] overflow-hidden flex flex-col backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle>{t('newProjectDialog.title')}</DialogTitle>
          <DialogDescription>{t('newProjectDialog.description')}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto -mx-4 px-4">
          <Tabs defaultValue="overview">
            <TabsList className="mb-6 w-full justify-start">
              <TabsTrigger value="overview">{t('newProjectDialog.overview')}</TabsTrigger>
              {questionnaireSections.map((section) => (
                <TabsTrigger key={section.id} value={section.id}>
                  {section.title}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview">
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
            </TabsContent>

            {questionnaireSections.map((section) => (
              <TabsContent key={section.id} value={section.id}>
                <SectionPanel
                  section={section}
                  answers={answers}
                  onAnswerChange={handleAnswerChange}
                />
              </TabsContent>
            ))}
          </Tabs>
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
