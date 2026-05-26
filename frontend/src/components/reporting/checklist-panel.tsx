import { CheckCircle2, Info, Loader2, Wand2 } from 'lucide-react';
import { useRef, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import type { ChecklistArea } from '@/data/reporting-checklist';
import { api } from '@/lib/api';

export interface ValidationResult {
  covered: boolean;
  feedback: string;
}

interface ChecklistPanelProps {
  area: ChecklistArea;
  comments: Record<string, string>;
  onCommentChange: (key: string, value: string) => void;
  projectId: string;
  frameworkId: string;
  validations: Record<string, ValidationResult>;
  validatingKeys: Set<string>;
  onValidate: (key: string, question: string, value: string) => void;
}

interface EvidenceItem {
  item_key: string;
  comment: string;
  covered?: boolean | null;
  feedback?: string | null;
}

function saveEvidence(projectId: string, items: EvidenceItem[]) {
  if (items.length > 0 && projectId) {
    api.put(`/projects/${projectId}/reporting`, { items }).catch(() => {});
  }
}

export function ChecklistPanel({
  area,
  comments,
  onCommentChange,
  projectId,
  frameworkId,
  validations,
  validatingKeys,
  onValidate,
}: ChecklistPanelProps) {
  const [loadingKeys, setLoadingKeys] = useState<Set<string>>(new Set());
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  function saveCommentDebounced(key: string, value: string) {
    onCommentChange(key, value);
    const isEmpty = !value.trim();
    if (isEmpty) {
      onValidate(key, '', '');
    }
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveEvidence(projectId, [
        {
          item_key: key,
          comment: value,
          covered: isEmpty ? null : (validations[key]?.covered ?? null),
          feedback: isEmpty ? null : (validations[key]?.feedback ?? null),
        },
      ]);
    }, 1000);
  }

  async function handleSuggest(key: string, question: string) {
    setLoadingKeys((prev) => new Set(prev).add(key));
    try {
      const res = await api.post<{ suggestion: string }>(
        `/projects/${projectId}/reporting/suggest`,
        { question, current_comment: comments[key] ?? '', framework_id: frameworkId },
      );
      onCommentChange(key, res.suggestion);
      saveEvidence(projectId, [{ item_key: key, comment: res.suggestion }]);
      onValidate(key, question, res.suggestion);
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
              const isValidating = validatingKeys.has(key);
              const validation = validations[key];
              const fullQuestion = `[${area.title} — ${item.code} ${item.title}] ${question}`;
              return (
                <div key={key} className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm">{question}</p>
                    <button
                      type="button"
                      onClick={() => handleSuggest(key, fullQuestion)}
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
                    onChange={(e) => {
                      saveCommentDebounced(key, e.target.value);
                    }}
                    onBlur={(e) => {
                      onValidate(key, fullQuestion, e.target.value);
                    }}
                    placeholder="Add a comment..."
                    rows={2}
                  />
                  {isValidating && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Loader2 className="size-3 animate-spin" />
                      <span>Validating answer...</span>
                    </div>
                  )}
                  {!isValidating && validation && (
                    <div
                      className={`flex items-start gap-1.5 text-xs ${
                        validation.covered
                          ? 'text-green-600 dark:text-green-500'
                          : 'text-amber-600 dark:text-amber-500'
                      }`}
                    >
                      {validation.covered ? (
                        <CheckCircle2 className="mt-0.5 size-3 shrink-0" />
                      ) : (
                        <Info className="mt-0.5 size-3 shrink-0" />
                      )}
                      <span>{validation.feedback}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
