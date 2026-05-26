import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { NormaLogo } from '@/components/icons/norma-logo';
import {
  BookOpen,
  ChevronsUpDown,
  FileText,
  GitBranch,
  LayoutGrid,
  LogOut,
  MessageSquare,
  Plus,
  Plug,
  ScrollText,
  Settings,
  Shield,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { NewProjectDialog } from '@/components/new-project-dialog';
import { useAuth } from '@/hooks/use-auth';
import { useProject } from '@/hooks/use-project';
import { api } from '@/lib/api';

const NAV_GENERAL = [{ titleKey: 'chat', icon: MessageSquare, path: '/chat' }];

const NAV_PROJECT = [
  { titleKey: 'description', icon: BookOpen, path: '/description' },
  { titleKey: 'documents', icon: FileText, path: '/documents' },
  { titleKey: 'reporting', icon: ScrollText, path: '/reporting' },
];

const NAV_CONFIG = [
  { titleKey: 'integrations', icon: Plug, path: '/integrations' },
  { titleKey: 'frameworks', icon: Shield, path: '/frameworks' },
];

export function AppSidebar() {
  const { t } = useTranslation(['components', 'common']);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { projects, currentProject, setCurrentProject } = useProject();
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [hasGitHub, setHasGitHub] = useState(false);

  useEffect(() => {
    if (!currentProject) return;
    let cancelled = false;
    const check = () => {
      api
        .get(`/projects/${currentProject.id}/integrations`)
        .then(() => {
          if (!cancelled) setHasGitHub(true);
        })
        .catch(() => {
          if (!cancelled) setHasGitHub(false);
        });
    };
    check();
    window.addEventListener('integration-changed', check);
    return () => {
      cancelled = true;
      window.removeEventListener('integration-changed', check);
    };
  }, [currentProject]);

  const initials = user
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '';

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="pointer-events-none justify-center overflow-visible"
              >
                <NormaLogo className="!size-7 shrink-0" />
                <span
                  className="text-2xl font-medium group-data-[collapsible=icon]:hidden"
                  style={{ fontFamily: 'var(--font-logo)' }}
                >
                  Norma
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <SidebarMenuButton
                      size="lg"
                      className="data-[popup-open]:bg-sidebar-accent mt-1 h-14 border border-sidebar-border"
                    />
                  }
                >
                  <div className="bg-muted flex aspect-square size-8 items-center justify-center rounded-lg">
                    <LayoutGrid className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {currentProject?.name ?? t('sidebar.noProject')}
                    </span>
                    <span className="text-sidebar-foreground truncate text-xs">
                      {currentProject?.risk_classification
                        ? t(`common:risk.${currentProject.risk_classification}`)
                        : t('sidebar.selectProject')}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="min-w-56"
                  align="start"
                  side="bottom"
                  sideOffset={4}
                >
                  {projects.map((project) => (
                    <DropdownMenuItem
                      key={project.id}
                      onClick={() => setCurrentProject(project)}
                      className="truncate"
                    >
                      <span className="truncate">{project.name}</span>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setNewProjectOpen(true)}>
                    <Plus className="mr-2 size-4" />
                    {t('common:buttons.newProject')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{t('common:nav.general')}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV_GENERAL.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      isActive={location.pathname === item.path}
                      onClick={() => navigate(item.path)}
                      tooltip={t(`sidebar.${item.titleKey}`)}
                    >
                      <item.icon />
                      <span>{t(`sidebar.${item.titleKey}`)}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>{t('common:nav.project')}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV_PROJECT.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      isActive={location.pathname === item.path}
                      onClick={() => navigate(item.path)}
                      tooltip={t(`sidebar.${item.titleKey}`)}
                    >
                      <item.icon />
                      <span>{t(`sidebar.${item.titleKey}`)}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {currentProject && hasGitHub && (
            <SidebarGroup>
              <SidebarGroupLabel>{t('common:nav.github')}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={location.pathname === '/github'}
                      onClick={() => navigate('/github')}
                      tooltip={t('sidebar.github')}
                    >
                      <GitBranch />
                      <span>{t('sidebar.github')}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          <SidebarGroup>
            <SidebarGroupLabel>{t('common:nav.configuration')}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV_CONFIG.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      isActive={location.pathname === item.path}
                      onClick={() => navigate(item.path)}
                      tooltip={t(`sidebar.${item.titleKey}`)}
                    >
                      <item.icon />
                      <span>{t(`sidebar.${item.titleKey}`)}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <Separator className="bg-sidebar-border mx-0" />
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger render={<SidebarMenuButton size="lg" />}>
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name}</span>
                    <span className="text-sidebar-foreground truncate text-xs">{user?.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-56" align="end" side="top" sideOffset={4}>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 size-4" />
                    {t('sidebar.settings')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                  >
                    <LogOut className="mr-2 size-4" />
                    {t('sidebar.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <NewProjectDialog open={newProjectOpen} onOpenChange={setNewProjectOpen} />
    </>
  );
}
