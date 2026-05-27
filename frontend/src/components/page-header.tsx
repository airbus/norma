import { SidebarTrigger } from '@/components/ui/sidebar';
import { DebugContextDialog } from '@/components/debug-context-dialog';

interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
  debugSection?: string;
  debugRefreshKey?: string | number;
}

export function PageHeader({ title, children, debugSection, debugRefreshKey }: PageHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <h1 className="text-base font-medium">{title}</h1>
      <div className="ml-auto flex items-center gap-2">
        {children}
        <DebugContextDialog section={debugSection} refreshKey={debugRefreshKey} />
      </div>
    </header>
  );
}
