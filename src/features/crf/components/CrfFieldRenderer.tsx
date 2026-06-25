'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/utils'
import type { CrfField } from '../types'

interface CrfFieldRendererProps {
  field: CrfField
  value: string
  onChange: (key: string, value: string) => void
  allValues: Record<string, string>
}

export function CrfFieldRenderer({ field, value, onChange, allValues }: CrfFieldRendererProps) {
  // Conditional visibility
  if (field.dependsOn) {
    const depValue = allValues[field.dependsOn.key]
    if (depValue !== field.dependsOn.value) return null
  }

  if (field.type === 'heading') {
    return (
      <div className="col-span-2 mt-3 border-b border-slate-200 pb-1">
        <p className="text-sm font-semibold text-slate-700">{field.label}</p>
      </div>
    )
  }

  if (field.type === 'divider') {
    return <div className="col-span-2 border-t border-slate-100" />
  }

  if (field.type === 'assessment_grid') {
    return (
      <div className="col-span-2 overflow-x-auto">
        <p className="mb-2 text-sm font-medium text-slate-700">{field.label}</p>
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-200 px-2 py-1.5 text-left font-medium text-slate-600">
                Parameter
              </th>
              {field.columns?.map((col) => (
                <th
                  key={col}
                  className="border border-slate-200 px-2 py-1.5 text-center font-medium text-slate-600"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {field.rows?.map((row) => {
              const rowKey = `${field.key}__${row.replace(/\s+/g, '_').toLowerCase()}`
              return (
                <tr key={row} className="odd:bg-white even:bg-slate-50">
                  <td className="border border-slate-200 px-2 py-1.5 text-slate-700">{row}</td>
                  {field.columns?.map((col) => {
                    const cellKey = `${rowKey}__${col.replace(/\s+/g, '_').toLowerCase()}`
                    return (
                      <td key={col} className="border border-slate-200 px-1 py-1">
                        <Input
                          className="h-7 border-0 bg-transparent p-0 text-center text-xs focus-visible:ring-0"
                          value={allValues[cellKey] ?? ''}
                          onChange={(e) => onChange(cellKey, e.target.value)}
                        />
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label
        htmlFor={field.key}
        className={cn('text-sm text-slate-700', field.required && "after:ml-0.5 after:text-red-500 after:content-['*']")}
      >
        {field.label}
        {field.unit && <span className="ml-1 text-xs font-normal text-slate-400">({field.unit})</span>}
      </Label>

      {field.type === 'text' && (
        <Input
          id={field.key}
          value={value}
          onChange={(e) => onChange(field.key, e.target.value)}
          placeholder={field.placeholder}
        />
      )}

      {field.type === 'number' && (
        <Input
          id={field.key}
          type="number"
          value={value}
          onChange={(e) => onChange(field.key, e.target.value)}
          placeholder={field.placeholder}
          className="max-w-[180px]"
        />
      )}

      {field.type === 'date' && (
        <Input
          id={field.key}
          type="date"
          value={value}
          onChange={(e) => onChange(field.key, e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          className="max-w-[200px]"
        />
      )}

      {field.type === 'textarea' && (
        <Textarea
          id={field.key}
          value={value}
          onChange={(e) => onChange(field.key, e.target.value)}
          placeholder={field.placeholder}
          rows={3}
        />
      )}

      {field.type === 'select' && (
        <Select value={value} onValueChange={(v) => onChange(field.key, v)}>
          <SelectTrigger id={field.key} className="max-w-xs">
            <SelectValue placeholder="Select…" />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {field.type === 'radio' && (
        <RadioGroup
          value={value}
          onValueChange={(v) => onChange(field.key, v)}
          className="flex flex-wrap gap-x-6 gap-y-2"
        >
          {field.options?.map((opt) => (
            <div key={opt.value} className="flex items-center gap-2">
              <RadioGroupItem value={opt.value} id={`${field.key}_${opt.value}`} />
              <Label htmlFor={`${field.key}_${opt.value}`} className="cursor-pointer font-normal">
                {opt.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}

      {field.type === 'checkbox_group' && (
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {field.options?.map((opt) => {
            const checked = value ? value.split(',').includes(opt.value) : false
            return (
              <div key={opt.value} className="flex items-center gap-2">
                <Checkbox
                  id={`${field.key}_${opt.value}`}
                  checked={checked}
                  onCheckedChange={(c) => {
                    const current = value ? value.split(',').filter(Boolean) : []
                    const next = c
                      ? [...current, opt.value]
                      : current.filter((v) => v !== opt.value)
                    onChange(field.key, next.join(','))
                  }}
                />
                <Label htmlFor={`${field.key}_${opt.value}`} className="cursor-pointer font-normal">
                  {opt.label}
                </Label>
              </div>
            )
          })}
        </div>
      )}

      {field.hint && <p className="text-xs text-slate-400">{field.hint}</p>}
    </div>
  )
}
