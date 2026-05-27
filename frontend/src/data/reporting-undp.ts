import type { TFunction } from 'i18next';
import type { ChecklistArea } from './reporting-checklist';

interface AreaDef {
  id: string;
  article: string;
  codes: string[];
}

const AREA_DEFS: AreaDef[] = [
  {
    id: 'undp-zero-question',
    article: 'Phase 0',
    codes: ['ZQ-01', 'ZQ-02', 'ZQ-03', 'ZQ-04'],
  },
  {
    id: 'undp-org-readiness',
    article: 'Phase 1',
    codes: Array.from({ length: 28 }, (_, i) => `OR-${String(i + 1).padStart(2, '0')}`),
  },
  {
    id: 'undp-planning',
    article: 'Phase 2',
    codes: Array.from({ length: 19 }, (_, i) => `PS-${String(i + 1).padStart(2, '0')}`),
  },
  {
    id: 'undp-rights-mapping',
    article: 'Phase 2.3',
    codes: Array.from({ length: 36 }, (_, i) => `HRM-${String(i + 1).padStart(2, '0')}`),
  },
  {
    id: 'undp-data-diligence',
    article: 'Phase 3',
    codes: Array.from({ length: 22 }, (_, i) => `DD-${String(i + 1).padStart(2, '0')}`),
  },
  {
    id: 'undp-risk-analysis',
    article: 'Phase 4',
    codes: Array.from({ length: 12 }, (_, i) => `RA-${String(i + 1).padStart(2, '0')}`),
  },
  {
    id: 'undp-risk-management',
    article: 'Phase 5',
    codes: Array.from({ length: 15 }, (_, i) => `RMG-${String(i + 1).padStart(2, '0')}`),
  },
  {
    id: 'undp-monitoring',
    article: 'Phase 6',
    codes: Array.from({ length: 8 }, (_, i) => `MI-${String(i + 1).padStart(2, '0')}`),
  },
  {
    id: 'undp-framework-alignment',
    article: 'Phase 7',
    codes: Array.from({ length: 17 }, (_, i) => `FA-${String(i + 1).padStart(2, '0')}`),
  },
];

export function getUndpChecklist(t: TFunction): ChecklistArea[] {
  return AREA_DEFS.map((area) => ({
    id: area.id,
    title: t(`undpChecklist.areas.${area.id}.title`, { ns: 'data' }),
    article: area.article,
    items: area.codes.map((code) => {
      const item = t(`undpChecklist.areas.${area.id}.items.${code}`, {
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
