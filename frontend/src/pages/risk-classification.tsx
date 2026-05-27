import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AskNormaButton } from '@/components/ask-norma-button';
import { PageHeader } from '@/components/page-header';
import { RiskBanner } from '@/components/risk-banner';
import { SectionPanel } from '@/components/questionnaire/section-panel';
import { useProject } from '@/hooks/use-project';
import { getQuestionnaireSections } from '@/data/questionnaire';

export function RiskClassificationPage() {
  const { t } = useTranslation(['pages', 'common', 'data']);
  const { currentProject, updateProject, evaluateRisk } = useProject();
  const [localAnswers, setLocalAnswers] = useState<Record<string, string | string[]> | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const questionnaireSections = getQuestionnaireSections(t);
  const answers = localAnswers ?? currentProject?.questionnaire_answers ?? {};
  const pendingEvalRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleAnswerChange = useCallback(
    (questionId: string, value: string | string[]) => {
      const updated = { ...answers, [questionId]: value };
      setLocalAnswers(updated);
      if (!currentProject) return;

      clearTimeout(pendingEvalRef.current);
      pendingEvalRef.current = setTimeout(() => {
        setEvaluating(true);
        updateProject(currentProject.id, { questionnaire_answers: updated }).finally(() =>
          setEvaluating(false),
        );
      }, 1000);
    },
    [answers, currentProject, updateProject],
  );

  function handleReEvaluate() {
    if (!currentProject) return;
    setEvaluating(true);
    evaluateRisk(currentProject.id).finally(() => setEvaluating(false));
  }

  if (!currentProject) {
    return (
      <div className="flex h-svh flex-col">
        <PageHeader
          debugSection="overview"
          title={
            t('description.title') + ' > ' + t('sidebar.riskClassification', { ns: 'components' })
          }
        >
          <AskNormaButton question={t('riskClassification.askNormaQuestion')} />
        </PageHeader>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">{t('description.noProject')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-svh flex-col">
      <PageHeader
        debugSection="overview"
        title={
          t('description.title') + ' > ' + t('sidebar.riskClassification', { ns: 'components' })
        }
      >
        <AskNormaButton question={t('riskClassification.askNormaQuestion')} />
      </PageHeader>

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-4xl">
          <RiskBanner
            riskClassification={currentProject.risk_classification}
            description={t('description.riskBannerDesc')}
            evaluating={evaluating}
            onReEvaluate={handleReEvaluate}
          />
          <Tabs defaultValue={questionnaireSections[0]?.id}>
            <TabsList className="mb-6 w-full justify-start">
              {questionnaireSections.map((section) => (
                <TabsTrigger key={section.id} value={section.id}>
                  {section.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {questionnaireSections.map((section) => (
              <TabsContent key={section.id} value={section.id}>
                <SectionPanel
                  section={section}
                  answers={answers}
                  onAnswerChange={handleAnswerChange}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
