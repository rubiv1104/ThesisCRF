'use client'

/**
 * Reference matrix of who-can-do-what, derived from the app's actual RLS and
 * route guards. Read-only documentation for QA — not an enforcement point.
 */
const ROLES = ['Admin', 'Guide', 'Investigator'] as const
type Cell = 'yes' | 'own' | 'study' | 'no'

const ROWS: { feature: string; perms: Record<(typeof ROLES)[number], Cell> }[] = [
  { feature: 'View patients', perms: { Admin: 'yes', Guide: 'study', Investigator: 'own' } },
  { feature: 'Register patient', perms: { Admin: 'no', Guide: 'no', Investigator: 'own' } },
  { feature: 'Edit CRF', perms: { Admin: 'no', Guide: 'no', Investigator: 'own' } },
  { feature: 'View CRF', perms: { Admin: 'yes', Guide: 'study', Investigator: 'own' } },
  { feature: 'Submit CRF for review', perms: { Admin: 'no', Guide: 'no', Investigator: 'own' } },
  { feature: 'Approve / Return CRF', perms: { Admin: 'no', Guide: 'study', Investigator: 'no' } },
  { feature: 'Unlock approved CRF', perms: { Admin: 'no', Guide: 'study', Investigator: 'no' } },
  { feature: 'Upload investigation / consent', perms: { Admin: 'no', Guide: 'no', Investigator: 'own' } },
  { feature: 'View investigation / consent', perms: { Admin: 'yes', Guide: 'study', Investigator: 'own' } },
  { feature: 'Enter assessments', perms: { Admin: 'no', Guide: 'no', Investigator: 'own' } },
  { feature: 'Master chart', perms: { Admin: 'no', Guide: 'study', Investigator: 'own' } },
  { feature: 'Print / Export CRF', perms: { Admin: 'yes', Guide: 'study', Investigator: 'own' } },
  { feature: 'Delete patient', perms: { Admin: 'yes', Guide: 'no', Investigator: 'own' } },
  { feature: 'Read audit logs', perms: { Admin: 'yes', Guide: 'no', Investigator: 'no' } },
  { feature: 'Manage users / studies', perms: { Admin: 'yes', Guide: 'no', Investigator: 'no' } },
  { feature: 'Developer Mode', perms: { Admin: 'yes', Guide: 'no', Investigator: 'no' } },
]

const STYLE: Record<Cell, { label: string; cls: string }> = {
  yes: { label: 'All', cls: 'bg-green-50 text-green-700' },
  study: { label: 'Study', cls: 'bg-blue-50 text-blue-700' },
  own: { label: 'Own', cls: 'bg-amber-50 text-amber-700' },
  no: { label: '—', cls: 'bg-slate-50 text-slate-400' },
}

export function PermissionMatrix() {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[520px] text-xs">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-slate-500">Feature</th>
            {ROLES.map((r) => <th key={r} className="px-3 py-2 text-center font-medium text-slate-500">{r}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {ROWS.map((row) => (
            <tr key={row.feature} className="hover:bg-slate-50/60">
              <td className="px-4 py-2 text-slate-700">{row.feature}</td>
              {ROLES.map((r) => {
                const c = STYLE[row.perms[r]]
                return <td key={r} className="px-3 py-2 text-center"><span className={`inline-block rounded-full px-2 py-0.5 font-medium ${c.cls}`}>{c.label}</span></td>
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="px-4 py-2 text-[11px] text-slate-400">All = any record · Study = own supervised/assigned studies · Own = records the user created · — = not permitted</p>
    </div>
  )
}
