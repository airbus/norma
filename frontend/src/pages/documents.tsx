import { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, Circle, FileText, Loader2, Trash2, Upload } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/page-header';
import { RiskBanner } from '@/components/risk-banner';
import { useProject } from '@/hooks/use-project';
import { api, type CustomDocumentItem, type DocumentItem } from '@/lib/api';

export function DocumentsPage() {
  const { currentProject } = useProject();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [customDocs, setCustomDocs] = useState<CustomDocumentItem[]>([]);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [customUploading, setCustomUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!currentProject) return;
    let cancelled = false;
    api
      .get<DocumentItem[]>(`/projects/${currentProject.id}/documents`)
      .then((data) => {
        if (!cancelled) setDocuments(data);
      })
      .catch(() => {});
    api
      .get<CustomDocumentItem[]>(`/projects/${currentProject.id}/documents/custom`)
      .then((data) => {
        if (!cancelled) setCustomDocs(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [currentProject]);

  const grouped = useMemo(() => {
    const map = new Map<string, DocumentItem[]>();
    for (const doc of documents) {
      const list = map.get(doc.framework_name) ?? [];
      list.push(doc);
      map.set(doc.framework_name, list);
    }
    return map;
  }, [documents]);

  const frameworkKeys = useMemo(() => [...grouped.keys()], [grouped]);
  const defaultSet = useRef(false);
  const [activeTab, setActiveTab] = useState<string>('additional');

  useEffect(() => {
    if (frameworkKeys.length > 0 && !defaultSet.current) {
      defaultSet.current = true;
      setActiveTab(frameworkKeys.find((k) => k.includes('EU AI Act')) ?? frameworkKeys[0]);
    }
  }, [frameworkKeys]);

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

  const handleCustomUpload = async (file: File) => {
    if (!currentProject) return;
    setCustomUploading(true);
    try {
      const doc = await api.uploadFile<CustomDocumentItem>(
        `/projects/${currentProject.id}/documents/custom/upload`,
        file,
      );
      setCustomDocs((prev) => [doc, ...prev]);
    } catch {
      // ignore
    } finally {
      setCustomUploading(false);
    }
  };

  const handleCustomDelete = async (docId: string) => {
    if (!currentProject) return;
    setDeletingId(docId);
    try {
      await api.delete(`/projects/${currentProject.id}/documents/custom/${docId}`);
      setCustomDocs((prev) => prev.filter((d) => d.id !== docId));
    } catch {
      // ignore
    } finally {
      setDeletingId(null);
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

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 w-full justify-start">
              {frameworkKeys.map((name) => (
                <TabsTrigger key={name} value={name}>
                  {name}
                </TabsTrigger>
              ))}
              <TabsTrigger value="additional">Additional</TabsTrigger>
            </TabsList>

            {[...grouped.entries()].map(([framework, docs]) => {
              const uploadedCount = docs.filter((d) => d.uploaded).length;
              return (
                <TabsContent key={framework} value={framework}>
                  <div className="mb-3 flex items-center justify-between">
                    <Badge variant="outline">
                      {uploadedCount} of {docs.length} uploaded
                    </Badge>
                  </div>

                  <div className="overflow-hidden rounded-lg border">
                    <Table>
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
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-24 cursor-pointer"
                                disabled={uploadingId === doc.id}
                                onClick={() => {
                                  const input = document.createElement('input');
                                  input.type = 'file';
                                  input.accept = '.pdf';
                                  input.onchange = (e) => {
                                    const file = (e.target as HTMLInputElement).files?.[0];
                                    if (file) handleUpload(doc.id, file);
                                  };
                                  input.click();
                                }}
                              >
                                <Upload className="mr-1 size-3" />
                                {uploadingId === doc.id
                                  ? '...'
                                  : doc.uploaded
                                    ? 'Replace'
                                    : 'Upload'}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              );
            })}

            <TabsContent value="additional">
              <div className="mb-3 flex items-center justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  disabled={customUploading}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.pdf';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleCustomUpload(file);
                    };
                    input.click();
                  }}
                >
                  {customUploading ? (
                    <Loader2 className="mr-1 size-3 animate-spin" />
                  ) : (
                    <Upload className="mr-1 size-3" />
                  )}
                  {customUploading ? 'Uploading...' : 'Upload'}
                </Button>
              </div>

              {customDocs.length > 0 ? (
                <div className="overflow-hidden rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Document</TableHead>
                        <TableHead className="w-36">Uploaded</TableHead>
                        <TableHead className="w-10" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customDocs.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <FileText className="text-muted-foreground size-4 shrink-0" />
                              <div className="min-w-0">
                                <span className="text-sm font-medium">{doc.file_name}</span>
                                {doc.summary && (
                                  <p className="text-muted-foreground truncate text-xs">
                                    {doc.summary}
                                  </p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs">
                            {new Date(doc.uploaded_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <button
                              type="button"
                              onClick={() => handleCustomDelete(doc.id)}
                              disabled={deletingId === doc.id}
                              className="text-muted-foreground hover:text-destructive cursor-pointer rounded p-1 transition-colors disabled:opacity-50"
                              title="Delete document"
                            >
                              {deletingId === doc.id ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <Trash2 className="size-4" />
                              )}
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-muted-foreground rounded-lg border border-dashed py-8 text-center text-sm">
                  No additional documents uploaded yet. Upload any PDF to include it in your project
                  context.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
