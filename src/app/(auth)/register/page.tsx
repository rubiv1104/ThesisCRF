import { RegisterForm } from '@/features/auth/components/RegisterForm'
import { APP_NAME } from '@/constants'

export const metadata = { title: `Register | ${APP_NAME}` }

export default function RegisterPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900">{APP_NAME}</h1>
        <p className="mt-1 text-sm text-slate-500">Create your investigator account</p>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-200">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          Investigator — PG Students
        </span>
      </div>
      <RegisterForm />
    </div>
  )
}
