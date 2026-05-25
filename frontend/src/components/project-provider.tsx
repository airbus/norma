import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { api, type Project } from '@/lib/api';
import { ProjectContext } from '@/hooks/use-project';
import { useAuth } from '@/hooks/use-auth';

export function ProjectProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProjects = useCallback(async () => {
    try {
      const data = await api.get<Project[]>('/projects');
      setProjects(data);
      if (data.length > 0 && !currentProject) {
        setCurrentProject(data[0]);
      } else if (currentProject) {
        const updated = data.find((p) => p.id === currentProject.id);
        if (updated) setCurrentProject(updated);
        else if (data.length > 0) setCurrentProject(data[0]);
        else setCurrentProject(null);
      }
    } catch {
      // auth may not be ready yet
    } finally {
      setLoading(false);
    }
  }, [currentProject]);

  useEffect(() => {
    if (!user) {
      setProjects([]);
      setCurrentProject(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    api
      .get<Project[]>('/projects')
      .then((data) => {
        if (cancelled) return;
        setProjects(data);
        if (data.length > 0) setCurrentProject(data[0]);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const createProject = useCallback(
    async (data: {
      name: string;
      description: string;
      intended_purpose: string;
      intended_users: string;
      deployment_context: string;
      questionnaire_answers?: Record<string, string | string[]>;
    }) => {
      const project = await api.post<Project>('/projects', data);
      setProjects((prev) => [...prev, project]);
      setCurrentProject(project);
      return project;
    },
    [],
  );

  const updateProject = useCallback(
    async (id: string, data: Partial<Project>) => {
      const project = await api.patch<Project>(`/projects/${id}`, data);
      setProjects((prev) => prev.map((p) => (p.id === id ? project : p)));
      if (currentProject?.id === id) setCurrentProject(project);
      return project;
    },
    [currentProject],
  );

  const evaluateRisk = useCallback(
    async (id: string) => {
      const project = await api.post<Project>(`/projects/${id}/evaluate-risk`);
      setProjects((prev) => prev.map((p) => (p.id === id ? project : p)));
      if (currentProject?.id === id) setCurrentProject(project);
      return project;
    },
    [currentProject],
  );

  const deleteProject = useCallback(
    async (id: string) => {
      await api.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (currentProject?.id === id) {
        const remaining = projects.filter((p) => p.id !== id);
        setCurrentProject(remaining[0] ?? null);
      }
    },
    [currentProject, projects],
  );

  return (
    <ProjectContext
      value={{
        projects,
        currentProject,
        setCurrentProject,
        createProject,
        updateProject,
        evaluateRisk,
        deleteProject,
        refreshProjects,
        loading,
      }}
    >
      {children}
    </ProjectContext>
  );
}
