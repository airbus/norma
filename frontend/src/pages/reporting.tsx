import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AskNormaButton } from '@/components/ask-norma-button';
import { PageHeader } from '@/components/page-header';
import { ChecklistPanel, type ValidationResult } from '@/components/reporting/checklist-panel';
import { useProject } from '@/hooks/use-project';
import { getFrameworkChecklists } from '@/data/reporting-checklists';
import { api, type Framework, type ReportingEvidence } from '@/lib/api';
import type { PdfLabels } from '@/lib/pdf-export';

export function ReportingPage() {
  const { t, i18n } = useTranslation(['pages', 'common']);
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

  const [debugRefreshKey, setDebugRefreshKey] = useState(0);
  const debugRefreshTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleCommentChange = useCallback((key: string, value: string) => {
    setComments((prev) => ({ ...prev, [key]: value }));
    if (debugRefreshTimer.current) clearTimeout(debugRefreshTimer.current);
    debugRefreshTimer.current = setTimeout(() => {
      setDebugRefreshKey((k) => k + 1);
    }, 1500);
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

  const [isExporting, setIsExporting] = useState(false);

  const currentFramework = frameworks.find((fw) => fw.id === frameworkId);
  const frameworkChecklists = getFrameworkChecklists(t);
  const checklist = useMemo(
    () => (currentFramework ? (frameworkChecklists[currentFramework.name] ?? []) : []),
    [currentFramework, frameworkChecklists],
  );

  const handleExport = useCallback(async () => {
    if (!currentFramework || !currentProject) return;
    setIsExporting(true);
    try {
      const { exportReportToPdf } = await import('@/lib/pdf-export');
      const labels: PdfLabels = {
        reportTitle: t('common:pdfExport.reportTitle'),
        generatedOn: t('common:pdfExport.generatedOn'),
        projectOverview: t('common:pdfExport.projectOverview'),
        projectName: t('common:pdfExport.projectName'),
        description: t('common:pdfExport.description'),
        riskClassification: t('common:pdfExport.riskClassification'),
        intendedPurpose: t('common:pdfExport.intendedPurpose'),
        intendedUsers: t('common:pdfExport.intendedUsers'),
        deploymentContext: t('common:pdfExport.deploymentContext'),
        framework: t('common:pdfExport.framework'),
        completionSummary: t('common:pdfExport.completionSummary'),
        totalQuestions: t('common:pdfExport.totalQuestions'),
        answered: t('common:pdfExport.answered'),
        covered: t('common:pdfExport.covered'),
        needsAttention: t('common:pdfExport.needsAttention'),
        notAnswered: t('common:pdfExport.notAnswered'),
        question: t('common:pdfExport.question'),
        response: t('common:pdfExport.response'),
        status: t('common:pdfExport.status'),
        page: t('common:pdfExport.page'),
        of: t('common:pdfExport.of'),
        confidential: t('common:pdfExport.confidential'),
        validationFeedback: t('common:pdfExport.validationFeedback'),
        area: t('common:pdfExport.area'),
      };
      await exportReportToPdf({
        projectName: currentProject.name,
        projectDescription: currentProject.description,
        riskClassification: currentProject.risk_classification,
        intendedPurpose: currentProject.intended_purpose,
        intendedUsers: currentProject.intended_users,
        deploymentContext: currentProject.deployment_context,
        frameworkName: currentFramework.name,
        checklist,
        comments,
        validations,
        language: i18n.language,
        labels,
      });
    } finally {
      setIsExporting(false);
    }
  }, [currentFramework, currentProject, checklist, comments, validations, t, i18n.language]);

  const pageTitle = currentFramework
    ? `${t('reporting.title')} > ${currentFramework.name}`
    : t('reporting.title');

  return (
    <div className="flex h-svh flex-col">
      <PageHeader title={pageTitle} debugSection="reporting" debugRefreshKey={debugRefreshKey}>
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
                <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting}>
                  {isExporting ? (
                    <Loader2 className="mr-1 size-4 animate-spin" />
                  ) : (
                    <Download className="mr-1 size-4" />
                  )}
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
