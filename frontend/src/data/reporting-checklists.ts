import type { TFunction } from 'i18next';
import type { ChecklistArea } from './reporting-checklist';
import { getReportingChecklist } from './reporting-checklist';
import { UNDP_CHECKLIST } from './reporting-undp';
import { ENVIRONMENTAL_CHECKLIST } from './reporting-environmental';

export function getFrameworkChecklists(t: TFunction): Record<string, ChecklistArea[]> {
  return {
    'EU AI Act': getReportingChecklist(t),
    'UNDP Human Rights Assessment': UNDP_CHECKLIST,
    'Environmental Impact Framework': ENVIRONMENTAL_CHECKLIST,
  };
}
