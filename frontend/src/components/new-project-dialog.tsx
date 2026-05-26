import { useState } from 'react';
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
          <DialogTitle>Create a new project</DialogTitle>
          <DialogDescription>
            Set up a new AI system project to begin tracking compliance.
          </DialogDescription>
        </DialogHeader>

        <div className="-mx-4 flex-1 overflow-auto px-4">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Summary</CardTitle>
                <CardDescription>Basic information about the AI system.</CardDescription>
              </CardHeader>
              <CardContent>
                <form id="new-project-form" onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-name">Name</Label>
                    <Input
                      id="project-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Predictive Maintenance"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-desc">Description</Label>
                    <Textarea
                      id="project-desc"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief description of the AI system..."
                      rows={3}
                    />
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Intended Purpose</CardTitle>
                <CardDescription>What is the system designed to do?</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  form="new-project-form"
                  value={intendedPurpose}
                  onChange={(e) => setIntendedPurpose(e.target.value)}
                  placeholder="Describe the intended purpose of the AI system..."
                  rows={4}
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
                  form="new-project-form"
                  value={intendedUsers}
                  onChange={(e) => setIntendedUsers(e.target.value)}
                  placeholder="Describe the intended users and affected persons..."
                  rows={4}
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
                  form="new-project-form"
                  value={deploymentContext}
                  onChange={(e) => setDeploymentContext(e.target.value)}
                  placeholder="Describe the deployment context, sector, and geographic scope..."
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="-mx-4 -mb-4 flex justify-end gap-2 rounded-b-xl border-t bg-muted/50 p-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="new-project-form" disabled={!name.trim()}>
            Create project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
