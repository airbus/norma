import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Circle, ExternalLink, Loader2, RefreshCw, Save } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
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
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/page-header';
import { useProject } from '@/hooks/use-project';
import { type GitHubIntegration, type GitHubTask, api } from '@/lib/api';

const SYNC_STEPS = [
  { key: 'syncing:issues', label: 'Fetching issues' },
  { key: 'syncing:tree', label: 'Analysing repository' },
  { key: 'syncing:files', label: 'Fetching source files' },
  { key: 'syncing:analysis', label: 'Generating analysis' },
];

function SyncProgress({ step }: { step: string }) {
  const currentIdx = SYNC_STEPS.findIndex((s) => s.key === step);

  return (
    <div className="border-b bg-muted/30 px-6 py-4">
      <div className="mx-auto flex max-w-5xl items-center gap-6">
        {SYNC_STEPS.map((s, i) => {
          const done = i < currentIdx;
          const active = i === currentIdx;

          return (
            <div key={s.key} className="flex items-center gap-2">
              {done ? (
                <Check className="size-4 text-primary" />
              ) : active ? (
                <Loader2 className="size-4 animate-spin text-primary" />
              ) : (
                <Circle className="size-4 text-muted-foreground/40" />
              )}
              <span
                className={`text-sm ${
                  done
                    ? 'text-primary font-medium'
                    : active
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground/60'
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function GitHubPage() {
  const { currentProject } = useProject();
  const [integration, setIntegration] = useState<GitHubIntegration | null>(null);
  const [tasks, setTasks] = useState<GitHubTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<GitHubTask | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('');
  const [labelFilter, setLabelFilter] = useState('');
  const [sprintFilter, setSprintFilter] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [syncStep, setSyncStep] = useState('');
  const [loading, setLoading] = useState(true);
  const [contextContent, setContextContent] = useState('');
  const [contextLoaded, setContextLoaded] = useState(false);
  const [contextSaving, setContextSaving] = useState(false);
  const [contextSaved, setContextSaved] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const projectId = currentProject?.id;

  const fetchData = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const integ = await api.get<GitHubIntegration>(`/projects/${projectId}/integrations`);
      setIntegration(integ);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (assigneeFilter) params.set('assignee', assigneeFilter);
      if (labelFilter) params.set('label', labelFilter);
      if (sprintFilter) params.set('milestone', sprintFilter);
      const qs = params.toString();
      const t = await api.get<GitHubTask[]>(
        `/projects/${projectId}/integrations/tasks${qs ? `?${qs}` : ''}`,
      );
      setTasks(t);
    } catch {
      setIntegration(null);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [projectId, statusFilter, assigneeFilter, labelFilter, sprintFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  const mermaidRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || !integration?.architecture_mermaid) return;

      let raw = integration.architecture_mermaid;
      const fenceMatch = raw.match(/```mermaid\s*\n([\s\S]*?)```/);
      if (fenceMatch) raw = fenceMatch[1];

      (async () => {
        try {
          const mermaid = await import('mermaid');
          mermaid.default.initialize({ startOnLoad: false, theme: 'neutral' });
          const id = `arch-diagram-${Date.now()}`;
          const { svg } = await mermaid.default.render(id, raw.trim());
          node.innerHTML = svg;
        } catch {
          node.innerHTML = `<pre class="text-xs overflow-auto p-4 bg-muted rounded-lg"><code>${raw}</code></pre>`;
        }
      })();
    },
    [integration],
  );

  const handleSync = async () => {
    if (!projectId) return;
    setSyncing(true);
    setSyncStep('syncing:issues');

    pollRef.current = setInterval(async () => {
      try {
        const res = await api.get<{ sync_status: string }>(
          `/projects/${projectId}/integrations/sync-status`,
        );
        setSyncStep(res.sync_status);
      } catch {
        /* ignore polling errors */
      }
    }, 2000);

    try {
      await api.post(`/projects/${projectId}/integrations/sync`);
      await fetchData();
      setContextLoaded(false);
      fetchContextFile();
    } catch {
      /* error handled by fetchData */
    } finally {
      clearInterval(pollRef.current);
      setSyncing(false);
      setSyncStep('');
    }
  };

  useEffect(() => {
    return () => clearInterval(pollRef.current);
  }, []);

  const fetchContextFile = useCallback(async () => {
    if (!projectId) return;
    try {
      const res = await api.get<{ content: string }>(
        `/projects/${projectId}/integrations/context-file`,
      );
      setContextContent(res.content);
      setContextLoaded(true);
    } catch {
      setContextContent('');
      setContextLoaded(true);
    }
  }, [projectId]);

  const saveContextFile = async () => {
    if (!projectId) return;
    setContextSaving(true);
    try {
      await api.put(`/projects/${projectId}/integrations/context-file`, {
        content: contextContent,
      });
      setContextSaved(true);
      setTimeout(() => setContextSaved(false), 2000);
    } catch {
      /* ignore */
    } finally {
      setContextSaving(false);
    }
  };

  const architectureDescription = (() => {
    if (!integration?.architecture_mermaid) return null;
    const raw = integration.architecture_mermaid;
    const afterFence = raw.replace(/```mermaid[\s\S]*?```/, '').trim();
    return afterFence || null;
  })();

  if (loading && !integration) {
    return (
      <div className="flex h-svh flex-col">
        <PageHeader title="GitHub" />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-svh flex-col">
      <PageHeader title="GitHub">
        <div className="flex items-center gap-3">
          {integration?.last_synced_at && !syncing && (
            <span className="text-xs text-muted-foreground">
              Last synced: {new Date(integration.last_synced_at).toLocaleString()}
            </span>
          )}
          {integration?.sync_status === 'error' && !syncing && (
            <Badge variant="destructive">Sync error</Badge>
          )}
          <Button onClick={handleSync} disabled={syncing}>
            {syncing ? (
              <Loader2 className="mr-1 size-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-1 size-4" />
            )}
            {syncing ? 'Syncing…' : 'Sync with GitHub'}
          </Button>
        </div>
      </PageHeader>

      {syncing && <SyncProgress step={syncStep} />}

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-5xl">
          <Tabs defaultValue="tasks">
            <TabsList className="mb-4">
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="architecture">Architecture</TabsTrigger>
              <TabsTrigger value="context" onClick={() => !contextLoaded && fetchContextFile()}>
                Context
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tasks">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <Select value={statusFilter} onValueChange={(v) => v && setStatusFilter(v)}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  className="w-40"
                  placeholder="Assignee"
                  value={assigneeFilter}
                  onChange={(e) => setAssigneeFilter(e.target.value)}
                />
                <Input
                  className="w-40"
                  placeholder="Label"
                  value={labelFilter}
                  onChange={(e) => setLabelFilter(e.target.value)}
                />
                <Input
                  className="w-40"
                  placeholder="Sprint"
                  value={sprintFilter}
                  onChange={(e) => setSprintFilter(e.target.value)}
                />
              </div>

              {tasks.length === 0 ? (
                <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                  {integration
                    ? 'No tasks found. Click Sync to fetch tasks from GitHub.'
                    : 'No GitHub integration configured.'}
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">#</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead className="w-24">Status</TableHead>
                        <TableHead className="w-40">Assignees</TableHead>
                        <TableHead className="w-40">Labels</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tasks.map((task) => (
                        <TableRow
                          key={task.id}
                          className="cursor-pointer"
                          onClick={() => setSelectedTask(task)}
                        >
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {task.github_id}
                          </TableCell>
                          <TableCell className="font-medium">{task.title}</TableCell>
                          <TableCell>
                            <Badge variant={task.status === 'open' ? 'default' : 'outline'}>
                              {task.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {task.assignees?.join(', ') || '-'}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {task.labels?.map((l) => (
                                <Badge key={l} variant="outline" className="text-xs">
                                  {l}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="architecture">
              {integration?.architecture_mermaid ? (
                <div className="space-y-6">
                  <div
                    ref={mermaidRef}
                    className="overflow-auto rounded-lg border bg-background p-6"
                  />
                  {architectureDescription && (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <p className="whitespace-pre-wrap">{architectureDescription}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                  No architecture diagram yet. Click Sync to analyse the repository.
                </div>
              )}
            </TabsContent>

            <TabsContent value="context">
              {contextLoaded && contextContent ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      This markdown file is used as context for the Norma chatbot. You can edit it
                      before starting a new chat session.
                    </p>
                    <div className="flex items-center gap-3">
                      {contextSaved && (
                        <span className="text-sm text-primary">Saved successfully</span>
                      )}
                      <Button onClick={saveContextFile} disabled={contextSaving}>
                        {contextSaving ? (
                          <Loader2 className="mr-1 size-4 animate-spin" />
                        ) : (
                          <Save className="mr-1 size-4" />
                        )}
                        Save
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    value={contextContent}
                    onChange={(e) => {
                      setContextContent(e.target.value);
                      setContextSaved(false);
                    }}
                    rows={24}
                    className="font-mono text-sm"
                  />
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                  No context file yet. Click Sync with GitHub to generate it.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="max-w-lg">
          {selectedTask && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-base">
                    #{selectedTask.github_id} {selectedTask.title}
                  </DialogTitle>
                </div>
                <DialogDescription className="flex items-center gap-2">
                  <Badge variant={selectedTask.status === 'open' ? 'default' : 'outline'}>
                    {selectedTask.status}
                  </Badge>
                  {selectedTask.assignees && selectedTask.assignees.length > 0 && (
                    <span className="text-xs">
                      Assigned to: {selectedTask.assignees.join(', ')}
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {selectedTask.body && (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{selectedTask.body}</p>
                )}
                {selectedTask.labels && selectedTask.labels.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {selectedTask.labels.map((l) => (
                      <Badge key={l} variant="outline">
                        {l}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex justify-between">
                  <a
                    href={selectedTask.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    Open on GitHub <ExternalLink className="size-3" />
                  </a>
                  <Button variant="outline" onClick={() => setSelectedTask(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
