import { NextResponse } from 'next/server'
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, WidthType, BorderStyle, ShadingType,
} from 'docx'
import { createClient } from '@/lib/supabase/server'
import { assembleCrf } from '@/features/crf/export/assembleCrf'
import { loadCrfData } from '@/features/crf/export/loadCrfData'

const BORDER = { style: BorderStyle.SINGLE, size: 1, color: 'BBBBBB' }
const CELL_BORDERS = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER }

function fmtDate(d: string | null): string {
  if (!d) return ''
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return d
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function labelCell(text: string, width: number) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: CELL_BORDERS,
    shading: { fill: 'F1F5F9', type: ShadingType.CLEAR, color: 'auto' },
    margins: { top: 40, bottom: 40, left: 100, right: 100 },
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, size: 18, color: '475569' })] })],
  })
}

function valueCell(text: string, width: number) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: CELL_BORDERS,
    margins: { top: 40, bottom: 40, left: 100, right: 100 },
    children: [new Paragraph({ children: [new TextRun({ text: text || '', size: 18 })] })],
  })
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createClient()) as any
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await loadCrfData(supabase, id)
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const doc = assembleCrf(data.studyCode, data.values)

  const children: (Paragraph | Table)[] = []

  // Title
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [new TextRun({ text: 'CASE REPORT FORM', bold: true, size: 30, color: '0F172A' })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: `${data.studyCode}${doc ? ` · Template v${doc.version}` : ''}`, size: 20, color: '475569' })],
    }),
  )

  // Patient identity table
  const idWidth = 2340
  children.push(new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [idWidth, idWidth, idWidth, idWidth],
    rows: [
      new TableRow({ children: [
        labelCell('Patient Name', idWidth), valueCell(data.patient.patient_name, idWidth),
        labelCell('Patient ID', idWidth), valueCell(data.patient.study_patient_id, idWidth),
      ] }),
      new TableRow({ children: [
        labelCell('Age / Sex', idWidth),
        valueCell(`${data.patient.age != null ? data.patient.age + ' yrs' : '—'}${data.patient.gender ? ' / ' + data.patient.gender : ''}`, idWidth),
        labelCell('Group', idWidth), valueCell(data.groupName ?? '—', idWidth),
      ] }),
      new TableRow({ children: [
        labelCell('CRF Status', idWidth), valueCell(data.validationStatus ?? 'In progress', idWidth),
        labelCell('Approved On', idWidth), valueCell(fmtDate(data.validatedAt) || '—', idWidth),
      ] }),
    ],
  }))
  children.push(new Paragraph({ spacing: { after: 200 }, children: [] }))

  if (doc) {
    doc.sections.forEach((section, si) => {
      if (section.blocks.length === 0) return

      children.push(new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 100 },
        children: [new TextRun({ text: `${si + 1}. ${section.title}`, bold: true, size: 22, color: '1E293B' })],
      }))

      for (const block of section.blocks) {
        if (block.kind === 'heading') {
          children.push(new Paragraph({
            spacing: { before: 120, after: 60 },
            children: [new TextRun({ text: block.text.toUpperCase(), bold: true, size: 17, color: '64748B' })],
          }))
          continue
        }

        if (block.kind === 'grid') {
          children.push(new Paragraph({
            spacing: { before: 100, after: 40 },
            children: [new TextRun({ text: block.label, bold: true, size: 18 })],
          }))
          const colCount = block.columns.length + 1
          const tableWidth = 9360
          const colW = Math.floor(tableWidth / colCount)
          const widths = Array(colCount).fill(colW)

          const headerRow = new TableRow({ children: [
            labelCell('Parameter', colW),
            ...block.columns.map((c) => labelCell(c, colW)),
          ] })
          const bodyRows = block.rows.map((row) => new TableRow({ children: [
            valueCell(row.header, colW),
            ...row.cells.map((cell) => valueCell(cell, colW)),
          ] }))

          children.push(new Table({
            width: { size: tableWidth, type: WidthType.DXA },
            columnWidths: widths,
            rows: [headerRow, ...bodyRows],
          }))
          children.push(new Paragraph({ spacing: { after: 100 }, children: [] }))
          continue
        }

        if (block.kind === 'choice') {
          // "Label:  Opt1   ✔ Opt2   Opt3"  — selected option bold + underlined
          const runs: TextRun[] = [new TextRun({ text: block.label + ':  ', size: 18, color: '475569' })]
          block.options.forEach((opt, oi) => {
            if (oi > 0) runs.push(new TextRun({ text: '    ', size: 18 }))
            runs.push(new TextRun({
              text: (opt.selected ? '☑ ' : '☐ ') + opt.label,
              size: 18,
              bold: opt.selected,
              underline: opt.selected ? {} : undefined,
              color: opt.selected ? '0F172A' : '94A3B8',
            }))
          })
          children.push(new Paragraph({ spacing: { after: 30 }, children: runs }))
          continue
        }

        // free-form field row: "Label: value"
        children.push(new Paragraph({
          spacing: { after: 30 },
          children: [
            new TextRun({ text: block.label + ':  ', size: 18, color: '475569' }),
            new TextRun({ text: block.value || '__________', size: 18, bold: !!block.value }),
          ],
        }))
      }
    })
  } else {
    children.push(new Paragraph({ children: [new TextRun({ text: `No template registered for ${data.studyCode}.`, size: 18 })] }))
  }

  const document = new Document({
    styles: { default: { document: { run: { font: 'Calibri', size: 18 } } } },
    sections: [{
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 } } },
      children,
    }],
  })

  const buffer = await Packer.toBuffer(document)
  const safeName = `${data.studyCode}_${data.patient.study_patient_id}`.replace(/[^a-zA-Z0-9_-]/g, '_')

  return new NextResponse(buffer as any, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="CRF_${safeName}.docx"`,
      'Cache-Control': 'no-store',
    },
  })
}
