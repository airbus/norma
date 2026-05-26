export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member';
  is_active: boolean;
  created_at: string;
  language_preference: string | null;
}

export interface Invite {
  id: string;
  token: string;
  email: string | null;
  role: string;
  created_at: string;
  expires_at: string;
  used_at: string | null;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  risk_classification: 'unacceptable' | 'high' | 'limited' | 'minimal';
  intended_purpose: string;
  intended_users: string;
  deployment_context: string;
  questionnaire_answers: Record<string, string | string[]> | null;
  created_at: string;
  updated_at: string;
}

export interface Framework {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'draft' | 'inactive';
  document_count: number;
  created_at: string;
}

export interface DocumentItem {
  id: string;
  project_id: string;
  definition_id: string;
  name: string;
  description: string;
  article: string;
  framework_name: string;
  framework_id: string;
  uploaded: boolean;
  file_name: string | null;
  summary: string | null;
  uploaded_at: string | null;
}

export interface CustomDocumentItem {
  id: string;
  project_id: string;
  file_name: string;
  summary: string | null;
  uploaded_at: string;
}

export interface ReportingEvidence {
  id: string;
  project_id: string;
  item_key: string;
  comment: string;
  updated_at: string;
}

export interface ChatSession {
  id: string;
  project_id: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface GitHubIntegration {
  id: string;
  project_id: string;
  provider: string;
  repo_owner: string;
  repo_name: string;
  github_project_number: number | null;
  summary: string | null;
  architecture_mermaid: string | null;
  sync_status: string;
  last_synced_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface GitHubTask {
  id: string;
  integration_id: string;
  github_id: number;
  title: string;
  body: string | null;
  status: string;
  assignees: string[] | null;
  labels: string[] | null;
  milestone: string | null;
  github_url: string;
  github_created_at: string | null;
  github_updated_at: string | null;
}

export interface ChatSessionDetail extends ChatSession {
  messages: ChatMessage[];
}

const TOKEN_KEY = 'norma-token';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

function getAuthHeadersNoContent(): HeadersInit {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: { ...getAuthHeaders(), ...options?.headers },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: 'Request failed' }));
    if (res.status === 401 && localStorage.getItem(TOKEN_KEY)) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = '/login';
    }
    let message: string;
    if (Array.isArray(body.detail)) {
      message = body.detail
        .map((e: { msg?: string }) => {
          const m = e.msg ?? String(e);
          return m.charAt(0).toUpperCase() + m.slice(1);
        })
        .join(', ');
    } else {
      message = body.detail || `HTTP ${res.status}`;
    }
    throw new Error(message);
  }

  return res.json();
}

export const api = {
  get: <T>(path: string) => apiFetch<T>(path),
  post: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),
  patch: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) => apiFetch<T>(path, { method: 'DELETE' }),

  uploadFile: async <T>(path: string, file: File): Promise<T> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`/api${path}`, {
      method: 'POST',
      headers: getAuthHeadersNoContent(),
      body: formData,
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(body.detail || `HTTP ${res.status}`);
    }
    return res.json();
  },
};
