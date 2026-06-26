'use client'

import { useState, useTransition } from 'react'
import { updateUserRole, assignToStudy, removeFromStudy } from './actions'
import { UserCircle2, GraduationCap, BookOpen, ShieldCheck, Link2, Trash2, Loader2 } from 'lucide-react'

interface UserRow {
  id: string
  full_name: string
  email: string
  role: string
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

  const assignedStudies = user.role === 'teacher' ? user.teacher_studies : user.inv_studies

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100">
            <UserCircle2 size={22} className="text-slate-400" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 text-sm">{user.full_name}</p>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${roleBadge(user.role)}`}>
          <RoleIcon role={user.role} />
          {user.role}
        </span>
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

          {/* Current assignments */}
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

          {/* Assign to study */}
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
  const [filter, setFilter] = useState<'all' | 'admin' | 'teacher' | 'investigator'>('all')

  const filtered = filter === 'all' ? users : users.filter((u) => u.role === filter)

  const counts = {
    all: users.length,
    admin: users.filter((u) => u.role === 'admin').length,
    teacher: users.filter((u) => u.role === 'teacher').length,
    investigator: users.filter((u) => u.role === 'investigator').length,
  }

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'investigator', 'teacher', 'admin'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors capitalize ${
              filter === f
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {f === 'all' ? 'All Users' : f === 'investigator' ? 'Investigators' : f === 'teacher' ? 'Teachers' : 'Admins'} ({counts[f]})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-slate-200 py-12 text-center">
          <p className="text-sm text-slate-400">No users in this category</p>
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
