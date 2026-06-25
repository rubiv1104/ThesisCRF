import { CheckCircle2, Clock, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/utils'
import type { SaveStatus } from '../hooks/useCrfResponses'

const CONFIG = {
  saved: { icon: CheckCircle2, text: 'Saved', className: 'text-green-600' },
  saving: { icon: Loader2, text: 'Saving…', className: 'text-blue-500 animate-spin' },
  unsaved: { icon: AlertCircle, text: 'Unsaved Changes', className: 'text-amber-500' },
  idle: { icon: Clock, text: '', className: 'text-slate-300' },
} as const

interface SaveIndicatorProps {
  status: SaveStatus
}

export function SaveIndicator({ status }: SaveIndicatorProps) {
  const { icon: Icon, text, className } = CONFIG[status]
  if (status === 'idle') return null

  return (
    <div className={cn('flex items-center gap-1.5 text-xs font-medium', className)}>
      <Icon size={14} className={status === 'saving' ? 'animate-spin' : ''} />
      {text}
    </div>
  )
}
