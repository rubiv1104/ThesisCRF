'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { UserPlus, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'

const schema = z.object({
  patient_name: z.string().min(2, 'Name required'),
  age: z.coerce.number().int().min(1).max(120),
  gender: z.enum(['male', 'female', 'other']),
  hospital_cr_number: z.string().min(1, 'CR Number required'),
  opd_number: z.string().min(1, 'OPD Number required'),
  phone: z.string().optional(),
  research_group_id: z.string().uuid('Select a group'),
})
type FormValues = z.infer<typeof schema>

interface Props {
  studyId: string
  studyCode: string
  groups: { id: string; group_name: string }[]
  investigatorId: string
}

export function AddPatientDialog({ studyId, studyCode, groups, investigatorId }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { patient_name: '', age: undefined as any, gender: 'male', hospital_cr_number: '', opd_number: '', phone: '', research_group_id: '' },
  })

  async function onSubmit(values: FormValues) {
    setLoading(true)
    try {
      const supabase = createClient() as any

      // Count existing patients to generate study_patient_id
      const { count } = await supabase
        .from('patients')
        .select('id', { count: 'exact', head: true })
        .eq('study_id', studyId)

      const serial = String((count ?? 0) + 1).padStart(3, '0')
      const study_patient_id = `${studyCode}-${serial}`

      const { data: patient, error } = await supabase
        .from('patients')
        .insert({
          study_id: studyId,
          research_group_id: values.research_group_id,
          study_patient_id,
          hospital_cr_number: values.hospital_cr_number,
          opd_number: values.opd_number,
          patient_name: values.patient_name,
          age: values.age,
          gender: values.gender,
          phone: values.phone || null,
          created_by: investigatorId,
        })
        .select('id')
        .single()

      if (error) {
        const msg = String(error.message ?? '')
        if (error.code === '23505' || /duplicate key/i.test(msg)) {
          if (/hospital_cr_number/i.test(msg)) {
            toast.error(`CR Number "${values.hospital_cr_number}" is already enrolled in this study.`)
          } else if (/opd_number/i.test(msg)) {
            toast.error(`OPD Number "${values.opd_number}" is already enrolled in this study.`)
          } else {
            toast.error('This patient appears to be already enrolled in this study.')
          }
        } else {
          toast.error(msg || 'Could not enrol patient.')
        }
        return
      }

      toast.success(`Patient ${study_patient_id} enrolled`)
      setOpen(false)
      form.reset()
      router.push(`/patients/${patient.id}/crf`)
      router.refresh()
    } catch (err) {
      toast.error('Failed to add patient')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="gap-2">
        <UserPlus size={16} />
        Add Patient
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Enrol New Patient</h2>
          <button
            onClick={() => { setOpen(false); form.reset() }}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
            {/* Patient Name - full width */}
            <div className="col-span-2">
              <FormField control={form.control} name="patient_name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient Name</FormLabel>
                  <FormControl><Input placeholder="Full name" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="age" render={({ field }) => (
              <FormItem>
                <FormLabel>Age (years)</FormLabel>
                <FormControl><Input type="number" min={1} max={120} placeholder="35" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="gender" render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <select {...field} className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="hospital_cr_number" render={({ field }) => (
              <FormItem>
                <FormLabel>CR Number</FormLabel>
                <FormControl><Input placeholder="Hospital CR No." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="opd_number" render={({ field }) => (
              <FormItem>
                <FormLabel>OPD Number</FormLabel>
                <FormControl><Input placeholder="OPD No." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="research_group_id" render={({ field }) => (
              <FormItem>
                <FormLabel>Research Group</FormLabel>
                <FormControl>
                  <select {...field} className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select group…</option>
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>{g.group_name}</option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem>
                <FormLabel>Phone (optional)</FormLabel>
                <FormControl><Input placeholder="10-digit number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="col-span-2 flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => { setOpen(false); form.reset() }}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading && <Loader2 size={14} className="mr-2 animate-spin" />}
                {loading ? 'Enrolling…' : 'Enrol & Open CRF'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
