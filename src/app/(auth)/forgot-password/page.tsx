import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm'
import { APP_NAME } from '@/constants'

export const metadata = { title: `Forgot Password | ${APP_NAME}` }

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900">{APP_NAME}</h1>
        <p className="mt-1 text-sm text-slate-500">Reset your password</p>
      </div>
      <ForgotPasswordForm />
    </div>
  )
}
