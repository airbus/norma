import { useCallback, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/page-header';
import { RiskBanner } from '@/components/risk-banner';
import { SectionPanel } from '@/components/questionnaire/section-panel';
import { useProject } from '@/hooks/use-project';
import { QUESTIONNAIRE_SECTIONS } from '@/data/questionnaire';

export function DescriptionPage() {
  const { currentProject, updateProject, evaluateRisk } = useProject();
  const [localAnswers, setLocalAnswers] = useState<Record<string, string | string[]> | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const answers = localAnswers ?? currentProject?.questionnaire_answers ?? {};
  const pendingEvalRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const saveField = useCallback(
    (field: string, value: string) => {
      if (!currentProject) return;
      setEvaluating(true);
      updateProject(currentProject.id, { [field]: value }).finally(() => setEvaluating(false));
    },
    [currentProject, updateProject],
  );

  function handleAnswerChange(questionId: string, value: string | string[]) {
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
  }

  function handleReEvaluate() {
    if (!currentProject) return;
    setEvaluating(true);
    evaluateRisk(currentProject.id).finally(() => setEvaluating(false));
  }

  if (!currentProject) {
    return (
      <div className="flex h-svh flex-col">
        <PageHeader title="Description" />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Select or create a project to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-svh flex-col">
      <PageHeader title="Description" />

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-4xl">
          <RiskBanner
            riskClassification={currentProject.risk_classification}
            description="This system requires full compliance with AI Act obligations before market placement."
            chatMessage="Tell me about my project's risk classification"
            evaluating={evaluating}
            onReEvaluate={handleReEvaluate}
          />
          <Tabs defaultValue="overview">
            <TabsList className="mb-6 w-full justify-start">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              {QUESTIONNAIRE_SECTIONS.map((section) => (
                <TabsTrigger key={section.id} value={section.id}>
                  {section.title}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Summary</CardTitle>
                    <CardDescription>Basic information about the AI system.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        defaultValue={currentProject.name}
                        onBlur={(e) => saveField('name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        defaultValue={currentProject.description}
                        onBlur={(e) => saveField('description', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Intended Purpose</CardTitle>
                    <CardDescription>What is the system designed to do?</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      defaultValue={currentProject.intended_purpose}
                      onBlur={(e) => saveField('intended_purpose', e.target.value)}
                      rows={4}
                      placeholder="Describe the intended purpose of the AI system..."
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Intended Users</CardTitle>
                    <CardDescription>
                      Who will operate or be affected by this system?
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      defaultValue={currentProject.intended_users}
                      onBlur={(e) => saveField('intended_users', e.target.value)}
                      rows={4}
                      placeholder="Describe the intended users and affected persons..."
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Deployment Context</CardTitle>
                    <CardDescription>Where and how will the system be deployed?</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      defaultValue={currentProject.deployment_context}
                      onBlur={(e) => saveField('deployment_context', e.target.value)}
                      rows={4}
                      placeholder="Describe the deployment context, sector, and geographic scope..."
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

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
