'use client'

import { Printer, FileText, ArrowLeft } from 'lucide-react'

export function PrintToolbar({ patientId, docxHref }: { patientId: string; docxHref: string }) {
  return (
    <div className="no-print sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-3 shadow-sm">
      <a
        href={`/patients/${patientId}/crf`}
        className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft size={14} /> Back to CRF
      </a>
      <div className="flex items-center gap-2">
        <a
          href={docxHref}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <FileText size={14} /> Download Word
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
