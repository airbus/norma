import { Loader2, Wand2 } from 'lucide-react';
import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import type { ChecklistArea } from '@/data/reporting-checklist';
import { api } from '@/lib/api';

interface ChecklistPanelProps {
  area: ChecklistArea;
  comments: Record<string, string>;
  onCommentChange: (key: string, value: string) => void;
  projectId: string;
}

export function ChecklistPanel({
  area,
  comments,
  onCommentChange,
  projectId,
}: ChecklistPanelProps) {
  const [loadingKeys, setLoadingKeys] = useState<Set<string>>(new Set());

  async function handleSuggest(key: string, question: string) {
    setLoadingKeys((prev) => new Set(prev).add(key));
    try {
      const res = await api.post<{ suggestion: string }>(
        `/projects/${projectId}/reporting/suggest`,
        { question, current_comment: comments[key] ?? '' },
      );
      onCommentChange(key, res.suggestion);
    } catch {
      /* silently fail — the user can retry */
    } finally {
      setLoadingKeys((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  }

  return (
    <div className="space-y-6">
      {area.items.map((item) => (
        <Card key={item.code}>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              <span className="text-muted-foreground mr-2">{item.code}</span>
              {item.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {item.questions.map((question, idx) => {
              const key = `${area.id}-${item.code}-${idx}`;
              const isLoading = loadingKeys.has(key);
              return (
                <div key={key} className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm">{question}</p>
                    <button
                      type="button"
                      onClick={() =>
                        handleSuggest(
                          key,
                          `[${area.title} — ${item.code} ${item.title}] ${question}`,
                        )
                      }
                      disabled={isLoading}
                      className="text-muted-foreground hover:text-foreground mt-0.5 flex shrink-0 cursor-pointer items-center gap-1 rounded px-1.5 py-0.5 text-xs transition-colors hover:bg-slate-100 disabled:opacity-50"
                      title="Generate suggestion with Norma"
                    >
                      {isLoading ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Wand2 className="size-3.5" />
                      )}
                      Norma
                    </button>
                  </div>
                  <Textarea
                    value={comments[key] ?? ''}
                    onChange={(e) => onCommentChange(key, e.target.value)}
                    placeholder="Add a comment..."
                    rows={2}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
