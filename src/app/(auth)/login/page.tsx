import { LoginForm } from '@/features/auth/components/LoginForm'
import { APP_NAME } from '@/constants'

export const metadata = { title: `Login | ${APP_NAME}` }

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900">{APP_NAME}</h1>
        <p className="mt-1 text-sm text-slate-500">Clinical Research Management System</p>
      </div>
      <LoginForm />
    </div>
  )
}
