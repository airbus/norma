import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Scale } from 'lucide-react';
import Markdown from 'react-markdown';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PageHeader } from '@/components/page-header';
import { api, type Framework } from '@/lib/api';

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline'> = {
  active: 'default',
  draft: 'secondary',
  inactive: 'outline',
};

export function FrameworksPage() {
  const { t } = useTranslation(['pages', 'common']);
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [selected, setSelected] = useState<Framework | null>(null);

  useEffect(() => {
    api
      .get<Framework[]>('/frameworks')
      .then(setFrameworks)
      .catch(() => {});
  }, []);

  return (
    <div className="flex h-svh flex-col">
      <PageHeader title={t('frameworks.title')} debugSection="frameworks" />

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-4xl space-y-4">
          <div className="flex justify-end">
            <Button variant="outline" disabled>
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
                        <CardTitle className="text-base">{fw.name}</CardTitle>
                        <CardDescription className="text-xs">{fw.description}</CardDescription>
                      </div>
                      <Badge className="shrink-0" variant={STATUS_VARIANT[fw.status] ?? 'outline'}>
                        {t(`common:status.${fw.status}`)}
                      </Badge>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            );
          })}
        </div>
      </div>

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
                      {selected.name}
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
                    <p className="text-muted-foreground mb-4 text-sm">{selected.description}</p>
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
    </div>
  );
}
