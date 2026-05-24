import { createContext, useContext } from 'react';
import type { Project } from '@/lib/api';

export interface ProjectContextValue {
  projects: Project[];
  currentProject: Project | null;
  setCurrentProject: (project: Project) => void;
  createProject: (data: {
    name: string;
    description: string;
    intended_purpose: string;
    intended_users: string;
    deployment_context: string;
    questionnaire_answers?: Record<string, string | string[]>;
  }) => Promise<Project>;
  updateProject: (id: string, data: Partial<Project>) => Promise<Project>;
  evaluateRisk: (id: string) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  refreshProjects: () => Promise<void>;
  loading: boolean;
}

export const ProjectContext = createContext<ProjectContextValue | null>(null);

export function useProject() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProject must be used within ProjectProvider');
  return ctx;
}
