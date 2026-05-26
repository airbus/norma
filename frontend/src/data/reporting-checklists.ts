import type { ChecklistArea } from './reporting-checklist';
import { REPORTING_CHECKLIST } from './reporting-checklist';
import { UNDP_CHECKLIST } from './reporting-undp';
import { ENVIRONMENTAL_CHECKLIST } from './reporting-environmental';

export const FRAMEWORK_CHECKLISTS: Record<string, ChecklistArea[]> = {
  'EU AI Act': REPORTING_CHECKLIST,
  'UNDP Human Rights Assessment': UNDP_CHECKLIST,
  'Environmental Impact Framework': ENVIRONMENTAL_CHECKLIST,
};
