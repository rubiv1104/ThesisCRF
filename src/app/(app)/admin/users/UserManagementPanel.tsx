'use client'

import { useState, useTransition } from 'react'
import { updateUserRole, assignToStudy, removeFromStudy, toggleUserActive } from './actions'
import { UserCircle2, GraduationCap, BookOpen, ShieldCheck, Link2, Trash2, Loader2, UserX, UserCheck } from 'lucide-react'
import { toast } from 'sonner'

interface UserRow {
  id: string
  full_name: string
  email: string
  role: string
  is_active: boolean
  inv_studies: { id: string; code: string }[]
  teacher_studies: { id: string; code: string }[]
}

interface Study {
  id: string
  study_code: string
}

const ROLE_OPTIONS = [
  { value: 'investigator', label: 'Investigator (PG Student)', icon: GraduationCap, color: 'text-blue-700 bg-blue-50' },
  { value: 'teacher', label: 'Guide (Faculty)', icon: BookOpen, color: 'text-green-700 bg-green-50' },
  { value: 'admin', label: 'Administrator', icon: ShieldCheck, color: 'text-purple-700 bg-purple-50' },
]

function RoleIcon({ role }: { role: string }) {
  if (role === 'admin') return <ShieldCheck size={14} className="text-purple-600" />
  if (role === 'teacher') return <BookOpen size={14} className="text-green-600" />
  return <GraduationCap size={14} className="text-blue-600" />
}

function roleBadge(role: string) {
  if (role === 'admin') return 'bg-purple-50 text-purple-700'
  if (role === 'teacher') return 'bg-green-50 text-green-700'
  return 'bg-blue-50 text-blue-700'
}

