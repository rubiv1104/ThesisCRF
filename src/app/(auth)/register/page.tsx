import { redirect } from 'next/navigation'
import { RegisterForm } from '@/features/auth/components/RegisterForm'
import { APP_NAME, DEPARTMENT_NAME } from '@/constants'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: `Register | ${APP_NAME}` }

interface PageProps {
  searchParams: Promise<{ role?: string }>
}

const ROLE_CONFIG = {
  teacher: {
    emoji: '👩‍🏫',
    title: 'Guide Registration',
    badge: 'Guide — Faculty & HOD',
    badgeClass: 'bg-green-50 text-green-700 ring-green-200',
    dotClass: 'bg-green-500',
  },
  investigator: {
    emoji: '🎓',
    title: 'Investigator Registration',
    badge: 'Investigator — PG Students',
    badgeClass: 'bg-blue-50 text-blue-700 ring-blue-200',
    dotClass: 'bg-blue-500',
  },
}

export default async function RegisterPage({ searchParams }: PageProps) {
  const { role: roleParam } = await searchParams

  // Admin accounts can only be created by an existing admin via User Management
  if (roleParam === 'admin') redirect('/login')

  const role: 'teacher' | 'investigator' =
    roleParam === 'teacher' ? 'teacher' : 'investigator'

  const config = ROLE_CONFIG[role]

  // Only investigator needs study selection
  let studies: { id: string; study_code: string; study_title: string }[] = []
  if (role === 'investigator') {
    const supabase = await createClient()
    const { data } = await supabase
      .from('studies')
      .select('id, study_code, study_title')
      .eq('study_status', 'active')
      .order('study_code')
    studies = (data as typeof studies) ?? []
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <span className="text-3xl">{config.emoji}</span>
        <h1 className="mt-2 text-xl font-bold text-slate-900">{config.title}</h1>
        <p className="mt-1 text-sm text-slate-500">{DEPARTMENT_NAME}</p>
        <span className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${config.badgeClass}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${config.dotClass}`} />
          {config.badge}
        </span>
      </div>
      <RegisterForm role={role} studies={studies} />
    </div>
  )
}
