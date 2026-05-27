import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { ChecklistArea } from '@/data/reporting-checklist';
import type { ValidationResult } from '@/components/reporting/checklist-panel';

export interface PdfLabels {
  reportTitle: string;
  generatedOn: string;
  projectOverview: string;
  projectName: string;
  description: string;
  riskClassification: string;
  intendedPurpose: string;
  intendedUsers: string;
  deploymentContext: string;
  framework: string;
  completionSummary: string;
  totalQuestions: string;
  answered: string;
  covered: string;
  needsAttention: string;
  notAnswered: string;
  question: string;
  response: string;
  status: string;
  page: string;
  of: string;
  confidential: string;
  validationFeedback: string;
  area: string;
}

export interface PdfExportOptions {
  projectName: string;
  projectDescription: string;
  riskClassification: string;
  intendedPurpose: string;
  intendedUsers: string;
  deploymentContext: string;
  frameworkName: string;
  checklist: ChecklistArea[];
  comments: Record<string, string>;
  validations: Record<string, ValidationResult>;
  language: string;
  labels: PdfLabels;
}

interface AreaStats {
  title: string;
  article: string;
  total: number;
  answered: number;
  covered: number;
  needsAttention: number;
}

interface Stats {
  total: number;
  answered: number;
  covered: number;
  needsAttention: number;
  perArea: AreaStats[];
}

const MARGIN = 20;
const HEADER_HEIGHT = 15;
const FOOTER_HEIGHT = 12;
const PAGE_WIDTH = 210;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const ACCENT = [37, 99, 235] as const; // blue-600
const LIGHT_BG = [248, 250, 252] as const; // slate-50

function computeStats(
  checklist: ChecklistArea[],
  comments: Record<string, string>,
  validations: Record<string, ValidationResult>,
): Stats {
  let total = 0;
  let answered = 0;
  let covered = 0;
  let needsAttention = 0;
  const perArea: AreaStats[] = [];

  for (const area of checklist) {
    let aTotal = 0;
    let aAnswered = 0;
    let aCovered = 0;
    let aNeedsAttention = 0;

    for (const item of area.items) {
      for (let idx = 0; idx < item.questions.length; idx++) {
        const key = `${area.id}-${item.code}-${idx}`;
        aTotal++;
        if (comments[key]?.trim()) {
          aAnswered++;
          const v = validations[key];
          if (v) {
            if (v.covered) aCovered++;
            else aNeedsAttention++;
          }
        }
      }
    }

    total += aTotal;
    answered += aAnswered;
    covered += aCovered;
    needsAttention += aNeedsAttention;
    perArea.push({
      title: area.title,
      article: area.article,
      total: aTotal,
      answered: aAnswered,
      covered: aCovered,
      needsAttention: aNeedsAttention,
    });
  }

  return { total, answered, covered, needsAttention, perArea };
}

function formatDate(language: string): string {
  return new Intl.DateTimeFormat(language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());
}

function percent(n: number, total: number): string {
  if (total === 0) return '0%';
  return `${Math.round((n / total) * 100)}%`;
}

function addCoverPage(doc: jsPDF, options: PdfExportOptions, stats: Stats): void {
  const { labels } = options;
  const dateStr = formatDate(options.language);

  let y = 50;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(ACCENT[0], ACCENT[1], ACCENT[2]);
  doc.text(options.frameworkName, MARGIN, y);
  y += 12;

  doc.setFontSize(18);
  doc.setTextColor(100, 100, 100);
  doc.text(labels.reportTitle, MARGIN, y);
  y += 20;

  doc.setDrawColor(ACCENT[0], ACCENT[1], ACCENT[2]);
  doc.setLineWidth(0.8);
  doc.line(MARGIN, y, MARGIN + CONTENT_WIDTH, y);
  y += 15;

  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.setFont('helvetica', 'normal');

  const infoLines = [
    [labels.projectName, options.projectName],
    [labels.riskClassification, options.riskClassification],
    [labels.generatedOn, dateStr],
  ];

  for (const [label, value] of infoLines) {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, MARGIN, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value, MARGIN + 50, y);
    y += 7;
  }

  y += 10;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(30, 30, 30);
  doc.text(labels.projectOverview, MARGIN, y);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);

  const overviewFields = [
    [labels.description, options.projectDescription],
    [labels.intendedPurpose, options.intendedPurpose],
    [labels.intendedUsers, options.intendedUsers],
    [labels.deploymentContext, options.deploymentContext],
  ];

  for (const [label, value] of overviewFields) {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, MARGIN, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(value, CONTENT_WIDTH);
    doc.text(lines, MARGIN, y);
    y += lines.length * 4.5 + 4;
  }

  y += 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(30, 30, 30);
  doc.text(labels.completionSummary, MARGIN, y);
  y += 10;

  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    head: [
      [labels.area, labels.totalQuestions, labels.answered, labels.covered, labels.needsAttention],
    ],
    body: stats.perArea.map((a) => [
      `${a.title} (${a.article})`,
      String(a.total),
      `${a.answered} (${percent(a.answered, a.total)})`,
      `${a.covered} (${percent(a.covered, a.total)})`,
      `${a.needsAttention} (${percent(a.needsAttention, a.total)})`,
    ]),
    foot: [
      [
        'Total',
        String(stats.total),
        `${stats.answered} (${percent(stats.answered, stats.total)})`,
        `${stats.covered} (${percent(stats.covered, stats.total)})`,
        `${stats.needsAttention} (${percent(stats.needsAttention, stats.total)})`,
      ],
    ],
    headStyles: {
      fillColor: [ACCENT[0], ACCENT[1], ACCENT[2]],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
    },
    bodyStyles: { fontSize: 8, textColor: [50, 50, 50] },
    footStyles: {
      fillColor: [LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2]],
      textColor: [30, 30, 30],
      fontStyle: 'bold',
      fontSize: 8,
    },
    alternateRowStyles: { fillColor: [LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2]] },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 22, halign: 'center' },
      2: { cellWidth: 30, halign: 'center' },
      3: { cellWidth: 30, halign: 'center' },
      4: { cellWidth: 28, halign: 'center' },
    },
  });
}

