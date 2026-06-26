'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { registerAction } from '@/app/(auth)/register/actions'
import { registerSchema, type RegisterFormValues } from '../validation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

interface Study {
  id: string
  study_code: string
  study_title: string
}

interface RegisterFormProps {
  role: 'admin' | 'teacher' | 'investigator'
  studies?: Study[]
}

export function RegisterForm({ role, studies = [] }: RegisterFormProps) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '', studyCode: '' },
  })

  async function onSubmit(values: RegisterFormValues) {
    setServerError(null)
    setLoading(true)

    try {
      const result = await registerAction({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        studyCode: values.studyCode || undefined,
        role,
      })

      if ('error' in result) {
        if (result.error.toLowerCase().includes('study')) {
          form.setError('studyCode', { message: result.error })
        } else if (result.error.toLowerCase().includes('email')) {
          form.setError('email', { message: result.error })
        } else {
          setServerError(result.error)
        }
        return
      }

      toast.success('Account created! Please sign in.')
      router.push('/login')
    } catch {
      setServerError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isInvestigator = role === 'investigator'
  const accent = role === 'admin' ? 'text-purple-700' : role === 'teacher' ? 'text-green-700' : 'text-blue-700'

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">

          {serverError && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              {serverError}
            </div>
          )}

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={role === 'investigator' ? 'Your full name' : 'Dr. Full Name'}
                    autoComplete="name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isInvestigator && (
            <FormField
              control={form.control}
              name="studyCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Your Study / Research Topic <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <select
                      id="studyCode"
                      className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus:border-ring focus:ring-2 focus:ring-ring/50 disabled:opacity-50"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value)}
                    >
                      <option value="">— Select your study / research topic —</option>
                      {studies.map((s) => (
                        <option key={s.id} value={s.study_code}>
                          {s.study_code} — {s.study_title}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="At least 8 characters"
                      autoComplete="new-password"
                      className="pr-10"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Repeat your password"
                      autoComplete="new-password"
                      className="pr-10"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 size={16} className="mr-2 animate-spin" />}
            {loading ? 'Creating account…' : 'Create account'}
          </Button>

          <div className="text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className={`hover:underline font-medium ${accent}`}>
              Sign in
            </Link>
          </div>
        </form>
      </Form>
    </div>
  )
}
