import Link from 'next/link'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { APP_NAME, DEPARTMENT_NAME, INSTITUTION_NAME, UNIVERSITY_NAME } from '@/constants'

export const metadata = { title: `Login | ${APP_NAME}` }

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      {/* Department Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-700 text-white text-2xl font-bold shadow">
          K
        </div>
        <h1 className="text-lg font-bold uppercase tracking-wide text-slate-800">{DEPARTMENT_NAME}</h1>
        <p className="mt-0.5 text-sm font-medium text-slate-600">{INSTITUTION_NAME}</p>
        <p className="text-xs text-slate-500">{UNIVERSITY_NAME}</p>
        <div className="mt-3 h-px bg-slate-200" />
        <p className="mt-3 text-sm font-semibold text-slate-700">{APP_NAME} &mdash; Clinical Research Management</p>
      </div>

      {/* Login Form */}
      <LoginForm />

      {/* Register section */}
      <div className="mt-6">
        <p className="mb-3 text-center text-xs font-medium uppercase tracking-wide text-slate-400">New here? Create an account</p>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/register?role=admin"
            className="flex flex-col items-center gap-1 rounded-xl border-2 border-purple-200 bg-purple-50 px-4 py-3 text-center transition hover:border-purple-400 hover:bg-purple-100"
          >
            <span className="text-lg">👩‍🏫</span>
            <span className="text-xs font-semibold text-purple-800">Admin Account</span>
            <span className="text-[11px] text-purple-600">For Teachers &amp; HOD</span>
          </Link>
          <Link
            href="/register?role=investigator"
            className="flex flex-col items-center gap-1 rounded-xl border-2 border-blue-200 bg-blue-50 px-4 py-3 text-center transition hover:border-blue-400 hover:bg-blue-100"
          >
            <span className="text-lg">🎓</span>
            <span className="text-xs font-semibold text-blue-800">Investigator Account</span>
            <span className="text-[11px] text-blue-600">For PG Students</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
