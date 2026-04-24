'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { saveCustomWorkoutPlan, WorkoutPlan, Exercise, WEEK_DAYS, EXERCISE_LIBRARY } from '@/lib/data'

interface User { name: string; jobRole: string }

const REGIONS = Object.keys(EXERCISE_LIBRARY)

interface DayConfig {
  active: boolean
  focus: string
  duration: string
  exercises: Exercise[]
}

const emptyDay = (): DayConfig => ({ active: false, focus: '', duration: '60', exercises: [] })

interface ExPicker {
  dayIdx: number
  region: string
  selected: { name: string; muscle: string; emoji: string } | null
  sets: string
  reps: string
  rest: string
  load: string
}

export default function CriarTreinoPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [planName, setPlanName] = useState('')
  const [days, setDays] = useState<DayConfig[]>(WEEK_DAYS.map(emptyDay))
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [picker, setPicker] = useState<ExPicker | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('nt_user')
    if (!stored) { router.push('/'); return }
    const u = JSON.parse(stored)
    if (u.role !== 'professional') { router.push('/portal'); return }
    setUser({ name: u.name, jobRole: u.jobRole })
  }, [router])

  if (!user) return null

  const activeDays = days.filter(d => d.active)

  function toggleDay(idx: number) {
    setDays(prev => prev.map((d, i) => i === idx ? { ...d, active: !d.active } : d))
  }

  function updateDay(idx: number, patch: Partial<DayConfig>) {
    setDays(prev => prev.map((d, i) => i === idx ? { ...d, ...patch } : d))
  }

  function removeExercise(dayIdx: number, exIdx: number) {
    setDays(prev => prev.map((d, i) =>
      i === dayIdx ? { ...d, exercises: d.exercises.filter((_, ei) => ei !== exIdx) } : d
    ))
  }

  function openPicker(dayIdx: number) {
    setPicker({ dayIdx, region: REGIONS[0], selected: null, sets: '3', reps: '12', rest: '60s', load: '' })
  }

  function addExerciseToPicker() {
    if (!picker?.selected) return
    const exercise: Exercise = {
      name: picker.selected.name,
      muscle: picker.selected.muscle,
      emoji: picker.selected.emoji,
      sets: parseInt(picker.sets) || 3,
      reps: picker.reps || '12',
      rest: picker.rest || '60s',
      load: picker.load.trim() || 'Peso corporal',
    }
    updateDay(picker.dayIdx, {
      exercises: [...days[picker.dayIdx].exercises, exercise],
    })
    setPicker(null)
  }

  function validate() {
    const errs: string[] = []
    if (!planName.trim()) errs.push('Nome do plano é obrigatório.')
    if (activeDays.length === 0) errs.push('Selecione ao menos 1 dia de treino.')
    days.forEach((d, i) => {
      if (!d.active) return
      if (!d.focus.trim()) errs.push(`${WEEK_DAYS[i]}: informe o foco do treino.`)
      if (d.exercises.length === 0) errs.push(`${WEEK_DAYS[i]}: adicione ao menos 1 exercício.`)
    })
    return errs
  }

  function handleSave() {
    const errs = validate()
    if (errs.length) { setErrors(errs); return }
    setErrors([])
    setSaving(true)
    const planDays: WorkoutPlan['days'] = {}
    WEEK_DAYS.forEach((day, i) => {
      if (days[i].active) {
        planDays[day] = {
          focus: days[i].focus.trim(),
          duration: parseInt(days[i].duration) || 60,
          exercises: days[i].exercises,
        }
      } else {
        planDays[day] = undefined
      }
    })
    const plan: WorkoutPlan = {
      id: `custom_wk_${Date.now()}`,
      name: planName.trim(),
      daysPerWeek: activeDays.length,
      updatedAt: new Date().toLocaleDateString('pt-BR'),
      days: planDays,
    }
    setTimeout(() => {
      saveCustomWorkoutPlan(plan)
      router.push('/planos?tipo=treino')
    }, 600)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userName={user.name} userRole={user.jobRole} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-7 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
              <button onClick={() => router.push('/planos')} className="hover:text-gray-600 transition-colors">Planos</button>
              <span>/</span>
              <span className="text-gray-600 font-medium">Criar Plano de Treino</span>
            </div>
            <h1 className="text-[17px] font-bold text-gray-900">Novo Plano de Treino</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/planos')}
              className="text-sm font-semibold text-gray-500 hover:text-gray-700 px-4 py-2 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              {saving
                ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Salvando...</>
                : '✓ Salvar Plano'}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-5">
          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm font-bold text-red-700 mb-1">Corrija os seguintes erros:</p>
              <ul className="list-disc list-inside space-y-0.5">
                {errors.map((e, i) => <li key={i} className="text-xs text-red-600">{e}</li>)}
              </ul>
            </div>
          )}

          {/* Nome + seletor de dias */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nome do Plano</label>
            <input
              value={planName}
              onChange={e => setPlanName(e.target.value)}
              placeholder="Ex: Hipertrofia ABC, Funcional 3x, Full Body…"
              className="w-full text-lg font-bold text-gray-900 border-0 outline-none bg-transparent placeholder:text-gray-300 placeholder:font-normal mb-5"
            />

            <div className="border-t border-gray-100 pt-4">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                Dias de treino — <span className="text-slate-700">{activeDays.length} selecionado{activeDays.length !== 1 ? 's' : ''}</span>
              </label>
              <div className="flex gap-2 flex-wrap">
                {WEEK_DAYS.map((day, i) => (
                  <button
                    key={day}
                    onClick={() => toggleDay(i)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                      days[i].active
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cards por dia ativo */}
          {WEEK_DAYS.map((day, dayIdx) => {
            if (!days[dayIdx].active) return null
            const d = days[dayIdx]
            return (
              <div key={day} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {/* Day header */}
                <div className="flex items-center gap-3 px-5 py-4 bg-slate-900 text-white">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {day.slice(0, 3)}
                  </div>
                  <input
                    value={d.focus}
                    onChange={e => updateDay(dayIdx, { focus: e.target.value })}
                    placeholder="Foco do treino (ex: Peito & Tríceps)"
                    className="flex-1 font-semibold text-white bg-transparent border-0 outline-none placeholder:text-white/30 text-sm"
                  />
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <input
                      type="number"
                      value={d.duration}
                      onChange={e => updateDay(dayIdx, { duration: e.target.value })}
                      className="w-14 text-center bg-white/10 rounded-lg px-2 py-1 text-sm font-semibold outline-none focus:bg-white/20 transition-colors"
                    />
                    <span className="text-white/50 text-xs">min</span>
                  </div>
                </div>

                {/* Exercises list */}
                {d.exercises.length > 0 && (
                  <div className="divide-y divide-gray-50">
                    {d.exercises.map((ex, exIdx) => (
                      <div key={exIdx} className="flex items-center gap-3 px-5 py-3 group hover:bg-gray-50/50 transition-colors">
                        <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {exIdx + 1}
                        </div>
                        <span className="text-xl flex-shrink-0">{ex.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 text-sm">{ex.name}</div>
                          <div className="text-xs text-gray-400 truncate">{ex.muscle}</div>
                        </div>
                        <div className="flex gap-1.5 flex-shrink-0">
                          <span className="text-[11px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">{ex.sets}×</span>
                          <span className="text-[11px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">{ex.reps} reps</span>
                          <span className="text-[11px] font-bold bg-orange-50 text-orange-700 px-2 py-0.5 rounded-md">{ex.rest}</span>
                          {ex.load && ex.load !== 'Peso corporal' && (
                            <span className="text-[11px] font-bold bg-green-50 text-green-700 px-2 py-0.5 rounded-md">{ex.load}</span>
                          )}
                        </div>
                        <button
                          onClick={() => removeExercise(dayIdx, exIdx)}
                          className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all text-sm ml-1 flex-shrink-0"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add exercise button */}
                <div className="px-5 py-3 border-t border-gray-100">
                  <button
                    onClick={() => openPicker(dayIdx)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1"
                  >
                    + Adicionar exercício
                  </button>
                </div>
              </div>
            )
          })}

          {activeDays.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              <div className="text-3xl mb-2">💪</div>
              <p className="text-sm font-semibold">Selecione os dias de treino acima para começar</p>
            </div>
          )}
        </div>
      </div>

      {/* Exercise picker modal */}
      {picker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setPicker(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 to-[#1e3a5f] px-6 py-5 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-white font-black text-lg">Adicionar Exercício</h2>
                <p className="text-white/40 text-xs mt-0.5">{WEEK_DAYS[picker.dayIdx]}</p>
              </div>
              <button onClick={() => setPicker(null)} className="text-white/40 hover:text-white/80 text-xl transition-colors">✕</button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Regions */}
              <div className="w-32 border-r border-gray-100 bg-gray-50 flex flex-col overflow-y-auto flex-shrink-0">
                {REGIONS.map(region => (
                  <button
                    key={region}
                    onClick={() => setPicker(p => p ? { ...p, region, selected: null } : p)}
                    className={`px-3 py-3 text-left text-xs font-semibold transition-colors border-l-2 ${
                      picker.region === region
                        ? 'border-slate-900 bg-white text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>

              {/* Exercises list */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-3 flex flex-col gap-1.5">
                  {EXERCISE_LIBRARY[picker.region].map(ex => (
                    <button
                      key={ex.name}
                      onClick={() => setPicker(p => p ? { ...p, selected: ex } : p)}
                      className={`w-full text-left px-3.5 py-3 rounded-xl border transition-all ${
                        picker.selected?.name === ex.name
                          ? 'border-slate-700 bg-slate-50'
                          : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg flex-shrink-0">{ex.emoji}</span>
                        <div className="min-w-0">
                          <div className="font-semibold text-gray-900 text-sm leading-tight">{ex.name}</div>
                          <div className="text-[11px] text-gray-400 mt-0.5 truncate">{ex.muscle}</div>
                        </div>
                        {picker.selected?.name === ex.name && (
                          <span className="ml-auto text-slate-700 flex-shrink-0 font-bold">✓</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer: selected + params */}
            <div className="border-t border-gray-100 px-5 py-4 bg-gray-50/50 flex-shrink-0">
              {picker.selected ? (
                <div className="mb-3 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                  <span className="text-lg">{picker.selected.emoji}</span>
                  <div>
                    <div className="text-sm font-bold text-gray-900">{picker.selected.name}</div>
                    <div className="text-[11px] text-gray-400">{picker.selected.muscle}</div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-400 mb-3">Selecione um exercício na lista acima</p>
              )}

              <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                  { key: 'sets', label: 'Séries', placeholder: '3' },
                  { key: 'reps', label: 'Repetições', placeholder: '12' },
                  { key: 'rest', label: 'Descanso', placeholder: '60s' },
                  { key: 'load', label: 'Carga', placeholder: '20kg' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">{f.label}</label>
                    <input
                      value={picker[f.key as 'sets' | 'reps' | 'rest' | 'load']}
                      onChange={e => setPicker(p => p ? { ...p, [f.key]: e.target.value } : p)}
                      placeholder={f.placeholder}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-center font-semibold focus:outline-none focus:border-slate-500 transition-colors"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => setPicker(null)}
                  className="text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={addExerciseToPicker}
                  disabled={!picker.selected}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-40 flex items-center gap-2"
                >
                  + Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
