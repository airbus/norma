import type { TFunction } from 'i18next';
import type { ChecklistArea } from './reporting-checklist';
import { getReportingChecklist } from './reporting-checklist';
import { getUndpChecklist } from './reporting-undp';
import { getEnvironmentalChecklist } from './reporting-environmental';

export function getFrameworkChecklists(t: TFunction): Record<string, ChecklistArea[]> {
  return {
    'EU AI Act': getReportingChecklist(t),
    'UNDP Human Rights Assessment': getUndpChecklist(t),
    'Environmental Impact Framework': getEnvironmentalChecklist(t),
  };
}
