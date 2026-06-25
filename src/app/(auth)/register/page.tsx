import { RegisterForm } from '@/features/auth/components/RegisterForm'
import { APP_NAME, DEPARTMENT_NAME } from '@/constants'

export const metadata = { title: `Register | ${APP_NAME}` }

interface PageProps {
  searchParams: Promise<{ role?: string }>
}

export default async function RegisterPage({ searchParams }: PageProps) {
  const { role } = await searchParams
  const isAdmin = role === 'admin'

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <span className="text-3xl">{isAdmin ? '👩‍🏫' : '🎓'}</span>
        <h1 className="mt-2 text-xl font-bold text-slate-900">
          {isAdmin ? 'Admin Registration' : 'Investigator Registration'}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{DEPARTMENT_NAME}</p>
        <span
          className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${
            isAdmin
              ? 'bg-purple-50 text-purple-700 ring-purple-200'
              : 'bg-blue-50 text-blue-700 ring-blue-200'
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${isAdmin ? 'bg-purple-500' : 'bg-blue-500'}`} />
          {isAdmin ? 'Admin — Teachers & HOD' : 'Investigator — PG Students'}
        </span>
      </div>
      <RegisterForm role={isAdmin ? 'admin' : 'investigator'} />
    </div>
  )
}
