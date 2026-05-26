import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AskNormaButton } from '@/components/ask-norma-button';
import { PageHeader } from '@/components/page-header';
import { ChecklistPanel, type ValidationResult } from '@/components/reporting/checklist-panel';
import { useProject } from '@/hooks/use-project';
import { getFrameworkChecklists } from '@/data/reporting-checklists';
import { api, type Framework, type ReportingEvidence } from '@/lib/api';

export function ReportingPage() {
  const { t } = useTranslation(['pages', 'common']);
  const { currentProject } = useProject();
  const { frameworkId } = useParams<{ frameworkId: string }>();
  const navigate = useNavigate();
  const [comments, setComments] = useState<Record<string, string>>({});
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [validations, setValidations] = useState<Record<string, ValidationResult>>({});
  const [validatingKeys, setValidatingKeys] = useState<Set<string>>(new Set());
  const lastValidatedValues = useRef<Record<string, string>>({});
  const redirected = useRef(false);

  useEffect(() => {
    api
      .get<Framework[]>('/frameworks')
      .then(setFrameworks)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!frameworkId && frameworks.length > 0 && !redirected.current) {
      redirected.current = true;
      navigate(`/reporting/${frameworks[0].id}`, { replace: true });
    }
  }, [frameworkId, frameworks, navigate]);

  useEffect(() => {
    if (!currentProject) return;
    api
      .get<ReportingEvidence[]>(`/projects/${currentProject.id}/reporting`)
      .then((data) => {
        const commentMap: Record<string, string> = {};
        const validationMap: Record<string, ValidationResult> = {};
        for (const ev of data) {
          commentMap[ev.item_key] = ev.comment;
          if (ev.covered != null && ev.feedback != null) {
            validationMap[ev.item_key] = { covered: ev.covered, feedback: ev.feedback };
          }
        }
        setComments(commentMap);
        setValidations(validationMap);
        for (const [key, comment] of Object.entries(commentMap)) {
          if (key in validationMap) {
            lastValidatedValues.current[key] = comment;
          }
        }
      })
      .catch(() => {});
  }, [currentProject]);

  const handleCommentChange = useCallback((key: string, value: string) => {
    setComments((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleValidate = useCallback(
    async (key: string, question: string, value: string) => {
      if (!value.trim()) {
        setValidations((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
        lastValidatedValues.current[key] = '';
        if (currentProject) {
          api
            .put(`/projects/${currentProject.id}/reporting`, {
              items: [{ item_key: key, comment: '', covered: null, feedback: null }],
            })
            .catch(() => {});
        }
        return;
      }

      if (lastValidatedValues.current[key] === value) return;

      setValidatingKeys((prev) => new Set(prev).add(key));
      try {
        const res = await api.post<ValidationResult>(
          `/projects/${currentProject?.id}/reporting/validate`,
          { question, answer: value, framework_id: frameworkId ?? '' },
        );
        setValidations((prev) => ({ ...prev, [key]: res }));
        lastValidatedValues.current[key] = value;
        if (currentProject) {
          api
            .put(`/projects/${currentProject.id}/reporting`, {
              items: [
                { item_key: key, comment: value, covered: res.covered, feedback: res.feedback },
              ],
            })
            .catch(() => {});
        }
      } catch {
        /* validation is non-critical */
      } finally {
        setValidatingKeys((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      }
    },
    [currentProject, frameworkId],
  );

  const currentFramework = frameworks.find((fw) => fw.id === frameworkId);
  const frameworkChecklists = getFrameworkChecklists(t);
  const checklist = currentFramework ? (frameworkChecklists[currentFramework.name] ?? []) : [];

  const pageTitle = currentFramework
    ? `${t('reporting.title')} > ${currentFramework.name}`
    : t('reporting.title');

  return (
    <div className="flex h-svh flex-col">
      <PageHeader title={pageTitle}>
        {currentFramework && (
          <AskNormaButton
            question={t('reporting.askNormaQuestion', { framework: currentFramework.name })}
          />
        )}
      </PageHeader>

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-4xl">
          {checklist.length > 0 ? (
            <>
              <div className="mb-4 flex justify-end">
                <Button variant="outline" size="sm" disabled>
                  <Download className="mr-1 size-4" />
                  {t('common:buttons.exportReport')}
                </Button>
              </div>
              <Tabs defaultValue={checklist[0].id} key={frameworkId}>
                <TabsList className="mb-6 h-auto w-full flex-wrap justify-start gap-1 p-1 group-data-horizontal/tabs:h-auto">
                  {checklist.map((area) => (
                    <TabsTrigger key={area.id} value={area.id} className="flex-none">
                      {area.title}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {checklist.map((area) => (
                  <TabsContent key={area.id} value={area.id}>
                    <ChecklistPanel
                      area={area}
                      comments={comments}
                      onCommentChange={handleCommentChange}
                      projectId={currentProject?.id ?? ''}
                      frameworkId={frameworkId ?? ''}
                      validations={validations}
                      validatingKeys={validatingKeys}
                      onValidate={handleValidate}
                    />
                  </TabsContent>
                ))}
              </Tabs>
            </>
          ) : (
            currentFramework && (
              <div className="text-muted-foreground rounded-lg border border-dashed py-8 text-center text-sm">
                No checklist defined for this framework yet.
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
