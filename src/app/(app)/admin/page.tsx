import { APP_NAME } from '@/constants'

export const metadata = { title: `Admin | ${APP_NAME}` }

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Overview of all studies and investigators</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-purple-100 bg-purple-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-purple-500">Role</p>
          <p className="mt-1 text-lg font-bold text-purple-900">Administrator</p>
          <p className="mt-1 text-xs text-purple-600">You can view all investigators&apos; CRFs and manage studies, users, and corrections.</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Admin panels for Studies, Users, and Reviews are in the sidebar under <strong>Admin</strong>.</p>
      </div>
    </div>
  )
}
