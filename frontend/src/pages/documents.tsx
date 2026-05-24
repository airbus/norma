import { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, Circle, Search, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PageHeader } from '@/components/page-header';
import { RiskBanner } from '@/components/risk-banner';
import { useProject } from '@/hooks/use-project';
import { api, type DocumentItem } from '@/lib/api';

export function DocumentsPage() {
  const { currentProject } = useProject();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [search, setSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!currentProject) return;
    let cancelled = false;
    api
      .get<DocumentItem[]>(`/projects/${currentProject.id}/documents`)
      .then((data) => {
        if (!cancelled) setDocuments(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [currentProject]);

  const filtered = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.description.toLowerCase().includes(search.toLowerCase()) ||
      doc.article.toLowerCase().includes(search.toLowerCase()),
  );

  const grouped = useMemo(() => {
    const map = new Map<string, DocumentItem[]>();
    for (const doc of filtered) {
      const list = map.get(doc.framework_name) ?? [];
      list.push(doc);
      map.set(doc.framework_name, list);
    }
    return map;
  }, [filtered]);

  const handleUpload = async (docId: string, file: File) => {
    if (!currentProject) return;
    setUploadingId(docId);
    try {
      const updated = await api.uploadFile<DocumentItem>(
        `/projects/${currentProject.id}/documents/${docId}/upload`,
        file,
      );
      setDocuments((prev) => prev.map((d) => (d.id === docId ? updated : d)));
    } catch {
      // ignore
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="flex h-svh flex-col">
      <PageHeader title="Documents" />

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {currentProject && (
            <RiskBanner
              riskClassification={currentProject.risk_classification}
              description="Documents required for regulatory compliance based on your risk classification."
              chatMessage="What documents are we missing for conformity assessment?"
            />
          )}
          <div className="relative">
            <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
            <Input
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {[...grouped.entries()].map(([framework, docs]) => {
            const uploadedCount = docs.filter((d) => d.uploaded).length;
            return (
              <div key={framework} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold">{framework}</h2>
                  <Badge variant="outline">
                    {uploadedCount} of {docs.length}
                  </Badge>
                </div>

                <div className="rounded-lg border overflow-hidden">
                  <Table className="overflow-hidden">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-8" />
                        <TableHead>Document</TableHead>
                        <TableHead className="w-24 text-right pr-6" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {docs.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell className="pr-0">
                            {doc.uploaded ? (
                              <CheckCircle2 className="size-4 text-primary" />
                            ) : (
                              <Circle className="size-4 text-muted-foreground/40" />
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{doc.name}</span>
                              {doc.article && (
                                <Badge variant="secondary" className="text-xs">
                                  {doc.article}
                                </Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground text-xs whitespace-normal">
                              {doc.description}
                            </p>
                          </TableCell>
                          <TableCell className="text-right pr-4">
                            <input
                              type="file"
                              ref={fileInputRef}
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleUpload(doc.id, file);
                                e.target.value = '';
                              }}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-24 cursor-pointer"
                              disabled={uploadingId === doc.id}
                              onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.onchange = (e) => {
                                  const file = (e.target as HTMLInputElement).files?.[0];
                                  if (file) handleUpload(doc.id, file);
                                };
                                input.click();
                              }}
                            >
                              <Upload className="mr-1 size-3" />
                              {uploadingId === doc.id ? '...' : doc.uploaded ? 'Replace' : 'Upload'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            );
          })}

          {grouped.size === 0 && (
            <p className="text-muted-foreground py-8 text-center text-sm">No documents found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
