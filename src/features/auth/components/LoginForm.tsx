'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { loginSchema, type LoginFormValues } from '../validation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  })

  async function onSubmit(values: LoginFormValues) {
    setLoading(true)
    const supabase = createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    // Route based on role
    const { data: profileRaw } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const profile = profileRaw as any
    const destination = profile?.role === 'admin' ? '/admin' : '/dashboard'
    router.push(destination)
    router.refresh()
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
                      placeholder="••••••••"
                      autoComplete="current-password"
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="rememberMe"
                  />
                </FormControl>
                <Label htmlFor="rememberMe" className="cursor-pointer text-sm font-normal">
                  Remember me
                </Label>
              </FormItem>
            )}
          />

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 size={16} className="mr-2 animate-spin" /> : null}
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>

          <div className="flex items-center justify-between text-sm">
            <Link
              href="/forgot-password"
              className="text-blue-600 hover:text-blue-700 hover:underline"
            >
              Forgot password?
            </Link>
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-700 hover:underline"
            >
              Register
            </Link>
          </div>
        </form>
      </Form>
    </div>
  )
}
