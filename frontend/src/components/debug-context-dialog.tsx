import { useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';
import { Bug, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDebug } from '@/hooks/use-debug';
import { useProject } from '@/hooks/use-project';
import { api } from '@/lib/api';

interface DebugContextDialogProps {
  section?: string;
  refreshKey?: string | number;
}

export function DebugContextDialog({ section = 'full', refreshKey }: DebugContextDialogProps) {
  const debug = useDebug();
  const { currentProject } = useProject();
  const [open, setOpen] = useState(false);
  const [context, setContext] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const requestRef = useRef(0);

  useEffect(() => {
    if (!open || !currentProject || !section) return;
    const id = ++requestRef.current;
    // Fetch context; setState calls are in async callbacks to satisfy lint rules
    Promise.resolve()
      .then(() => {
        setContext(null);
        setLoading(true);
        return api.get<{ context: string | null }>(
          `/chat/context?project_id=${currentProject.id}&section=${section}`,
        );
      })
      .then((data) => {
        if (requestRef.current === id) {
          setContext(data.context);
          setLoading(false);
        }
      })
      .catch(() => {
        if (requestRef.current === id) {
          setContext('Failed to load context.');
          setLoading(false);
        }
      });
  }, [open, currentProject, section, refreshKey]);

  const wordCount = context ? context.split(/\s+/).filter(Boolean).length : 0;
  const pageEstimate = Math.ceil(wordCount / 250);

  if (!debug) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm" className="cursor-pointer bg-red-500 text-white hover:bg-red-600" />
        }
      >
        <Bug className="size-4" />
        Debug
      </DialogTrigger>
      <DialogContent className="h-[95vh] max-w-[95vw] sm:max-w-[95vw] overflow-hidden p-0">
        <DialogHeader className="border-b px-6 pt-6 pb-4">
          <DialogTitle className="flex items-center gap-3">
            Norma Context Debug
            {context && !loading && (
              <span className="text-muted-foreground text-xs font-normal">
                {wordCount.toLocaleString()} words &middot; ~{pageEstimate}{' '}
                {pageEstimate === 1 ? 'page' : 'pages'}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(95vh-5rem)] px-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="text-muted-foreground size-6 animate-spin" />
            </div>
          ) : context ? (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <Markdown>{context}</Markdown>
            </div>
          ) : (
            <p className="text-muted-foreground py-12 text-center">
              This page does not contribute to Norma's context.
            </p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
