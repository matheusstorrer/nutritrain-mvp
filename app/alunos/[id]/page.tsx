'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import AssignPlanModal from '@/components/AssignPlanModal'
import { getStudent, getDietPlan, getWorkoutPlan, WEEK_DAYS, saveExercise, getStoredExercises, Exercise } from '@/lib/data'

interface User { name: string; jobRole: string }

const EXERCISE_EMOJIS = ['🏋️', '💪', '🤸', '🦵', '🔥', '⚡', '🏃', '🔄', '🦶']

const defaultExForm = { name: '', muscle: '', sets: '3', reps: '12', rest: '60s', load: '' }

export default function StudentProfilePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [user, setUser] = useState<User | null>(null)
  const [tab, setTab] = useState<'dieta' | 'treino'>('dieta')
  const [activeDay, setActiveDay] = useState('Segunda')
  const [refreshKey, setRefreshKey] = useState(0)

  // Assign plan modal
  const [showAssign, setShowAssign] = useState(false)
  const [assignType, setAssignType] = useState<'diet' | 'workout' | null>(null)

  // Add exercise modal
  const [showAddEx, setShowAddEx] = useState(false)
  const [exForm, setExForm] = useState(defaultExForm)
  const [exSaving, setExSaving] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('nt_user')
    if (!stored) { router.push('/'); return }
    const u = JSON.parse(stored)
    if (u.role !== 'professional') { router.push('/portal'); return }
    setUser({ name: u.name, jobRole: u.jobRole })
  }, [router])

  // Derived data — re-runs every render (refreshKey triggers re-render)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const student = getStudent(id)
  const diet = getDietPlan(student?.dietPlanId ?? null)
  const workout = getWorkoutPlan(student?.workoutPlanId ?? null)
  const workoutDayObj = workout?.days[activeDay]
  const extraExercises = workout ? getStoredExercises(workout.id, activeDay) : []
  const allExercises = [...(workoutDayObj?.exercises ?? []), ...extraExercises]

  // Keep refreshKey in dep array so ESLint doesn't warn
  void refreshKey

  function openAssign(type: 'diet' | 'workout' | null) {
    setAssignType(type)
    setShowAssign(true)
  }

  function handleAssigned() {
    setRefreshKey(k => k + 1)
    setShowAssign(false)
  }

  function setEx(key: string, value: string) {
    setExForm(f => ({ ...f, [key]: value }))
  }

  function handleSaveExercise() {
    if (!workout || !exForm.name.trim()) return
    setExSaving(true)
    setTimeout(() => {
      const exercise: Exercise = {
        name: exForm.name.trim(),
        muscle: exForm.muscle.trim() || 'Geral',
        sets: parseInt(exForm.sets) || 3,
        reps: exForm.reps || '12',
        rest: exForm.rest || '60s',
        load: exForm.load.trim() || 'Peso corporal',
        emoji: EXERCISE_EMOJIS[Math.floor(Math.random() * EXERCISE_EMOJIS.length)],
      }
      saveExercise(workout.id, activeDay, exercise)
      setRefreshKey(k => k + 1)
      setShowAddEx(false)
      setExForm(defaultExForm)
      setExSaving(false)
    }, 400)
  }

  if (!user) return null
  if (!student) return (
    <div className="flex h-screen items-center justify-center text-gray-400">
      Aluno não encontrado. <Link href="/alunos" className="ml-2 text-blue-600 underline">Voltar</Link>
    </div>
  )

  const hasDiet = !!diet
  const hasWorkout = !!workout
  const totalKcal = diet ? diet.meals.reduce((s, m) => s + m.items.reduce((a, i) => a + i.kcal, 0), 0) : 0

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userName={user.name} userRole={user.jobRole} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="bg-white border-b border-gray-200 px-7 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <Link href="/alunos" className="text-gray-400 hover:text-gray-600 text-sm">← Alunos</Link>
            <span className="text-gray-300">/</span>
            <span className="text-sm font-semibold text-gray-900">{student.name}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.open(`mailto:${student.email}?subject=NutriTrain Pro — ${student.name}`)}
              className="text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-lg transition-colors"
            >
              ✉️ Email
            </button>
            <button
              onClick={() => openAssign(null)}
              className="text-sm font-semibold text-white bg-green-500 hover:bg-green-600 px-3 py-1.5 rounded-lg transition-colors"
            >
              + Novo Plano
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Header banner */}
          <div className="bg-gradient-to-r from-slate-900 to-[#1e3a5f] px-7 py-6">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${student.avatarColor} flex items-center justify-center text-xl font-bold text-white flex-shrink-0 shadow-lg`}>
                {student.initials}
              </div>
              <div>
                <h1 className="text-xl font-black text-white">{student.name}</h1>
                <p className="text-white/50 text-sm mt-0.5">{student.email} · {student.phone}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {student.plans.includes('diet') && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-300">🥗 Dieta</span>
                  )}
                  {student.plans.includes('workout') && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300">💪 Treino</span>
                  )}
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/50">
                    {student.goal}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-7 py-6 flex gap-6">
            {/* Left: info card */}
            <div className="w-64 shrink-0">
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">Dados do Aluno</div>
                </div>
                {[
                  ['Idade', `${student.age} anos`],
                  ['Altura', `${student.height} cm`],
                  ['Peso', `${student.weight} kg`],
                  ['Objetivo', student.goal],
                  ['Nutricionista', student.nutritionist || '—'],
                  ['Personal', student.trainer || '—'],
                  ['Status', student.status === 'active' ? '✅ Ativo' : student.status === 'pending' ? '⏳ Pendente' : '🆕 Novo'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center px-5 py-2.5 border-b border-gray-50 text-sm last:border-0">
                    <span className="text-gray-400 font-medium">{k}</span>
                    <span className="text-gray-700 font-semibold text-right text-xs max-w-[120px]">{v}</span>
                  </div>
                ))}

                {student.obs && (
                  <div className="px-5 py-3 bg-yellow-50 border-t border-yellow-100">
                    <div className="text-[10px] font-bold text-yellow-600 uppercase tracking-wide mb-1">Observações</div>
                    <div className="text-xs text-yellow-800 leading-relaxed">{student.obs}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: tabs */}
            <div className="flex-1 min-w-0">
              <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-5 w-fit print:hidden">
                <button
                  onClick={() => setTab('dieta')}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    tab === 'dieta' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  🥗 Plano Alimentar
                </button>
                <button
                  onClick={() => setTab('treino')}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    tab === 'treino' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  💪 Plano de Treino
                </button>
              </div>

              {/* ─── DIET TAB ─── */}
              {tab === 'dieta' && (
                <div>
                  {!hasDiet ? (
                    <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center text-gray-400">
                      <div className="text-4xl mb-3">🥗</div>
                      <div className="font-semibold">Nenhum plano alimentar</div>
                      <div className="text-sm mt-1">Atribua um plano para este aluno</div>
                      <button
                        onClick={() => openAssign('diet')}
                        className="mt-4 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                      >
                        + Atribuir Plano Alimentar
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-gray-900">{diet.name}</h3>
                            <p className="text-xs text-gray-400 mt-0.5">Atualizado em {diet.updatedAt}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openAssign('diet')}
                              className="text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg transition-colors print:hidden"
                            >
                              🔄 Trocar
                            </button>
                            <button
                              onClick={() => window.print()}
                              className="text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg transition-colors print:hidden"
                            >
                              📄 Gerar PDF
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                          {[
                            { label: 'Calorias', value: `${totalKcal}`, unit: 'kcal', color: 'text-orange-600' },
                            { label: 'Proteínas', value: `${diet.protein}g`, unit: `${Math.round((diet.protein*4/totalKcal)*100)}%`, color: 'text-blue-600' },
                            { label: 'Carboidratos', value: `${diet.carbs}g`, unit: `${Math.round((diet.carbs*4/totalKcal)*100)}%`, color: 'text-orange-500' },
                            { label: 'Gorduras', value: `${diet.fat}g`, unit: `${Math.round((diet.fat*9/totalKcal)*100)}%`, color: 'text-purple-600' },
                          ].map((m) => (
                            <div key={m.label} className="bg-gray-50 rounded-xl p-3 text-center">
                              <div className={`text-xl font-black tracking-tight ${m.color}`}>{m.value}</div>
                              <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mt-0.5">{m.label}</div>
                              <div className="text-[10px] text-gray-400">{m.unit}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        {diet.meals.map((meal) => {
                          const mKcal = meal.items.reduce((s, i) => s + i.kcal, 0)
                          return (
                            <div key={meal.name} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                              <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
                                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-lg flex-shrink-0">
                                  {meal.icon}
                                </div>
                                <div className="flex-1">
                                  <div className="font-bold text-gray-900 text-sm">{meal.name}</div>
                                  <div className="text-xs text-gray-400">{meal.time}</div>
                                </div>
                                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
                                  {mKcal} kcal
                                </span>
                              </div>
                              <table className="w-full">
                                <thead>
                                  <tr className="bg-gray-50">
                                    <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wide px-5 py-2">Alimento</th>
                                    <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wide px-4 py-2">Qtd</th>
                                    <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wide px-4 py-2 hidden sm:table-cell">Prot</th>
                                    <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wide px-4 py-2 hidden sm:table-cell">Carb</th>
                                    <th className="text-right text-[10px] font-bold text-gray-400 uppercase tracking-wide px-5 py-2">Kcal</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {meal.items.map((item) => (
                                    <tr key={item.name} className="border-t border-gray-50 hover:bg-gray-50/50">
                                      <td className="px-5 py-2.5 text-sm font-semibold text-gray-800">{item.name}</td>
                                      <td className="px-4 py-2.5 text-xs text-gray-500">{item.quantity}</td>
                                      <td className="px-4 py-2.5 hidden sm:table-cell">
                                        <span className="text-xs font-semibold text-blue-600">{item.protein}g</span>
                                      </td>
                                      <td className="px-4 py-2.5 hidden sm:table-cell">
                                        <span className="text-xs font-semibold text-orange-500">{item.carbs}g</span>
                                      </td>
                                      <td className="px-5 py-2.5 text-right text-xs font-bold text-gray-600">{item.kcal}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ─── WORKOUT TAB ─── */}
              {tab === 'treino' && (
                <div>
                  {!hasWorkout ? (
                    <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center text-gray-400">
                      <div className="text-4xl mb-3">💪</div>
                      <div className="font-semibold">Nenhum plano de treino</div>
                      <div className="text-sm mt-1">Atribua um plano para este aluno</div>
                      <button
                        onClick={() => openAssign('workout')}
                        className="mt-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                      >
                        + Atribuir Plano de Treino
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-gray-900">{workout.name}</h3>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {workout.daysPerWeek}x por semana · Atualizado em {workout.updatedAt}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openAssign('workout')}
                              className="text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg transition-colors print:hidden"
                            >
                              🔄 Trocar
                            </button>
                            <button
                              onClick={() => window.print()}
                              className="text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg transition-colors print:hidden"
                            >
                              📄 Gerar PDF
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {WEEK_DAYS.map((day) => {
                            const dayData = workout.days[day]
                            const isRest = !dayData
                            return (
                              <button
                                key={day}
                                onClick={() => !isRest && setActiveDay(day)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                                  isRest
                                    ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-default italic'
                                    : activeDay === day
                                    ? 'bg-slate-900 text-white border-slate-900'
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                {day}
                                {isRest && <span className="ml-1 text-[9px]">·休</span>}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {workoutDayObj || extraExercises.length > 0 ? (
                        <>
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-bold text-gray-900">
                                {activeDay}{workoutDayObj ? ` — ${workoutDayObj.focus}` : ' — Personalizado'}
                              </h4>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {allExercises.length} exercícios{workoutDayObj ? ` · ~${workoutDayObj.duration} minutos` : ''}
                              </p>
                            </div>
                            <button
                              onClick={() => setShowAddEx(true)}
                              className="text-xs font-semibold text-green-600 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors print:hidden"
                            >
                              + Adicionar
                            </button>
                          </div>

                          <div className="flex flex-col gap-2.5">
                            {allExercises.map((ex, idx) => (
                              <div
                                key={`${ex.name}-${idx}`}
                                className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-4 hover:shadow-sm transition-shadow"
                              >
                                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sm font-black flex-shrink-0">
                                  {idx + 1}
                                </div>
                                <div className="text-2xl flex-shrink-0">{ex.emoji}</div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-bold text-gray-900 text-sm">{ex.name}</div>
                                  <div className="text-xs text-gray-400 mt-0.5 truncate">{ex.muscle}</div>
                                  <div className="flex flex-wrap gap-1.5 mt-2">
                                    <span className="text-[11px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">
                                      {ex.sets} séries
                                    </span>
                                    <span className="text-[11px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                                      {ex.reps} reps
                                    </span>
                                    <span className="text-[11px] font-bold bg-orange-50 text-orange-700 px-2 py-0.5 rounded-md">
                                      {ex.rest} descanso
                                    </span>
                                    {ex.load && ex.load !== 'Peso corporal' && (
                                      <span className="text-[11px] font-bold bg-green-50 text-green-700 px-2 py-0.5 rounded-md">
                                        {ex.load}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold text-gray-900">{activeDay}</h4>
                            <button
                              onClick={() => setShowAddEx(true)}
                              className="text-xs font-semibold text-green-600 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              + Adicionar exercício
                            </button>
                          </div>
                          <div className="bg-gray-50 rounded-2xl p-8 text-center text-gray-400">
                            <div className="text-2xl mb-2">😴</div>
                            <div className="font-semibold text-sm">Dia de descanso</div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Assign Plan Modal */}
      {showAssign && student && (
        <AssignPlanModal
          student={student}
          defaultType={assignType}
          onClose={() => setShowAssign(false)}
          onAssigned={handleAssigned}
        />
      )}

      {/* Add Exercise Modal */}
      {showAddEx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddEx(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-slate-900 to-[#1e3a5f] px-6 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-white font-black text-lg">Adicionar Exercício</h2>
                <p className="text-white/40 text-xs mt-0.5">{activeDay}{workoutDayObj ? ` — ${workoutDayObj.focus}` : ''}</p>
              </div>
              <button onClick={() => setShowAddEx(false)} className="text-white/40 hover:text-white/80 text-xl transition-colors">✕</button>
            </div>

            <div className="px-6 py-5 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                  Nome do exercício <span className="text-red-400">*</span>
                </label>
                <input
                  value={exForm.name}
                  onChange={e => setEx('name', e.target.value)}
                  placeholder="Ex: Supino Reto com Barra"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-green-500 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Músculo / Foco</label>
                <input
                  value={exForm.muscle}
                  onChange={e => setEx('muscle', e.target.value)}
                  placeholder="Ex: Peitoral, tríceps"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-green-500 focus:bg-white transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'sets', label: 'Séries', placeholder: '3' },
                  { key: 'reps', label: 'Repetições', placeholder: '12' },
                  { key: 'rest', label: 'Descanso', placeholder: '60s' },
                  { key: 'load', label: 'Carga', placeholder: 'Ex: 20kg' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">{f.label}</label>
                    <input
                      value={exForm[f.key as keyof typeof exForm]}
                      onChange={e => setEx(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-green-500 focus:bg-white transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/50">
              <button
                onClick={() => setShowAddEx(false)}
                className="text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveExercise}
                disabled={!exForm.name.trim() || exSaving}
                className="bg-green-500 hover:bg-green-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {exSaving ? (
                  <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Salvando...</>
                ) : '+ Adicionar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