function UserCard({ user, studies }: { user: UserRow; studies: Study[] }) {
  const [pending, startTransition] = useTransition()
  const [assignStudyId, setAssignStudyId] = useState('')
  const [feedback, setFeedback] = useState('')

  function handleRoleChange(newRole: string) {
    setFeedback('')
    startTransition(async () => {
      const res = await updateUserRole(user.id, newRole as 'admin' | 'teacher' | 'investigator')
      if ('error' in res) setFeedback('Error: ' + res.error)
      else setFeedback('Role updated.')
    })
  }

  function handleAssign() {
    if (!assignStudyId) return
    const role = user.role === 'teacher' ? 'teacher' : 'investigator'
    setFeedback('')
    startTransition(async () => {
      const res = await assignToStudy(user.id, assignStudyId, role as 'teacher' | 'investigator')
      if ('error' in res) setFeedback('Error: ' + res.error)
      else { setFeedback('Assigned.'); setAssignStudyId('') }
    })
  }

  function handleRemove(studyId: string) {
    const role = user.role === 'teacher' ? 'teacher' : 'investigator'
    setFeedback('')
    startTransition(async () => {
      await removeFromStudy(user.id, studyId, role as 'teacher' | 'investigator')
      setFeedback('Removed.')
    })
  }

  function handleToggleActive() {
    const next = !user.is_active
    const msg = next
      ? `Reactivate ${user.full_name}? They will be able to log in again.`
      : `Deactivate ${user.full_name}? They will not be able to log in. Their data stays saved.`
    if (!confirm(msg)) return
    startTransition(async () => {
      const res = await toggleUserActive(user.id, next)
      if (res && 'error' in res) toast.error(res.error)
      else toast.success(next ? `${user.full_name} reactivated.` : `${user.full_name} deactivated.`)
    })
  }

  const assignedStudies = user.role === 'teacher' ? user.teacher_studies : user.inv_studies

  return (
    <div className={`rounded-xl border bg-white shadow-sm p-5 space-y-4 transition-opacity ${!user.is_active ? 'border-red-200 opacity-70' : 'border-slate-200'}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${user.is_active ? 'bg-slate-100' : 'bg-red-50'}`}>
            <UserCircle2 size={22} className={user.is_active ? 'text-slate-400' : 'text-red-400'} />
          </div>
          <div>
            <p className="font-semibold text-slate-900 text-sm">{user.full_name}</p>
            <p className="text-xs text-slate-400">{user.email}</p>
            {!user.is_active && (
              <span className="inline-block mt-0.5 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-600">
                Deactivated
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${roleBadge(user.role)}`}>
            <RoleIcon role={user.role} />
            {user.role}
          </span>
          {/* Deactivate / Reactivate */}
          <button
            onClick={handleToggleActive}
            disabled={pending}
            className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition-colors ${
              user.is_active
                ? 'bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600'
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            } disabled:opacity-50`}
            title={user.is_active ? 'Deactivate account' : 'Reactivate account'}
          >
            {pending ? <Loader2 size={10} className="animate-spin" /> : user.is_active ? <UserX size={10} /> : <UserCheck size={10} />}
            {user.is_active ? 'Deactivate' : 'Reactivate'}
          </button>
        </div>
      </div>

      {/* Change role */}
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-slate-500">Change Role</p>
        <div className="flex flex-wrap gap-2">
          {ROLE_OPTIONS.map((opt) => {
            const Icon = opt.icon
            const active = user.role === opt.value
            return (
              <button
                key={opt.value}
                disabled={active || pending}
                onClick={() => handleRoleChange(opt.value)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                  active
                    ? `${opt.color} border-transparent ring-2 ring-offset-1 ring-current`
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                } disabled:opacity-60`}
              >
                <Icon size={13} />
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Study assignment (only for teacher/investigator) */}
      {user.role !== 'admin' && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-500">
            {user.role === 'teacher' ? 'Supervised Studies' : 'Assigned Study'}
          </p>

          {assignedStudies.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {assignedStudies.map((s) => (
                <span key={s.id} className="flex items-center gap-1.5 rounded-full bg-slate-100 pl-2.5 pr-1.5 py-0.5 text-xs font-medium text-slate-700">
                  {s.code}
                  <button
                    onClick={() => handleRemove(s.id)}
                    disabled={pending}
                    className="rounded-full p-0.5 hover:bg-red-100 hover:text-red-600 transition-colors"
                    title="Remove"
                  >
                    <Trash2 size={11} />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-amber-600">No study assigned yet</p>
          )}

          <div className="flex items-center gap-2">
            <select
              value={assignStudyId}
              onChange={(e) => setAssignStudyId(e.target.value)}
              className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select study to assign…</option>
              {studies.map((s) => (
                <option key={s.id} value={s.id}>{s.study_code}</option>
              ))}
            </select>
            <button
              onClick={handleAssign}
              disabled={!assignStudyId || pending}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {pending ? <Loader2 size={12} className="animate-spin" /> : <Link2 size={12} />}
              Assign
            </button>
          </div>
        </div>
      )}

      {feedback && (
        <p className={`text-xs font-medium ${feedback.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
          {feedback}
        </p>
      )}
    </div>
  )
}

export function UserManagementPanel({ users, studies }: { users: UserRow[]; studies: Study[] }) {
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'teacher' | 'investigator'>('all')
  const [statusFilter, setStatusFilter] = useState<'active' | 'deactivated' | 'all'>('active')
  const [search, setSearch] = useState('')

  const filtered = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false
    if (statusFilter === 'active' && !u.is_active) return false
    if (statusFilter === 'deactivated' && u.is_active) return false
    if (search && !u.full_name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const counts = {
    all: users.length,
    admin: users.filter((u) => u.role === 'admin').length,
    teacher: users.filter((u) => u.role === 'teacher').length,
    investigator: users.filter((u) => u.role === 'investigator').length,
  }

  const deactivatedCount = users.filter((u) => !u.is_active).length

  return (
    <div className="space-y-4">
      {/* Search */}
      <input
        type="text"
        placeholder="Search by name or email…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Status filter */}
      <div className="flex gap-2">
        {([['active', 'Active'], ['deactivated', `Deactivated (${deactivatedCount})`], ['all', 'All Users']] as const).map(([val, label]) => (
          <button
            key={val}
            onClick={() => setStatusFilter(val)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              statusFilter === val ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Role filter tabs */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'investigator', 'teacher', 'admin'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setRoleFilter(f)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors capitalize ${
              roleFilter === f ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {f === 'all' ? 'All Roles' : f === 'investigator' ? 'Investigators' : f === 'teacher' ? 'Guides' : 'Admins'} ({counts[f]})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-slate-200 py-12 text-center">
          <p className="text-sm text-slate-400">No users found</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((u) => (
            <UserCard key={u.id} user={u} studies={studies} />
          ))}
        </div>
      )}
    </div>
  )
}
