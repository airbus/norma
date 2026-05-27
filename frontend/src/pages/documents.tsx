import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, Circle, FileText, Loader2, Trash2, Upload } from 'lucide-react';
import Markdown from 'react-markdown';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AskNormaButton } from '@/components/ask-norma-button';
import { PageHeader } from '@/components/page-header';
import { useProject } from '@/hooks/use-project';
import { api, type CustomDocumentItem, type DocumentItem, type Framework } from '@/lib/api';

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function DocumentsPage() {
  const { t } = useTranslation(['pages', 'common', 'data']);
  const { currentProject } = useProject();
  const { frameworkId } = useParams<{ frameworkId: string }>();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [customDocs, setCustomDocs] = useState<CustomDocumentItem[]>([]);
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [customUploading, setCustomUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewDoc, setViewDoc] = useState<{ name: string; summary: string | null } | null>(null);
  const redirected = useRef(false);

  useEffect(() => {
    api
      .get<Framework[]>('/frameworks')
      .then(setFrameworks)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!frameworkId && frameworks.length > 0 && !redirected.current) {
      redirected.current = true;
      navigate(`/documents/${frameworks[0].id}`, { replace: true });
    }
  }, [frameworkId, frameworks, navigate]);

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

  const isAdditional = frameworkId === 'additional';
  const currentFramework = frameworks.find((fw) => fw.id === frameworkId);
  const filteredDocs = documents.filter((d) => d.framework_id === frameworkId);
  const uploadedCount = filteredDocs.filter((d) => d.uploaded).length;

  const pageTitle = isAdditional
    ? t('documents.additional') + ' ' + t('documents.title')
    : currentFramework
      ? `${t('documents.title')} > ${currentFramework.name}`
      : t('documents.title');

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

  const handleRemoveUpload = async (docId: string) => {
    if (!currentProject) return;
    setDeletingId(docId);
    try {
      const updated = await api.delete<DocumentItem>(
        `/projects/${currentProject.id}/documents/${docId}/upload`,
      );
      setDocuments((prev) => prev.map((d) => (d.id === docId ? updated : d)));
    } catch {
      // ignore
    } finally {
      setDeletingId(null);
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
      <PageHeader title={pageTitle} debugSection="documents">
        {currentFramework ? (
          <AskNormaButton
            question={t('documents.askNormaQuestion', { framework: currentFramework.name })}
          />
        ) : isAdditional ? (
          <AskNormaButton question={t('documents.askNormaQuestionAdditional')} />
        ) : null}
      </PageHeader>

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {isAdditional ? (
            <>
              <div className="flex items-center justify-end">
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
                  {customUploading ? t('common:loading.uploading') : t('common:buttons.upload')}
                </Button>
              </div>

              {customDocs.length > 0 ? (
                <div className="overflow-hidden rounded-lg border">
                  <Table className="table-fixed">
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('common:table.document')}</TableHead>
                        <TableHead className="w-28">{t('common:table.uploaded')}</TableHead>
                        <TableHead className="w-10" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customDocs.map((doc) => (
                        <TableRow
                          key={doc.id}
                          className="cursor-pointer"
                          onClick={() =>
                            setViewDoc({ name: doc.file_name, summary: doc.summary })
                          }
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <FileText className="text-muted-foreground size-4 shrink-0" />
                              <div className="min-w-0">
                                <span className="text-sm font-medium">{doc.file_name}</span>
                                {doc.summary && (
                                  <p className="text-muted-foreground truncate text-xs">
                                    {doc.summary.replace(/[#*_~`>\-]/g, '').replace(/\s+/g, ' ').trim()}
                                  </p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground whitespace-nowrap text-xs">
                            {new Date(doc.uploaded_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="pr-4">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCustomDelete(doc.id);
                              }}
                              disabled={deletingId === doc.id}
                              className="text-muted-foreground hover:text-destructive cursor-pointer rounded p-1 transition-colors disabled:opacity-50"
                              title={t('documents.deleteDocument')}
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
                  {t('documents.noAdditionalDocs')}
                </div>
              )}
            </>
          ) : (
            <>
              {filteredDocs.length > 0 && (
                <div className="flex items-center justify-between">
                  <Badge variant="outline">
                    {t('documents.uploadedCount', {
                      count: uploadedCount,
                      total: filteredDocs.length,
                    })}
                  </Badge>
                </div>
              )}

              {filteredDocs.length > 0 ? (
                <div className="overflow-hidden rounded-lg border">
                  <Table className="table-fixed">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-8" />
                        <TableHead>{t('common:table.document')}</TableHead>
                        <TableHead className="w-36 pr-6 text-right" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDocs.map((doc) => (
                        <TableRow
                          key={doc.id}
                          className={doc.uploaded ? 'cursor-pointer' : ''}
                          onClick={() => {
                            if (doc.uploaded)
                              setViewDoc({
                                name: t(`documentDefinitions.${slugify(doc.name)}.name`, {
                                  ns: 'data',
                                  defaultValue: doc.name,
                                }),
                                summary: doc.summary,
                              });
                          }}
                        >
                          <TableCell className="pr-0">
                            {doc.uploaded ? (
                              <CheckCircle2 className="text-primary size-4" />
                            ) : (
                              <Circle className="text-muted-foreground/40 size-4" />
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {t(`documentDefinitions.${slugify(doc.name)}.name`, {
                                  ns: 'data',
                                  defaultValue: doc.name,
                                })}
                              </span>
                              {doc.article && (
                                <Badge variant="secondary" className="text-xs">
                                  {doc.article}
                                </Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground truncate text-xs">
                              {doc.summary
                                ? doc.summary.replace(/[#*_~`>\-]/g, '').replace(/\s+/g, ' ').trim()
                                : t(`documentDefinitions.${slugify(doc.name)}.description`, {
                                    ns: 'data',
                                    defaultValue: doc.description,
                                  })}
                            </p>
                          </TableCell>
                          <TableCell className="pr-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-24 cursor-pointer"
                                disabled={uploadingId === doc.id}
                                onClick={(e) => {
                                  e.stopPropagation();
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
                                    ? t('common:buttons.replace')
                                    : t('common:buttons.upload')}
                              </Button>
                              {doc.uploaded && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveUpload(doc.id);
                                  }}
                                  disabled={deletingId === doc.id}
                                  className="text-muted-foreground hover:text-destructive cursor-pointer rounded p-1 transition-colors disabled:opacity-50"
                                  title={t('documents.deleteDocument')}
                                >
                                  {deletingId === doc.id ? (
                                    <Loader2 className="size-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="size-4" />
                                  )}
                                </button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                currentFramework && (
                  <div className="text-muted-foreground rounded-lg border border-dashed py-8 text-center text-sm">
                    No documents defined for this framework yet.
                  </div>
                )
              )}
            </>
          )}
        </div>
      </div>

      <Dialog open={!!viewDoc} onOpenChange={(open) => !open && setViewDoc(null)}>
        <DialogContent className="h-[95vh] max-w-[95vw] sm:max-w-[95vw] overflow-hidden p-0">
          <DialogHeader className="border-b px-6 pt-6 pb-4">
            <DialogTitle>{viewDoc?.name}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[calc(95vh-5rem)] px-6 py-4">
            {viewDoc?.summary ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <Markdown>{viewDoc.summary.replace(/^-{3,}\s*$/gm, '')}</Markdown>
              </div>
            ) : (
              <p className="text-muted-foreground py-12 text-center">
                {t('documents.noSummaryAvailable')}
              </p>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
