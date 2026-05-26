import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { type GitHubIntegration, api } from '@/lib/api';

interface GitHubConnectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  existing: GitHubIntegration | null;
  onSaved: () => void;
}

function GitHubConnectForm({
  existing,
  projectId,
  onSaved,
  onOpenChange,
}: {
  existing: GitHubIntegration | null;
  projectId: string;
  onSaved: () => void;
  onOpenChange: (open: boolean) => void;
}) {
  const [pat, setPat] = useState('');
  const [repoOwner, setRepoOwner] = useState(existing?.repo_owner ?? '');
  const [repoName, setRepoName] = useState(existing?.repo_name ?? '');
  const [projectNumber, setProjectNumber] = useState(
    existing?.github_project_number?.toString() ?? '',
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoOwner.trim() || !repoName.trim()) return;
    if (!existing && !pat.trim()) return;
    setLoading(true);
    setError('');
    try {
      if (existing) {
        const body: Record<string, unknown> = {
          repo_owner: repoOwner.trim(),
          repo_name: repoName.trim(),
          github_project_number: projectNumber ? parseInt(projectNumber, 10) : null,
        };
        if (pat.trim()) body.github_pat = pat.trim();
        await api.patch(`/projects/${projectId}/integrations`, body);
      } else {
        await api.post(`/projects/${projectId}/integrations`, {
          github_pat: pat.trim(),
          repo_owner: repoOwner.trim(),
          repo_name: repoName.trim(),
          github_project_number: projectNumber ? parseInt(projectNumber, 10) : null,
        });
      }
      window.dispatchEvent(new Event('integration-changed'));
      onSaved();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    setError('');
    try {
      await api.delete(`/projects/${projectId}/integrations`);
      window.dispatchEvent(new Event('integration-changed'));
      onSaved();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{existing ? 'Edit GitHub Integration' : 'Connect GitHub'}</DialogTitle>
        <DialogDescription>
          Link a GitHub repository to sync tasks and analyse architecture.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Label htmlFor="github-pat">
              Personal Access Token{existing ? ' (leave blank to keep current)' : ''}
            </Label>
            <Tooltip>
              <TooltipTrigger
                render={
                  <button type="button" className="text-muted-foreground hover:text-foreground" />
                }
              >
                <HelpCircle className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-64">
                Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens
                (classic) → Generate new token. Select the "repo" scope for private repos or
                "public_repo" for public repos.
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            id="github-pat"
            type="password"
            value={pat}
            onChange={(e) => setPat(e.target.value)}
            placeholder="ghp_..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="repo-owner">Repository Owner</Label>
          <Input
            id="repo-owner"
            value={repoOwner}
            onChange={(e) => setRepoOwner(e.target.value)}
            placeholder="e.g. octocat"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="repo-name">Repository Name</Label>
          <Input
            id="repo-name"
            value={repoName}
            onChange={(e) => setRepoName(e.target.value)}
            placeholder="e.g. hello-world"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="project-number">GitHub Project Number (optional)</Label>
          <Input
            id="project-number"
            type="number"
            value={projectNumber}
            onChange={(e) => setProjectNumber(e.target.value)}
            placeholder="e.g. 1"
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex justify-between">
          {existing ? (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDisconnect}
              disabled={loading}
            >
              Disconnect
            </Button>
          ) : (
            <div />
          )}
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                loading || !repoOwner.trim() || !repoName.trim() || (!existing && !pat.trim())
              }
            >
              {existing ? 'Update' : 'Connect'}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}

export function GitHubConnectDialog({
  open,
  onOpenChange,
  projectId,
  existing,
  onSaved,
}: GitHubConnectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        {open && (
          <GitHubConnectForm
            existing={existing}
            projectId={projectId}
            onSaved={onSaved}
            onOpenChange={onOpenChange}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
