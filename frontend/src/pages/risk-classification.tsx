import { useCallback, useRef, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AskNormaButton } from '@/components/ask-norma-button';
import { PageHeader } from '@/components/page-header';
import { RiskBanner } from '@/components/risk-banner';
import { SectionPanel } from '@/components/questionnaire/section-panel';
import { useProject } from '@/hooks/use-project';
import { QUESTIONNAIRE_SECTIONS } from '@/data/questionnaire';

export function RiskClassificationPage() {
  const { currentProject, updateProject, evaluateRisk } = useProject();
  const [localAnswers, setLocalAnswers] = useState<Record<string, string | string[]> | null>(null);
  const [evaluating, setEvaluating] = useState(false);
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
        <PageHeader title="Description > Risk Classification">
          <AskNormaButton question="Explain my project's risk classification under the EU AI Act" />
        </PageHeader>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Select or create a project to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-svh flex-col">
      <PageHeader title="Description > Risk Classification">
        <AskNormaButton question="Explain my project's risk classification under the EU AI Act" />
      </PageHeader>

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-4xl">
          <RiskBanner
            riskClassification={currentProject.risk_classification}
            description="This system requires full compliance with AI Act obligations before market placement."
            evaluating={evaluating}
            onReEvaluate={handleReEvaluate}
          />
          <Tabs defaultValue={QUESTIONNAIRE_SECTIONS[0].id}>
            <TabsList className="mb-6 w-full justify-start">
              {QUESTIONNAIRE_SECTIONS.map((section) => (
                <TabsTrigger key={section.id} value={section.id}>
                  {section.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {QUESTIONNAIRE_SECTIONS.map((section) => (
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
