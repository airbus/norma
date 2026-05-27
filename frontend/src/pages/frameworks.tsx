import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Scale, Trash2 } from 'lucide-react';
import Markdown from 'react-markdown';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PageHeader } from '@/components/page-header';
import { api, type Framework } from '@/lib/api';

interface AvailableFramework {
  name: string;
  description: string;
  category: string;
}

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline'> = {
  active: 'default',
  draft: 'secondary',
  inactive: 'outline',
};

const PROTECTED_FRAMEWORKS = new Set(['EU AI Act']);

function useFwT() {
  const { t } = useTranslation('pages');
  return {
    name: (englishName: string) => t(`frameworks.names.${englishName}`, englishName),
    desc: (englishName: string, fallback: string) =>
      t(`frameworks.descriptions.${englishName}`, fallback),
  };
}

export function FrameworksPage() {
  const { t } = useTranslation(['pages', 'common']);
  const fwT = useFwT();
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [selected, setSelected] = useState<Framework | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Framework | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [available, setAvailable] = useState<AvailableFramework[]>([]);

  useEffect(() => {
    api
      .get<Framework[]>('/frameworks')
      .then(setFrameworks)
      .catch(() => {});
  }, []);

  const fetchAvailable = useCallback(() => {
    api
      .get<AvailableFramework[]>('/frameworks/available')
      .then(setAvailable)
      .catch(() => {});
  }, []);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/frameworks/${deleteTarget.id}`);
      setFrameworks((prev) => prev.filter((fw) => fw.id !== deleteTarget.id));
      window.dispatchEvent(new Event('frameworks-changed'));
    } catch {
      /* deletion failed */
    }
    setDeleteTarget(null);
  }, [deleteTarget]);

  const handleAdd = useCallback(async (name: string) => {
    try {
      const fw = await api.post<Framework>('/frameworks', { name });
      setFrameworks((prev) => [...prev, fw]);
      setAvailable((prev) => prev.filter((a) => a.name !== name));
      setAddOpen(false);
      window.dispatchEvent(new Event('frameworks-changed'));
    } catch {
      /* add failed */
    }
  }, []);

  const handleAddOpen = useCallback(() => {
    fetchAvailable();
    setAddOpen(true);
  }, [fetchAvailable]);

  return (
    <div className="flex h-svh flex-col">
      <PageHeader title={t('frameworks.title')} debugSection="frameworks" />

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-4xl space-y-4">
          <div className="flex justify-end">
            <Button variant="outline" onClick={handleAddOpen}>
              <Plus className="mr-1 size-4" />
              {t('common:buttons.addFramework')}
            </Button>
          </div>

          {['External', 'Internal'].map((category) => {
            const group = frameworks.filter((fw) => fw.category === category);
            if (group.length === 0) return null;
            return (
              <div key={category} className="space-y-3">
                <h3 className="text-muted-foreground text-sm font-medium">{category}</h3>
                {group.map((fw) => (
                  <Card
                    key={fw.id}
                    className="cursor-pointer transition-shadow hover:shadow-md"
                    onClick={() => setSelected(fw)}
                  >
                    <CardHeader className="!flex !flex-row items-center gap-4">
                      <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg">
                        <Scale className="size-5" />
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <CardTitle className="text-base">{fwT.name(fw.name)}</CardTitle>
                        <CardDescription className="text-xs">
                          {fwT.desc(fw.name, fw.description)}
                        </CardDescription>
                      </div>
                      <Badge className="shrink-0" variant={STATUS_VARIANT[fw.status] ?? 'outline'}>
                        {t(`common:status.${fw.status}`)}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive shrink-0"
                        disabled={PROTECTED_FRAMEWORKS.has(fw.name)}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget(fw);
                        }}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Framework detail dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="h-[95vh] max-w-[95vw] sm:max-w-[95vw] overflow-hidden p-0">
          {selected &&
            (() => {
              const text = [selected.description, selected.content].filter(Boolean).join(' ');
              const wordCount = text.split(/\s+/).filter(Boolean).length;
              const pageEstimate = Math.ceil(wordCount / 250);
              return (
                <>
                  <DialogHeader className="border-b px-6 pt-6 pb-4">
                    <DialogTitle className="flex items-center gap-3">
                      {fwT.name(selected.name)}
                      <Badge variant={STATUS_VARIANT[selected.status] ?? 'outline'}>
                        {t(`common:status.${selected.status}`)}
                      </Badge>
                      {wordCount > 0 && (
                        <span className="text-muted-foreground text-xs font-normal">
                          {wordCount.toLocaleString()} words &middot; ~{pageEstimate}{' '}
                          {pageEstimate === 1 ? 'page' : 'pages'}
                        </span>
                      )}
                    </DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[calc(95vh-5rem)] px-6 py-4">
                    <p className="text-muted-foreground mb-4 text-sm">
                      {fwT.desc(selected.name, selected.description)}
                    </p>
                    {selected.content ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <Markdown>{selected.content}</Markdown>
                      </div>
                    ) : (
                      <p className="text-muted-foreground py-12 text-center">
                        {t('frameworks.noContent')}
                      </p>
                    )}
                  </ScrollArea>
                </>
              );
            })()}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('frameworks.deleteFramework')}</DialogTitle>
            <DialogDescription>
              {t('frameworks.deleteFrameworkConfirm', {
                name: deleteTarget ? fwT.name(deleteTarget.name) : '',
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              {t('common:buttons.cancel')}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              {t('common:buttons.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add framework dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('frameworks.addFrameworkTitle')}</DialogTitle>
          </DialogHeader>
          {available.length > 0 ? (
            <div className="space-y-3">
              {available.map((fw) => (
                <Card key={fw.name}>
                  <CardHeader className="!flex !flex-row items-center gap-4 !py-3">
                    <div className="flex-1 space-y-0.5">
                      <CardTitle className="text-sm">{fwT.name(fw.name)}</CardTitle>
                      <CardDescription className="text-xs">
                        {fwT.desc(fw.name, fw.description)}
                      </CardDescription>
                    </div>
                    <Button size="sm" onClick={() => handleAdd(fw.name)}>
                      <Plus className="mr-1 size-4" />
                      {t('common:buttons.create')}
                    </Button>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground py-4 text-center text-sm">
              {t('frameworks.addFrameworkEmpty')}
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
