'use client'

import { Printer, FileText, ArrowLeft, EyeOff, Eye } from 'lucide-react'

export function PrintToolbar({ patientId, docxHref, deid }: { patientId: string; docxHref: string; deid: boolean }) {
  return (
    <div className="no-print sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-3 shadow-sm">
      <a
        href={`/patients/${patientId}/crf`}
        className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft size={14} /> Back to CRF
      </a>
      <div className="flex flex-wrap items-center gap-2">
        {/* Toggle patient-name visibility (de-identified output) */}
        <a
          href={`/print/crf/${patientId}${deid ? '' : '?deid=1'}`}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
            deid ? 'border-amber-300 bg-amber-50 text-amber-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
          }`}
          title={deid ? 'Patient name is hidden — click to show' : 'Hide patient name for de-identified output'}
        >
          {deid ? <Eye size={14} /> : <EyeOff size={14} />}
          {deid ? 'Name hidden' : 'Hide name'}
        </a>
        <a
          href={docxHref}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <FileText size={14} /> Download Word{deid ? ' (de-identified)' : ''}
        </a>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <Printer size={14} /> Print / Save as PDF
        </button>
      </div>
    </div>
  )
}
