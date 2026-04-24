'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import { getStudent, getDietPlan, getWorkoutPlan, WEEK_DAYS } from '@/lib/data'

interface User { name: string; jobRole: string }

export default function StudentProfilePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [user, setUser] = useState<User | null>(null)
  const [tab, setTab] = useState<'dieta' | 'treino'>('dieta')
  const [activeDay, setActiveDay] = useState('Segunda')

  useEffect(() => {
    const stored = localStorage.getItem('nt_user')
    if (!stored) { router.push('/'); return }
    const u = JSON.parse(stored)
    if (u.role !== 'professional') { router.push('/portal'); return }
    setUser({ name: u.name, jobRole: u.jobRole })
  }, [router])

  const student = getStudent(id)
  const diet = getDietPlan(student?.dietPlanId ?? null)
  const workout = getWorkoutPlan(student?.workoutPlanId ?? null)

  if (!user) return null
  if (!student) return (
    <div className="flex h-screen items-center justify-center text-gray-400">
      Aluno não encontrado. <Link href="/alunos" className="ml-2 text-blue-600 underline">Voltar</Link>
    </div>
  )

  const hasDiet = !!diet
  const hasWorkout = !!workout

  // Macro totals from meals
  const totalKcal = diet ? diet.meals.reduce((s, m) => s + m.items.reduce((a, i) => a + i.kcal, 0), 0) : 0

  const workoutDayObj = workout?.days[activeDay]

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userName={user.name} userRole={user.jobRole} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="bg-white border-b border-gray-200 px-7 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/alunos" className="text-gray-400 hover:text-gray-600 text-sm">← Alunos</Link>
            <span className="text-gray-300">/</span>
            <span className="text-sm font-semibold text-gray-900">{student.name}</span>
          </div>
          <div className="flex gap-2">
            <button className="text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-lg transition-colors">
              ✉️ Email
            </button>
            <button className="text-sm font-semibold text-white bg-green-500 hover:bg-green-600 px-3 py-1.5 rounded-lg transition-colors">
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
              {/* Tab bar */}
              <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-5 w-fit">
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
                      <div className="text-sm mt-1">Crie um plano para este aluno</div>
                      <button className="mt-4 bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-lg">
                        + Criar Plano Alimentar
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Diet header */}
                      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-gray-900">{diet.name}</h3>
                            <p className="text-xs text-gray-400 mt-0.5">Atualizado em {diet.updatedAt}</p>
                          </div>
                          <button className="text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg transition-colors">
                            📄 Gerar PDF
                          </button>
                        </div>
                        {/* Macros */}
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

                      {/* Meals */}
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
                      <div className="text-sm mt-1">Crie um plano para este aluno</div>
                      <button className="mt-4 bg-slate-900 text-white text-sm font-semibold px-4 py-2 rounded-lg">
                        + Criar Plano de Treino
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Workout header */}
                      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-gray-900">{workout.name}</h3>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {workout.daysPerWeek}x por semana · Atualizado em {workout.updatedAt}
                            </p>
                          </div>
                          <button className="text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg transition-colors">
                            📄 Gerar PDF
                          </button>
                        </div>
                        {/* Day selector */}
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

                      {/* Exercise list */}
                      {workoutDayObj ? (
                        <>
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-bold text-gray-900">{activeDay} — {workoutDayObj.focus}</h4>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {workoutDayObj.exercises.length} exercícios · ~{workoutDayObj.duration} minutos
                              </p>
                            </div>
                            <button className="text-xs font-semibold text-green-600 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors">
                              + Adicionar
                            </button>
                          </div>

                          <div className="flex flex-col gap-2.5">
                            {workoutDayObj.exercises.map((ex, idx) => (
                              <div
                                key={ex.name}
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
                        <div className="bg-gray-50 rounded-2xl p-8 text-center text-gray-400">
                          <div className="text-2xl mb-2">😴</div>
                          <div className="font-semibold text-sm">Dia de descanso</div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
