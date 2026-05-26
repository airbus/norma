import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/page-header';
import { RiskBanner } from '@/components/risk-banner';
import { ChecklistPanel } from '@/components/reporting/checklist-panel';
import { useProject } from '@/hooks/use-project';
import { getReportingChecklist } from '@/data/reporting-checklist';
import { api, type ReportingEvidence } from '@/lib/api';

export function ReportingPage() {
  const { t } = useTranslation(['pages', 'common', 'data']);
  const { currentProject } = useProject();
  const reportingChecklist = getReportingChecklist(t);
  const [comments, setComments] = useState<Record<string, string>>({});
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!currentProject) return;
    api
      .get<ReportingEvidence[]>(`/projects/${currentProject.id}/reporting`)
      .then((data) => {
        const map: Record<string, string> = {};
        for (const ev of data) {
          map[ev.item_key] = ev.comment;
        }
        setComments(map);
      })
      .catch(() => {});
  }, [currentProject]);

  const handleCommentChange = useCallback(
    (key: string, value: string) => {
      setComments((prev) => {
        const updated = { ...prev, [key]: value };
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => {
          if (!currentProject) return;
          const items = Object.entries(updated)
            .filter(([, v]) => v.trim() !== '')
            .map(([k, v]) => ({ item_key: k, comment: v }));
          if (items.length > 0) {
            api.put(`/projects/${currentProject.id}/reporting`, { items }).catch(() => {});
          }
        }, 1000);
        return updated;
      });
    },
    [currentProject],
  );

  return (
    <div className="flex h-svh flex-col">
      <PageHeader title={t('reporting.title')}>
        <Button variant="outline" size="sm" disabled>
          <Download className="mr-1 size-4" />
          {t('common:buttons.exportReport')}
        </Button>
      </PageHeader>

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-4xl">
          {currentProject && (
            <RiskBanner
              riskClassification={currentProject.risk_classification}
              description={t('reporting.riskBannerDesc')}
              chatMessage={t('reporting.riskBannerChat')}
            />
          )}

          <Tabs defaultValue={reportingChecklist[0].id}>
            <TabsList className="mb-6 w-full justify-start">
              {reportingChecklist.map((area) => (
                <TabsTrigger key={area.id} value={area.id}>
                  {area.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {reportingChecklist.map((area) => (
              <TabsContent key={area.id} value={area.id}>
                <ChecklistPanel
                  area={area}
                  comments={comments}
                  onCommentChange={handleCommentChange}
                  projectId={currentProject?.id ?? ''}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
