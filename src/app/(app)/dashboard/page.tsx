import { APP_NAME } from '@/constants'

export const metadata = { title: `Dashboard | ${APP_NAME}` }

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">Welcome to {APP_NAME}</p>
    </div>
  )
}
