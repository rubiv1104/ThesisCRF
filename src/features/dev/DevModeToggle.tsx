'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FlaskConical, Wrench } from 'lucide-react'

export const DEV_MODE_KEY = 'thesiscrf_dev_mode'

/** Read dev-mode flag (client only). */
export function isDevModeOn(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(DEV_MODE_KEY) === '1'
}

/**
 * Hidden Developer Mode toggle. Rendered only inside the Administrator's
 * Settings page (the page itself is the gate). Turning it on reveals the
 * Developer tools entry in the sidebar; it changes no permissions or auth.
 */
export function DevModeToggle() {
  const [on, setOn] = useState(false)
  useEffect(() => { setOn(isDevModeOn()) }, [])

  function toggle() {
    const next = !on
    setOn(next)
    localStorage.setItem(DEV_MODE_KEY, next ? '1' : '0')
    window.dispatchEvent(new Event('devmode-changed'))
  }

  return (
    <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <FlaskConical size={18} className="text-purple-600" />
          <div>
            <p className="text-sm font-semibold text-slate-900">Developer Mode</p>
            <p className="text-xs text-slate-500">Testing & QA tools for the Administrator only. Off in normal use.</p>
          </div>
        </div>
        <button
          onClick={toggle}
          role="switch"
          aria-checked={on}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${on ? 'bg-purple-600' : 'bg-slate-300'}`}
        >
          <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </button>
      </div>
      {on && (
        <Link href="/admin/dev" className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-700">
          <Wrench size={13} /> Open Developer Tools
        </Link>
      )}
    </div>
  )
}