function getStatusText(
  validation: ValidationResult | undefined,
  hasComment: boolean,
  labels: PdfLabels,
): string {
  if (!hasComment) return `— ${labels.notAnswered}`;
  if (!validation) return '—';
  return validation.covered ? labels.covered : labels.needsAttention;
}

function addAreaContent(
  doc: jsPDF,
  area: ChecklistArea,
  comments: Record<string, string>,
  validations: Record<string, ValidationResult>,
  labels: PdfLabels,
): void {
  doc.addPage();

  let y = MARGIN + HEADER_HEIGHT + 5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(ACCENT[0], ACCENT[1], ACCENT[2]);
  doc.text(`${area.title}`, MARGIN, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(130, 130, 130);
  doc.text(area.article, MARGIN + doc.getTextWidth(area.title + '  ') + 4, y);
  y += 10;

  for (const item of area.items) {
    const tableBody: (string | { content: string; styles: object })[][] = [];

    for (let idx = 0; idx < item.questions.length; idx++) {
      const key = `${area.id}-${item.code}-${idx}`;
      const comment = comments[key]?.trim() ?? '';
      const validation = validations[key];
      const status = getStatusText(validation, !!comment, labels);

      tableBody.push([item.questions[idx], comment || '—', status]);

      if (validation?.feedback) {
        tableBody.push([
          {
            content: `${labels.validationFeedback}: ${validation.feedback}`,
            styles: {
              fontStyle: 'italic',
              textColor: [100, 100, 100],
              fontSize: 7,
              fillColor: [LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2]],
            },
          },
          '',
          '',
        ]);
      }
    }

    autoTable(doc, {
      startY: y,
      margin: { left: MARGIN, right: MARGIN, bottom: MARGIN + FOOTER_HEIGHT },
      head: [[{ content: `${item.code} — ${item.title}`, colSpan: 3, styles: { halign: 'left' } }]],
      body: tableBody,
      headStyles: {
        fillColor: [50, 55, 70],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
      },
      bodyStyles: { fontSize: 8, textColor: [50, 50, 50], cellPadding: 3 },
      alternateRowStyles: { fillColor: [LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2]] },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 80 },
        2: { cellWidth: 30, halign: 'center' },
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 2) {
          const text = String(data.cell.raw);
          if (text === labels.covered) {
            data.cell.styles.textColor = [22, 163, 74]; // green-600
            data.cell.styles.fontStyle = 'bold';
          } else if (text === labels.needsAttention) {
            data.cell.styles.textColor = [217, 119, 6]; // amber-600
            data.cell.styles.fontStyle = 'bold';
          }
        }
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 8;
  }
}

function addHeadersAndFooters(doc: jsPDF, options: PdfExportOptions): void {
  const { labels } = options;
  const dateStr = formatDate(options.language);
  const totalPages = doc.getNumberOfPages();

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    if (i > 1) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(ACCENT[0], ACCENT[1], ACCENT[2]);
      doc.text(`${options.frameworkName} — ${labels.reportTitle}`, MARGIN, 12);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(options.projectName, PAGE_WIDTH - MARGIN, 12, { align: 'right' });

      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.3);
      doc.line(MARGIN, 15, PAGE_WIDTH - MARGIN, 15);
    }

    const footerY = 297 - 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);

    doc.text(dateStr, MARGIN, footerY);
    doc.text(labels.confidential, PAGE_WIDTH / 2, footerY, { align: 'center' });
    doc.text(`${labels.page} ${i} ${labels.of} ${totalPages}`, PAGE_WIDTH - MARGIN, footerY, {
      align: 'right',
    });

    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, footerY - 3, PAGE_WIDTH - MARGIN, footerY - 3);
  }
}

export async function exportReportToPdf(options: PdfExportOptions): Promise<void> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  doc.setProperties({
    title: `${options.frameworkName} — ${options.labels.reportTitle} — ${options.projectName}`,
    subject: `Compliance report for ${options.projectName}`,
    author: options.projectName,
    creator: 'Norma',
  });

  const stats = computeStats(options.checklist, options.comments, options.validations);

  addCoverPage(doc, options, stats);

  for (const area of options.checklist) {
    addAreaContent(doc, area, options.comments, options.validations, options.labels);
  }

  addHeadersAndFooters(doc, options);

  const safeName = (s: string) => s.replace(/[^a-zA-Z0-9-_ ]/g, '').trim();
  const dateStr = new Date().toISOString().slice(0, 10);
  doc.save(`${safeName(options.projectName)}_${safeName(options.frameworkName)}_${dateStr}.pdf`);
}
