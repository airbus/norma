import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Scale } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
      <PageHeader title={t('frameworks.title')} />

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
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <DialogTitle>{selected.name}</DialogTitle>
                  <Badge variant={STATUS_VARIANT[selected.status] ?? 'outline'}>
                    {t(`common:status.${selected.status}`)}
                  </Badge>
                </div>
                <DialogDescription>{selected.category}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm leading-relaxed">{selected.description}</p>
                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => setSelected(null)}>
                    {t('common:buttons.close')}
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
