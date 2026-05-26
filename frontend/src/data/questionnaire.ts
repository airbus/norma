import type { TFunction } from 'i18next';

export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  text: string;
  helperText?: string;
  inputType: 'radio' | 'checkbox';
  options: QuestionOption[];
}

export interface QuestionnaireSection {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

interface SectionDef {
  id: string;
  questions: { id: string; inputType: 'radio' | 'checkbox'; optionValues: string[] }[];
}

const SECTION_DEFS: SectionDef[] = [
  {
    id: 'ai-system',
    questions: [
      { id: 'q1', inputType: 'radio', optionValues: ['yes', 'no', 'not-sure'] },
      { id: 'q2', inputType: 'radio', optionValues: ['yes', 'no'] },
    ],
  },
  {
    id: 'prohibited-practices',
    questions: [
      {
        id: 'q3',
        inputType: 'checkbox',
        optionValues: [
          'subliminal',
          'exploits-vulnerabilities',
          'social-scoring',
          'criminal-profiling',
          'facial-scraping',
          'emotion-inference',
          'biometric-categorisation',
          'realtime-facial',
          'none',
        ],
      },
    ],
  },
  {
    id: 'regulated-products',
    questions: [
      {
        id: 'q4',
        inputType: 'checkbox',
        optionValues: [
          'medical',
          'machinery',
          'toys',
          'lifts',
          'radio',
          'ppe',
          'aviation',
          'vehicles',
          'pressure',
          'none',
        ],
      },
      { id: 'q5', inputType: 'radio', optionValues: ['yes', 'no', 'not-sure'] },
    ],
  },
  {
    id: 'standalone-systems',
    questions: [
      {
        id: 'q6',
        inputType: 'checkbox',
        optionValues: [
          'biometrics',
          'infrastructure',
          'education',
          'employment',
          'essential-services',
          'law-enforcement',
          'migration',
          'justice',
          'none',
        ],
      },
      { id: 'q7', inputType: 'radio', optionValues: ['yes', 'no', 'both'] },
      { id: 'q8', inputType: 'radio', optionValues: ['yes', 'no', 'not-sure'] },
      {
        id: 'q9',
        inputType: 'checkbox',
        optionValues: ['procedural', 'improve-human', 'detect-patterns', 'preparatory', 'none'],
      },
    ],
  },
  {
    id: 'scope-context',
    questions: [
      { id: 'q10', inputType: 'radio', optionValues: ['yes', 'no', 'possibly'] },
      { id: 'q11', inputType: 'radio', optionValues: ['yes-bias', 'yes-other', 'no', 'not-sure'] },
      {
        id: 'q12',
        inputType: 'radio',
        optionValues: ['in-the-loop', 'on-the-loop', 'autonomous', 'not-designed'],
      },
      { id: 'q13', inputType: 'radio', optionValues: ['yes', 'no'] },
      { id: 'q14', inputType: 'radio', optionValues: ['yes', 'no'] },
    ],
  },
  {
    id: 'transparency',
    questions: [
      { id: 'q15', inputType: 'radio', optionValues: ['yes', 'no'] },
      { id: 'q16', inputType: 'radio', optionValues: ['yes', 'no'] },
      { id: 'q17', inputType: 'radio', optionValues: ['yes', 'no'] },
    ],
  },
];

export function getQuestionnaireSections(t: TFunction): QuestionnaireSection[] {
  return SECTION_DEFS.map((section) => ({
    id: section.id,
    title: t(`questionnaire.sections.${section.id}.title`, { ns: 'data' }),
    description: t(`questionnaire.sections.${section.id}.description`, { ns: 'data' }),
    questions: section.questions.map((q) => ({
      id: q.id,
      text: t(`questionnaire.sections.${section.id}.questions.${q.id}.text`, { ns: 'data' }),
      inputType: q.inputType,
      options: q.optionValues.map((val) => ({
        value: val,
        label: t(`questionnaire.sections.${section.id}.questions.${q.id}.options.${val}`, {
          ns: 'data',
        }),
      })),
    })),
  }));
}
