'use client'

import { useState } from 'react'
import { setStudyDuration } from './actions'

export function DurationEditor({ studyId, initialDays }: { studyId: string; initialDays: number | null }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(String(initialDays ?? ''))
  const [saving, setSaving] = useState(false)

  async function save() {
    const days = parseInt(value)
    if (!days || days < 1) return
    setSaving(true)
    try {
      await setStudyDuration(studyId, days)
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <input
          autoFocus
          type="number"
          min={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') save()
            if (e.key === 'Escape') setEditing(false)
          }}
          className="w-16 rounded border border-blue-300 px-1.5 py-0.5 text-center text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
        <button
          onClick={save}
          disabled={saving}
          className="rounded bg-blue-600 px-2 py-0.5 text-[10px] font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? '…' : '✓'}
        </button>
        <button
          onClick={() => setEditing(false)}
          className="text-[10px] text-slate-400 hover:text-slate-600"
        >
          ✕
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="group flex items-center gap-1 text-xs"
      title="Click to set study duration"
    >
      {initialDays ? (
        <span className="font-medium text-slate-700">{initialDays} days</span>
      ) : (
        <span className="text-slate-400 italic">Not set</span>
      )}
      <span className="text-[10px] text-slate-300 group-hover:text-blue-500">✎</span>
    </button>
  )
}
