import Link from 'next/link'
import { ShieldOff } from 'lucide-react'
import { APP_NAME } from '@/constants'

export const metadata = { title: `Account Deactivated | ${APP_NAME}` }

export default function DeactivatedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm space-y-4">
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <ShieldOff size={28} className="text-red-500" />
          </div>
        </div>
        <h1 className="text-lg font-bold text-slate-900">Account Deactivated</h1>
        <p className="text-sm text-slate-500">
          Your account has been deactivated. Your data is still saved and accessible to your department.
          Please contact the administrator if you believe this is a mistake.
        </p>
        <Link
          href="/login"
          className="inline-block rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Back to Login
        </Link>
      </div>
    </div>
  )
}
