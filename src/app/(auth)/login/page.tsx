import { LoginForm } from '@/features/auth/components/LoginForm'
import { APP_NAME } from '@/constants'

export const metadata = { title: `Login | ${APP_NAME}` }

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900">{APP_NAME}</h1>
        <p className="mt-1 text-sm text-slate-500">Clinical Research Management System</p>
        <div className="mt-4 flex justify-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-200">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
            Admin &mdash; Teachers &amp; HOD
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-200">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            Investigator &mdash; PG Students
          </span>
        </div>
      </div>
      <LoginForm />
    </div>
  )
}
