import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Check,
  Circle,
  ExternalLink,
  Loader2,
  Minus,
  Move,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
} from 'lucide-react';
import Markdown from 'react-markdown';
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
import { AskNormaButton } from '@/components/ask-norma-button';
import { PageHeader } from '@/components/page-header';
import { useProject } from '@/hooks/use-project';
import { type GitHubIntegration, type GitHubTask, api } from '@/lib/api';

const SYNC_STEPS = [
  { key: 'syncing:issues', labelKey: 'issues' },
  { key: 'syncing:tree', labelKey: 'tree' },
  { key: 'syncing:files', labelKey: 'files' },
  { key: 'syncing:analysis', labelKey: 'analysis' },
];

function SyncProgress({ step }: { step: string }) {
  const { t } = useTranslation(['pages']);
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
                {t(`github.syncSteps.${s.labelKey}`)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function GitHubPage() {
  const { t } = useTranslation(['pages', 'common']);
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
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(
    null,
  );
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

  const parsedArchitecture = (() => {
    const full = integration?.architecture_mermaid ?? '';
    const graphIdx = full.indexOf('graph ');
    if (graphIdx === -1) return { diagram: '', description: '' };
    const afterGraph = full.substring(graphIdx);
    const closingFence = afterGraph.match(/\n`{3,}\s*\n?/);
    const diagram = closingFence
      ? afterGraph.substring(0, closingFence.index!).trim()
      : afterGraph.trim();
    const description = closingFence
      ? afterGraph.substring(closingFence.index! + closingFence[0].length).trim()
      : '';
    return { diagram, description };
  })();

  const mermaidRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || !parsedArchitecture.diagram) return;

      const sanitised = (() => {
        const rawLines = parsedArchitecture.diagram.split('\n');
        const merged: string[] = [];
        let buf = '';
        for (const line of rawLines) {
          if (buf) {
            buf += ' ' + line.trim();
            if (buf.includes(']')) {
              merged.push(buf);
              buf = '';
            }
          } else if (line.includes('[') && !line.includes(']')) {
            buf = line;
          } else {
            merged.push(line);
          }
        }
        if (buf) merged.push(buf);

        const cleanLabel = (label: string) => {
          const unwrapped = label.replace(/^\(([^)]*)\)$/, '$1').replace(/^\("?([^"]*)"?\)$/, '$1');
          const cleaned = unwrapped
            .replace(/\([^)]*\)/g, '')
            .replace(/\(.*$/, '')
            .replace(/[{}"'<>]/g, '')
            .replace(/&/g, 'and')
            .replace(/,\s*$/, '')
            .replace(/\s{2,}/g, ' ')
            .trim();
          return cleaned || unwrapped.replace(/[{}"'<>]/g, '').trim() || label.trim();
        };

        merged[0] = merged[0].replace(/^graph\s+(LR|RL|BT|TB)/, 'graph TD');

        const defined = new Set<string>();
        const cleaned = merged.map((line) => {
          if (line.trim().startsWith('subgraph ')) {
            return line.replace(/\s*\([^)]*\)/g, '');
          }
          const def = line.match(/^(\s*\w+)\[([^\]]*)\]/);
          if (def && !line.includes('-->') && !line.includes('---')) {
            defined.add(def[1].trim());
          }
          return line.replace(/\[([^\]]*)\]/g, (_, l) => `[${cleanLabel(l)}]`);
        });

        return cleaned
          .map((line) => {
            if (!line.includes('-->') && !line.includes('---')) return line;
            return line.replace(/(\w+)\[[^\]]*\]/g, (full, id) => (defined.has(id) ? id : full));
          })
          .join('\n');
      })();

      (async () => {
        try {
          const mermaid = await import('mermaid');
          mermaid.default.initialize({ startOnLoad: false, theme: 'neutral' });
          const id = `arch-diagram-${Date.now()}`;
          const { svg } = await mermaid.default.render(id, sanitised);
          node.innerHTML = svg;
        } catch (err) {
          console.error('[Mermaid render error]', err);
          node.innerHTML = `<pre class="text-xs overflow-auto p-4 bg-muted rounded-lg"><code>${parsedArchitecture.diagram}</code></pre>`;
        }
      })();
    },
    [parsedArchitecture.diagram],
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

  const architectureDescription = parsedArchitecture.description || null;

  if (loading && !integration) {
    return (
      <div className="flex h-svh flex-col">
        <PageHeader title={t('github.title')} debugSection="github" />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-svh flex-col">
      <PageHeader title={t('github.title')} debugSection="github">
        <AskNormaButton question={t('github.askNormaQuestion')} />
      </PageHeader>

      {syncing && <SyncProgress step={syncStep} />}

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-5xl">
          <Tabs defaultValue="tasks">
            <div className="mb-4 flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="tasks">{t('github.tasks')}</TabsTrigger>
                <TabsTrigger value="architecture">{t('github.architecture')}</TabsTrigger>
                {/* <TabsTrigger value="context" onClick={() => !contextLoaded && fetchContextFile()}>
                {t('github.context')}
              </TabsTrigger> */}
              </TabsList>
              <div className="flex items-center gap-3">
                {integration?.last_synced_at && !syncing && (
                  <span className="text-xs text-muted-foreground">
                    {t('github.lastSynced', {
                      date: new Date(integration.last_synced_at).toLocaleString(),
                    })}
                  </span>
                )}
                {integration?.sync_status === 'error' && !syncing && (
                  <Badge variant="destructive">{t('common:status.syncError')}</Badge>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="cursor-pointer"
                  onClick={handleSync}
                  disabled={syncing}
                >
                  {syncing ? (
                    <Loader2 className="mr-1 size-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-1 size-4" />
                  )}
                  {syncing ? t('common:loading.syncing') : t('common:buttons.syncWithGitHub')}
                </Button>
              </div>
            </div>

            <TabsContent value="tasks">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <Select value={statusFilter} onValueChange={(v) => v && setStatusFilter(v)}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder={t('github.statusPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('github.all')}</SelectItem>
                    <SelectItem value="open">{t('common:status.open')}</SelectItem>
                    <SelectItem value="closed">{t('common:status.closed')}</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  className="w-40"
                  placeholder={t('github.assigneePlaceholder')}
                  value={assigneeFilter}
                  onChange={(e) => setAssigneeFilter(e.target.value)}
                />
                <Input
                  className="w-40"
                  placeholder={t('github.labelPlaceholder')}
                  value={labelFilter}
                  onChange={(e) => setLabelFilter(e.target.value)}
                />
                <Input
                  className="w-40"
                  placeholder={t('github.sprintPlaceholder')}
                  value={sprintFilter}
                  onChange={(e) => setSprintFilter(e.target.value)}
                />
              </div>

              {tasks.length === 0 ? (
                <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                  {integration ? t('github.noTasks') : t('github.noIntegration')}
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">#</TableHead>
                        <TableHead>{t('common:table.title')}</TableHead>
                        <TableHead className="w-24">{t('github.statusPlaceholder')}</TableHead>
                        <TableHead className="w-40">{t('common:table.assignees')}</TableHead>
                        <TableHead className="w-40">{t('common:table.labels')}</TableHead>
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
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant={pan ? 'default' : 'outline'}
                      size="icon"
                      className="size-8 cursor-pointer"
                      onClick={() => setPan((p) => !p)}
                    >
                      <Move className="size-4" />
                    </Button>
                    <div className="bg-border mx-1 h-4 w-px" />
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-8 cursor-pointer"
                      onClick={() => setZoom((z) => Math.max(0.25, z - 0.25))}
                      disabled={zoom <= 0.25}
                    >
                      <Minus className="size-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 min-w-[3.5rem] cursor-pointer text-xs"
                      onClick={() => {
                        setZoom(1);
                        setPanOffset({ x: 0, y: 0 });
                      }}
                    >
                      {zoom === 1 && panOffset.x === 0 && panOffset.y === 0 ? (
                        <RotateCcw className="size-3" />
                      ) : (
                        `${Math.round(zoom * 100)}%`
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-8 cursor-pointer"
                      onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                      disabled={zoom >= 3}
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
                  <div
                    className="overflow-hidden rounded-lg border bg-background p-6"
                    style={{ cursor: pan ? 'grab' : 'default' }}
                    onMouseDown={(e) => {
                      if (!pan) return;
                      e.preventDefault();
                      dragRef.current = {
                        startX: e.clientX,
                        startY: e.clientY,
                        origX: panOffset.x,
                        origY: panOffset.y,
                      };
                      (e.currentTarget as HTMLElement).style.cursor = 'grabbing';
                    }}
                    onMouseMove={(e) => {
                      if (!dragRef.current) return;
                      setPanOffset({
                        x: dragRef.current.origX + (e.clientX - dragRef.current.startX),
                        y: dragRef.current.origY + (e.clientY - dragRef.current.startY),
                      });
                    }}
                    onMouseUp={(e) => {
                      if (!dragRef.current) return;
                      dragRef.current = null;
                      (e.currentTarget as HTMLElement).style.cursor = 'grab';
                    }}
                    onMouseLeave={(e) => {
                      if (!dragRef.current) return;
                      dragRef.current = null;
                      (e.currentTarget as HTMLElement).style.cursor = 'grab';
                    }}
                  >
                    <div
                      ref={mermaidRef}
                      style={{
                        transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
                        transformOrigin: 'top left',
                      }}
                    />
                  </div>
                  {architectureDescription && (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <Markdown>{architectureDescription}</Markdown>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                  {t('github.noArchitecture')}
                </div>
              )}
            </TabsContent>

            <TabsContent value="context">
              {contextLoaded && contextContent ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {t('github.contextDescription')}
                    </p>
                    <div className="flex items-center gap-3">
                      {contextSaved && (
                        <span className="text-sm text-primary">
                          {t('github.savedSuccessfully')}
                        </span>
                      )}
                      <Button onClick={saveContextFile} disabled={contextSaving}>
                        {contextSaving ? (
                          <Loader2 className="mr-1 size-4 animate-spin" />
                        ) : (
                          <Save className="mr-1 size-4" />
                        )}
                        {t('common:buttons.save')}
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
                  {t('github.noContext')}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="flex h-[70vh] flex-col overflow-hidden sm:max-w-2xl">
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
                      {t('github.assignedTo', { assignees: selectedTask.assignees.join(', ') })}
                    </span>
                  )}
                  {selectedTask.labels && selectedTask.labels.length > 0 && (
                    <span className="flex flex-wrap gap-1">
                      {selectedTask.labels.map((l) => (
                        <Badge key={l} variant="outline" className="text-xs">
                          {l}
                        </Badge>
                      ))}
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>
              <div className="-mx-4 flex-1 overflow-auto px-4">
                {selectedTask.body ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <Markdown>{selectedTask.body}</Markdown>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No description provided.</p>
                )}
              </div>
              <div className="-mx-4 -mb-4 flex items-center justify-between rounded-b-xl border-t bg-muted/50 p-4">
                <a
                  href={selectedTask.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex cursor-pointer items-center gap-1 text-sm text-primary hover:underline"
                >
                  {t('common:buttons.openOnGitHub')} <ExternalLink className="size-3" />
                </a>
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => setSelectedTask(null)}
                >
                  {t('common:buttons.close')}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
