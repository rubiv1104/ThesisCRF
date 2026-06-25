'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

export type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'idle'

interface UseCrfResponsesOptions {
  sectionId: string | null
  visitNumber?: number
}

export function useCrfResponses({ sectionId, visitNumber = 0 }: UseCrfResponsesOptions) {
  const [values, setValues] = useState<Record<string, string>>({})
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const supabase = createClient()

  // Load existing responses when sectionId is known
  useEffect(() => {
    if (!sectionId) return
    let cancelled = false

    async function load() {
      const { data, error } = await supabase
        .from('crf_responses')
        .select('field_key, response')
        .eq('section_id', sectionId)
        .eq('visit_number', visitNumber)

      if (error || cancelled) return

      const loaded: Record<string, string> = {}
      for (const row of data ?? []) {
        if (row.field_key && row.response !== null) {
          loaded[row.field_key] = row.response
        }
      }
      setValues(loaded)
      setSaveStatus('saved')
    }

    load()
    return () => { cancelled = true }
  }, [sectionId, visitNumber]) // eslint-disable-line react-hooks/exhaustive-deps

  const saveField = useCallback(
    async (fieldKey: string, fieldLabel: string, fieldType: string, response: string) => {
      if (!sectionId) return
      setSaveStatus('saving')

      const { error } = await supabase.from('crf_responses').upsert(
        {
          section_id: sectionId,
          field_key: fieldKey,
          field_label: fieldLabel,
          field_type: fieldType,
          response,
          visit_number: visitNumber,
        },
        { onConflict: 'section_id,field_key,visit_number' }
      )

      if (error) {
        setSaveStatus('unsaved')
        toast.error('Failed to save — ' + error.message)
      } else {
        setSaveStatus('saved')
      }
    },
    [sectionId, visitNumber] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const onChange = useCallback(
    (key: string, value: string, fieldLabel = '', fieldType = 'text') => {
      setValues((prev) => ({ ...prev, [key]: value }))
      setSaveStatus('unsaved')

      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        saveField(key, fieldLabel, fieldType, value)
      }, 800)
    },
    [saveField]
  )

  return { values, onChange, saveStatus }
}
