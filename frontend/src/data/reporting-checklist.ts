import type { TFunction } from 'i18next';

export interface ChecklistItem {
  code: string;
  title: string;
  questions: string[];
}

export interface ChecklistArea {
  id: string;
  title: string;
  article: string;
  items: ChecklistItem[];
}

interface AreaDef {
  id: string;
  article: string;
  codes: string[];
}

const AREA_DEFS: AreaDef[] = [
  {
    id: 'cybersecurity',
    article: 'Article 15',
    codes: [
      'CYB-01',
      'CYB-02',
      'CYB-03',
      'CYB-04',
      'CYB-05',
      'CYB-06',
      'CYB-07',
      'CYB-08',
      'CYB-09',
      'CYB-10',
      'CYB-11',
    ],
  },
  {
    id: 'documentation',
    article: 'Article 11, Annex IV',
    codes: Array.from({ length: 45 }, (_, i) => `MG${String(i + 1).padStart(2, '0')}`),
  },
  {
    id: 'qms',
    article: 'Article 17',
    codes: Array.from({ length: 16 }, (_, i) => `QMS-${String(i + 1).padStart(2, '0')}`),
  },
  {
    id: 'incidents',
    article: 'Article 73',
    codes: ['M-INC-01', 'M-INC-02', 'M-INC-03', 'M-INC-04', 'M-INC-05'],
  },
  {
    id: 'risk-management',
    article: 'Article 9',
    codes: Array.from({ length: 14 }, (_, i) => `MG${String(i + 1).padStart(2, '0')}`),
  },
  {
    id: 'data-governance',
    article: 'Article 10',
    codes: Array.from({ length: 18 }, (_, i) => `MG${String(i + 1).padStart(2, '0')}`),
  },
  {
    id: 'accuracy',
    article: 'Article 15',
    codes: Array.from({ length: 14 }, (_, i) => `MG${String(i + 1).padStart(2, '0')}`),
  },
  {
    id: 'records',
    article: 'Article 12',
    codes: Array.from({ length: 16 }, (_, i) => `MG${String(i + 1).padStart(2, '0')}`),
  },
  {
    id: 'robustness',
    article: 'Article 15',
    codes: Array.from({ length: 16 }, (_, i) => `MG${String(i + 1).padStart(2, '0')}`),
  },
  {
    id: 'oversight',
    article: 'Article 14',
    codes: Array.from({ length: 8 }, (_, i) => `MG${String(i + 1).padStart(2, '0')}`),
  },
  {
    id: 'transparency',
    article: 'Article 13',
    codes: Array.from({ length: 16 }, (_, i) => `MG${String(i + 1).padStart(2, '0')}`),
  },
  {
    id: 'surveillance',
    article: 'Article 72',
    codes: Array.from({ length: 13 }, (_, i) => `MG${String(i + 1).padStart(2, '0')}`),
  },
];

export function getReportingChecklist(t: TFunction): ChecklistArea[] {
  return AREA_DEFS.map((area) => ({
    id: area.id,
    title: t(`reportingChecklist.areas.${area.id}.title`, { ns: 'data' }),
    article: area.article,
    items: area.codes.map((code) => {
      const item = t(`reportingChecklist.areas.${area.id}.items.${code}`, {
        ns: 'data',
        returnObjects: true,
      }) as { title: string; questions: string[] };
      return {
        code,
        title: item.title,
        questions: item.questions,
      };
    }),
  }));
}
