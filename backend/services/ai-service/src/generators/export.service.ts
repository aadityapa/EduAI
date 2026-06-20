import { Injectable } from '@nestjs/common';
import type { GeneratedQuestion } from '@eduai/ai';

@Injectable()
export class ExportService {
  exportQuestionsPdf(
    subject: string,
    topic: string,
    questions: GeneratedQuestion[],
  ): Buffer {
    const lines = [
      `%PDF-1.4`,
      `1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj`,
      `2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj`,
    ];
    const textContent = [
      `EduAI Question Paper`,
      `Subject: ${subject}`,
      `Topic: ${topic}`,
      '',
      ...questions.flatMap((q, i) => [
        `Q${i + 1}. (${q.marks} marks) ${q.stem}`,
        ...(q.options?.map((o, j) => `   ${String.fromCharCode(65 + j)}. ${o.label}`) ?? []),
        '',
      ]),
    ].join('\\n');

    lines.push(
      `3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >> endobj`,
      `4 0 obj << /Length ${textContent.length + 50} >> stream`,
      `BT /F1 12 Tf 50 750 Td (${textContent.slice(0, 500).replace(/[()\\]/g, '')}) Tj ET`,
      `endstream endobj`,
      `xref`,
      `0 5`,
      `0000000000 65535 f`,
      `trailer << /Size 5 /Root 1 0 R >>`,
      `startxref`,
      `%%EOF`,
    );
    return Buffer.from(lines.join('\n'));
  }

  async exportQuestionsDocx(
    subject: string,
    topic: string,
    questions: GeneratedQuestion[],
  ): Promise<Buffer> {
    const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import('docx');

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({ text: 'EduAI Question Paper', heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: `Subject: ${subject}` }),
            new Paragraph({ text: `Topic: ${topic}` }),
            new Paragraph({ text: '' }),
            ...questions.flatMap((q, i) => [
              new Paragraph({
                children: [
                  new TextRun({ text: `Q${i + 1}. (${q.marks} marks) `, bold: true }),
                  new TextRun({ text: q.stem }),
                ],
              }),
              ...(q.options?.map(
                (o, j) =>
                  new Paragraph({
                    text: `   ${String.fromCharCode(65 + j)}. ${o.label}`,
                  }),
              ) ?? []),
              new Paragraph({ text: '' }),
            ]),
          ],
        },
      ],
    });

    return Packer.toBuffer(doc);
  }
}
