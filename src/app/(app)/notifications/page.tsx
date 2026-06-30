import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getViewer } from '@/lib/viewer'
import { NotificationsList, type NotificationRow } from '@/features/guide/NotificationsList'
import { APP_NAME } from '@/constants'

export const metadata = { title: `Notifications | ${APP_NAME}` }

export default async function NotificationsPage() {
  const supabase = await createClient()
  const viewer = await getViewer(supabase)
  if (!viewer) redirect('/login')

  const { data } = await (supabase as any)
    .from('notifications')
    .select('id, type, title, body, patient_id, read, created_at')
    .order('created_at', { ascending: false })
    .limit(100)

  const items = (data ?? []) as NotificationRow[]
  const isGuide = viewer.effectiveRole === 'teacher' || viewer.effectiveRole === 'admin'
  const linkFor = (pid: string) => isGuide ? `/teacher/review/${pid}` : `/patients/${pid}/crf`

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-xl font-bold text-slate-900">Notifications</h1>
      <NotificationsList items={items} linkFor={linkFor} />
    </div>
  )
}
