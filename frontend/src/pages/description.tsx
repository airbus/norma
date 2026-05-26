import { useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AskNormaButton } from '@/components/ask-norma-button';
import { PageHeader } from '@/components/page-header';
import { useProject } from '@/hooks/use-project';

export function DescriptionPage() {
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
        <PageHeader title="Description > Overview">
          <AskNormaButton question="Review my project description and suggest improvements" />
        </PageHeader>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Select or create a project to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-svh flex-col">
      <PageHeader title="Description > Overview">
        <AskNormaButton question="Review my project description and suggest improvements" />
      </PageHeader>

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Summary</CardTitle>
              <CardDescription>Basic information about the AI system.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  defaultValue={currentProject.name}
                  onBlur={(e) => saveField('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
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
              <CardTitle>Intended Purpose</CardTitle>
              <CardDescription>What is the system designed to do?</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                defaultValue={currentProject.intended_purpose}
                onBlur={(e) => saveField('intended_purpose', e.target.value)}
                rows={4}
                placeholder="Describe the intended purpose of the AI system..."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Intended Users</CardTitle>
              <CardDescription>Who will operate or be affected by this system?</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                defaultValue={currentProject.intended_users}
                onBlur={(e) => saveField('intended_users', e.target.value)}
                rows={4}
                placeholder="Describe the intended users and affected persons..."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Deployment Context</CardTitle>
              <CardDescription>Where and how will the system be deployed?</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                defaultValue={currentProject.deployment_context}
                onBlur={(e) => saveField('deployment_context', e.target.value)}
                rows={4}
                placeholder="Describe the deployment context, sector, and geographic scope..."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
