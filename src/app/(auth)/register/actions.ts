'use server'

import { createClient } from '@/lib/supabase/server'

interface RegisterInput {
  fullName: string
  email: string
  password: string
  studyCode?: string
  role: 'admin' | 'teacher' | 'investigator'
}

export async function registerAction(
  input: RegisterInput
): Promise<{ success: true } | { error: string }> {
  const { fullName, email, password, studyCode, role } = input

  if (role === 'admin') {
    return { error: 'Admin accounts can only be created by an existing administrator.' }
  }

  if (role === 'investigator' && !studyCode) {
    return { error: 'Please select your study to continue.' }
  }

  const supabase = await createClient()

  const metadata: Record<string, string> = { full_name: fullName, role }
  if (role === 'investigator' && studyCode) {
    metadata['study_code'] = studyCode
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: metadata },
  })

  if (error) return { error: error.message }
  return { success: true }
}
