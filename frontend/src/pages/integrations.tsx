import { useState } from 'react';
import { GitBranch, Plus } from 'lucide-react';
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
import { MOCK_INTEGRATIONS, type Integration } from '@/data/mock';

export function IntegrationsPage() {
  const [selected, setSelected] = useState<Integration | null>(null);

  return (
    <div className="flex h-svh flex-col">
      <PageHeader title="Integrations" />

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-4xl space-y-4">
          <div className="flex justify-end">
            <Button variant="outline" disabled>
              <Plus className="mr-1 size-4" />
              Add Integration
            </Button>
          </div>

          {MOCK_INTEGRATIONS.map((integration) => (
            <Card
              key={integration.id}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => setSelected(integration)}
            >
              <CardHeader className="!flex !flex-row items-center gap-4">
                <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg">
                  <GitBranch className="size-5" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <CardTitle className="text-base">{integration.name}</CardTitle>
                  <CardDescription className="text-xs">{integration.description}</CardDescription>
                </div>
                <Badge className="shrink-0" variant={integration.connected ? 'default' : 'outline'}>
                  {integration.connected ? 'Connected' : 'Not connected'}
                </Badge>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <DialogTitle>{selected.name}</DialogTitle>
                  <Badge variant={selected.connected ? 'default' : 'outline'}>
                    {selected.connected ? 'Connected' : 'Not connected'}
                  </Badge>
                </div>
                <DialogDescription>Integration</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm leading-relaxed">{selected.description}</p>
                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => setSelected(null)}>
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
