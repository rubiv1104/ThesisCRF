import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { APP_NAME } from '@/constants'
import { assembleCrf } from '@/features/crf/export/assembleCrf'
import { loadCrfData } from '@/features/crf/export/loadCrfData'
import { studyTitle, studyBatch, getStudyMeta, DEPARTMENT } from '@/features/crf/studyMeta'
import { PrintToolbar } from './PrintToolbar'

export const metadata = { title: `Print CRF | ${APP_NAME}` }

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ deid?: string }>
}

function fmtDate(d: string | null) {
  if (!d) return ''
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return d
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default async function PrintCrfPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const deid = (await searchParams).deid === '1'
  const supabase = (await createClient()) as any
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const data = await loadCrfData(supabase, id)
  if (!data) notFound()

  const displayName = deid ? data.patient.study_patient_id : data.patient.patient_name
  const doc = assembleCrf(data.studyCode, data.values)

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Print-only styling */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .crf-sheet { box-shadow: none !important; margin: 0 !important; max-width: 100% !important; }
          body { background: white !important; }
          .crf-section { break-inside: avoid; }
          .crf-grid { break-inside: avoid; }
        }
        @page { margin: 16mm; size: A4; }
      `}</style>

      <PrintToolbar patientId={id} docxHref={`/api/crf/${id}/docx${deid ? '?deid=1' : ''}`} deid={deid} />

      <div className="crf-sheet mx-auto my-6 max-w-[800px] bg-white p-10 shadow-md print:my-0">
        {/* Header */}
        <div className="mb-6 border-b-2 border-slate-800 pb-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{DEPARTMENT}</p>
          <h1 className="mt-1 text-lg font-bold uppercase tracking-wide text-slate-900">Case Report Form</h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm font-semibold text-slate-800">{studyTitle(data.studyCode)}</p>
          <p className="mt-1 text-xs text-slate-500">
            {data.studyCode} · {getStudyMeta(data.studyCode).scholar}{getStudyMeta(data.studyCode).scholar ? ' · ' : ''}Batch {studyBatch(data.studyCode)}
          </p>
          {(getStudyMeta(data.studyCode).iec || getStudyMeta(data.studyCode).ctri) && (
            <p className="mt-0.5 text-xs text-slate-500">
              {getStudyMeta(data.studyCode).iec && <>IEC No.: {getStudyMeta(data.studyCode).iec}</>}
              {getStudyMeta(data.studyCode).iec && getStudyMeta(data.studyCode).ctri ? '  ·  ' : ''}
              {getStudyMeta(data.studyCode).ctri && <>CTRI No.: {getStudyMeta(data.studyCode).ctri}</>}
            </p>
          )}
        </div>

        {/* Patient identity block */}
        <table className="mb-6 w-full border-collapse text-sm">
          <tbody>
            <tr>
              <td className="border border-slate-300 bg-slate-50 px-3 py-1.5 font-medium text-slate-600 w-1/4">{deid ? 'Patient ID' : 'Patient Name'}</td>
              <td className="border border-slate-300 px-3 py-1.5 text-slate-900">{displayName}</td>
              <td className="border border-slate-300 bg-slate-50 px-3 py-1.5 font-medium text-slate-600 w-1/4">Patient ID</td>
              <td className="border border-slate-300 px-3 py-1.5 text-slate-900">{data.patient.study_patient_id}</td>
            </tr>
            <tr>
              <td className="border border-slate-300 bg-slate-50 px-3 py-1.5 font-medium text-slate-600">Age / Sex</td>
              <td className="border border-slate-300 px-3 py-1.5 text-slate-900">
                {data.patient.age != null ? `${data.patient.age} yrs` : '—'}{data.patient.gender ? ` / ${data.patient.gender}` : ''}
              </td>
              <td className="border border-slate-300 bg-slate-50 px-3 py-1.5 font-medium text-slate-600">Group</td>
              <td className="border border-slate-300 px-3 py-1.5 text-slate-900">{data.groupName ?? '—'}</td>
            </tr>
            <tr>
              <td className="border border-slate-300 bg-slate-50 px-3 py-1.5 font-medium text-slate-600">CRF Status</td>
              <td className="border border-slate-300 px-3 py-1.5 capitalize text-slate-900">{data.validationStatus ?? 'In progress'}</td>
              <td className="border border-slate-300 bg-slate-50 px-3 py-1.5 font-medium text-slate-600">Approved On</td>
              <td className="border border-slate-300 px-3 py-1.5 text-slate-900">{fmtDate(data.validatedAt) || '—'}</td>
            </tr>
          </tbody>
        </table>

        {!doc ? (
          <p className="text-sm text-slate-500">No printable template registered for {data.studyCode}.</p>
        ) : (
          <div className="space-y-6">
            {doc.sections.map((section, si) => {
              if (section.blocks.length === 0) return null
              return (
                <div key={section.key} className="crf-section">
                  <h2 className="mb-2 border-b border-slate-300 pb-1 text-sm font-bold text-slate-800">
                    {si + 1}. {section.title}
                  </h2>
                  <div className="space-y-1.5">
                    {section.blocks.map((block, bi) => {
                      if (block.kind === 'heading') {
                        return <p key={bi} className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{block.text}</p>
                      }
                      if (block.kind === 'grid') {
                        return (
                          <div key={bi} className="crf-grid my-2 overflow-x-auto">
                            <p className="mb-1 text-xs font-medium text-slate-700">{block.label}</p>
                            <table className="w-full border-collapse text-xs">
                              <thead>
                                <tr className="bg-slate-100">
                                  <th className="border border-slate-300 px-2 py-1 text-left font-medium text-slate-600">Parameter</th>
                                  {block.columns.map((col) => (
                                    <th key={col} className="border border-slate-300 px-2 py-1 text-center font-medium text-slate-600">{col}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {block.rows.map((row) => (
                                  <tr key={row.header}>
                                    <td className="border border-slate-300 px-2 py-1 text-slate-700">{row.header}</td>
                                    {row.cells.map((cell, ci) => (
                                      <td key={ci} className="border border-slate-300 px-2 py-1 text-center text-slate-900">{cell || ''}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )
                      }
                      if (block.kind === 'choice') {
                        return (
                          <div key={bi} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
                            <span className="text-slate-600">{block.label}:</span>
                            {block.options.map((opt, oi) => (
                              <span
                                key={oi}
                                className={opt.selected ? 'font-semibold text-slate-900 underline' : 'text-slate-400'}
                              >
                                {opt.selected ? '☑' : '☐'} {opt.label}
                              </span>
                            ))}
                          </div>
                        )
                      }
                      // free-form field row
                      return (
                        <div key={bi} className="flex gap-3 text-sm">
                          <span className="w-1/2 shrink-0 text-slate-600">{block.label}</span>
                          <span className="flex-1 border-b border-dotted border-slate-300 font-medium text-slate-900">
                            {block.value || ' '}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Signatories */}
        <div className="crf-section mt-12 grid grid-cols-2 gap-8">
          <div className="text-center">
            <div className="mt-8 border-t border-slate-400 pt-1 text-sm font-medium text-slate-800">{getStudyMeta(data.studyCode).scholar || ' '}</div>
            <div className="text-xs text-slate-500">Research Scholar</div>
          </div>
          <div className="text-center">
            <div className="mt-8 border-t border-slate-400 pt-1 text-sm font-medium text-slate-800">{getStudyMeta(data.studyCode).supervisor || ' '}</div>
            <div className="text-xs text-slate-500">Supervisor</div>
          </div>
        </div>
      </div>
    </div>
  )
}
