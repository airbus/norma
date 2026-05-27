import type { TFunction } from 'i18next';
import type { ChecklistArea } from './reporting-checklist';

interface AreaDef {
  id: string;
  article: string;
  codes: string[];
}

const AREA_DEFS: AreaDef[] = [
  {
    id: 'env-energy-carbon',
    article: 'Principle 1–2',
    codes: ['EC-01', 'EC-02', 'EC-03', 'EC-04', 'EC-05', 'EC-06'],
  },
  {
    id: 'env-hardware',
    article: 'Principle 3',
    codes: ['HW-01', 'HW-02', 'HW-03', 'HW-04', 'HW-05'],
  },
  {
    id: 'env-data-management',
    article: 'Principle 4',
    codes: ['DM-01', 'DM-02', 'DM-03', 'DM-04'],
  },
  {
    id: 'env-model-efficiency',
    article: 'Principle 5',
    codes: ['ME-01', 'ME-02', 'ME-03', 'ME-04', 'ME-05'],
  },
  {
    id: 'env-lifecycle',
    article: 'Principle 3, 6',
    codes: ['LC-01', 'LC-02', 'LC-03', 'LC-04'],
  },
  {
    id: 'env-monitoring',
    article: 'Principle 6',
    codes: ['EM-01', 'EM-02', 'EM-03', 'EM-04', 'EM-05'],
  },
];

export function getEnvironmentalChecklist(t: TFunction): ChecklistArea[] {
  return AREA_DEFS.map((area) => ({
    id: area.id,
    title: t(`environmentalChecklist.areas.${area.id}.title`, { ns: 'data' }),
    article: area.article,
    items: area.codes.map((code) => {
      const item = t(`environmentalChecklist.areas.${area.id}.items.${code}`, {
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
