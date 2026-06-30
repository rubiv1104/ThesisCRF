import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getViewer } from '@/lib/viewer'
import { loadGuideReview } from '@/features/guide/loadGuideReview'
import { GuideReview } from '@/features/guide/GuideReview'
import { APP_NAME } from '@/constants'

export const metadata = { title: `Patient Review | ${APP_NAME}` }

interface PageProps {
  params: Promise<{ patientId: string }>
}

export default async function GuidePatientReviewPage({ params }: PageProps) {
  const { patientId } = await params
  const supabase = await createClient()
  const viewer = await getViewer(supabase)
  if (!viewer) redirect('/login')
  if (viewer.effectiveRole !== 'teacher' && viewer.effectiveRole !== 'admin') redirect('/dashboard')

  const data = await loadGuideReview(supabase, patientId, viewer.effectiveUserId)
  if (!data) notFound()

  return <GuideReview data={data} />
}
