'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getStudent, getDietPlan, getWorkoutPlan, WEEK_DAYS } from '@/lib/data'

type View = 'home' | 'dieta' | 'treino'

export default function PortalPage() {
  const router = useRouter()
  const [view, setView] = useState<View>('home')
  const [activeDay, setActiveDay] = useState('Segunda')
  const [studentId, setStudentId] = useState<string | null>(null)
  const [studentName, setStudentName] = useState('')
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('nt_user')
    if (!stored) { router.push('/'); return }
    const u = JSON.parse(stored)
    if (u.role !== 'student') { router.push('/dashboard'); return }
    setStudentId(u.studentId)
    setStudentName(u.name)
  }, [router])

  const student = studentId ? getStudent(studentId) : null
  const diet = student ? getDietPlan(student.dietPlanId) : null
  const workout = student ? getWorkoutPlan(student.workoutPlanId) : null

  if (!student) return null

  const workoutDayObj = workout?.days[activeDay]
  const todayName = new Date().toLocaleDateString('pt-BR', { weekday: 'long' })

  // Map today to week day
  const todayMap: Record<string, string> = {
    'segunda-feira': 'Segunda',
    'terça-feira': 'Terça',
    'quarta-feira': 'Quarta',
    'quinta-feira': 'Quinta',
    'sexta-feira': 'Sexta',
    'sábado': 'Sábado',
    'domingo': 'Domingo',
  }
  const todayKey = todayMap[todayName] ?? 'Segunda'
  const todayWorkout = workout?.days[todayKey]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto relative">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-[#1e3a5f] px-5 pt-10 pb-14">
        <div className="flex items-center justify-between mb-1">
          <div className="text-white/50 text-sm capitalize">{todayName} 👋</div>
          <button
            onClick={() => { localStorage.removeItem('nt_user'); router.push('/') }}
            className="text-white/30 hover:text-white/60 text-xs transition-colors"
          >
            Sair ↩
          </button>
        </div>
        <div className="text-white text-2xl font-black tracking-tight">{studentName.split(' ')[0]}</div>
        <div className="flex gap-2 mt-3">
          {student.plans.includes('diet') && (
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-white/70 border border-white/10">
              🥗 Dieta ativa
            </span>
          )}
          {student.plans.includes('workout') && (
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-white/70 border border-white/10">
              💪 Treino ativo
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 -mt-8 rounded-t-3xl bg-gray-50 overflow-y-auto pb-20 no-scrollbar">
        {/* ─── HOME ─── */}
        {view === 'home' && (
          <div className="px-4 pt-6">
            <h2 className="font-bold text-gray-900 mb-4">Meus Planos</h2>

            <div className="flex flex-col gap-3 mb-6">
              {student.plans.includes('diet') && diet && (
                <button
                  onClick={() => setView('dieta')}
                  className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-3 text-left hover:shadow-sm transition-all active:scale-[0.99]"
                >
                  <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-xl flex-shrink-0">🥗</div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 text-sm">Plano Alimentar</div>
                    <div className="text-xs text-gray-400 mt-0.5">{diet.name} · {diet.totalKcal} kcal/dia</div>
                  </div>
                  <span className="text-gray-300 text-lg">›</span>
                </button>
              )}
              {student.plans.includes('workout') && workout && (
                <button
                  onClick={() => setView('treino')}
                  className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-3 text-left hover:shadow-sm transition-all active:scale-[0.99]"
                >
                  <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center text-xl flex-shrink-0">💪</div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 text-sm">Plano de Treino</div>
                    <div className="text-xs text-gray-400 mt-0.5">{workout.name} · {workout.daysPerWeek}x/semana</div>
                  </div>
                  <span className="text-gray-300 text-lg">›</span>
                </button>
              )}
            </div>

            {/* Today's workout */}
            {todayWorkout && (
              <div>
                <h2 className="font-bold text-gray-900 mb-3">Treino de Hoje</h2>
                <div
                  className="bg-gradient-to-br from-slate-900 to-[#1e3a5f] rounded-2xl p-5 cursor-pointer active:scale-[0.99] transition-transform"
                  onClick={() => { setActiveDay(todayKey); setView('treino') }}
                >
                  <div className="text-white/50 text-xs mb-1 uppercase tracking-wide">{todayKey}</div>
                  <div className="text-white font-black text-lg mb-1">{todayWorkout.focus}</div>
                  <div className="text-white/50 text-xs mb-4">
                    {todayWorkout.exercises.length} exercícios · ~{todayWorkout.duration} min
                  </div>
                  <div className="bg-green-500 text-white text-sm font-bold rounded-xl py-2.5 text-center">
                    Ver treino de hoje →
                  </div>
                </div>
              </div>
            )}

            {!todayWorkout && diet && (
              <div>
                <h2 className="font-bold text-gray-900 mb-3">Próxima Refeição</h2>
                <div className="bg-white rounded-2xl border border-gray-200 p-4">
                  {diet.meals.slice(0, 2).map((meal) => (
                    <div key={meal.name} className="flex items-center gap-3 py-2 first:pt-0 last:pb-0 border-b border-gray-50 last:border-0">
                      <span className="text-xl">{meal.icon}</span>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{meal.name}</div>
                        <div className="text-xs text-gray-400">{meal.time} · {meal.items.reduce((s, i) => s + i.kcal, 0)} kcal</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── DIET VIEW ─── */}
        {view === 'dieta' && diet && (
          <div className="px-4 pt-6">
            <div className="flex items-center gap-2 mb-5">
              <button onClick={() => setView('home')} className="text-gray-400 hover:text-gray-600 text-sm">← Início</button>
              <span className="text-gray-300">/</span>
              <span className="text-sm font-semibold text-gray-900">Plano Alimentar</span>
            </div>

            {/* Macros */}
            <div className="grid grid-cols-4 gap-2 mb-5">
              {[
                { label: 'Kcal', value: diet.totalKcal.toString(), color: 'text-orange-600' },
                { label: 'Prot', value: `${diet.protein}g`, color: 'text-blue-600' },
                { label: 'Carb', value: `${diet.carbs}g`, color: 'text-orange-500' },
                { label: 'Gord', value: `${diet.fat}g`, color: 'text-purple-600' },
              ].map((m) => (
                <div key={m.label} className="bg-white rounded-xl border border-gray-200 p-2.5 text-center">
                  <div className={`text-base font-black ${m.color}`}>{m.value}</div>
                  <div className="text-[9px] text-gray-400 font-semibold uppercase tracking-wide mt-0.5">{m.label}</div>
                </div>
              ))}
            </div>

            {/* Meals accordion */}
            <div className="flex flex-col gap-2.5">
              {diet.meals.map((meal) => {
                const mKcal = meal.items.reduce((s, i) => s + i.kcal, 0)
                const isOpen = expandedMeal === meal.name
                return (
                  <div key={meal.name} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <button
                      onClick={() => setExpandedMeal(isOpen ? null : meal.name)}
                      className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                    >
                      <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-lg flex-shrink-0">
                        {meal.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900 text-sm">{meal.name}</div>
                        <div className="text-xs text-gray-400">{meal.time}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">{mKcal} kcal</span>
                        <span className={`text-gray-400 text-sm transition-transform ${isOpen ? 'rotate-90' : ''}`}>›</span>
                      </div>
                    </button>

                    {isOpen && (
                      <div className="border-t border-gray-100">
                        {meal.items.map((item) => (
                          <div key={item.name} className="flex items-center justify-between px-4 py-2.5 border-b border-gray-50 last:border-0">
                            <div>
                              <div className="text-sm font-semibold text-gray-800">{item.name}</div>
                              <div className="text-xs text-gray-400 mt-0.5">
                                <span className="text-blue-500 font-semibold">P:{item.protein}g</span>
                                <span className="mx-1 text-gray-300">·</span>
                                <span className="text-orange-500 font-semibold">C:{item.carbs}g</span>
                                <span className="mx-1 text-gray-300">·</span>
                                <span className="text-purple-500 font-semibold">G:{item.fat}g</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs font-bold text-gray-500">{item.quantity}</div>
                              <div className="text-xs font-bold text-orange-600">{item.kcal} kcal</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ─── WORKOUT VIEW ─── */}
        {view === 'treino' && workout && (
          <div className="px-4 pt-6">
            <div className="flex items-center gap-2 mb-5">
              <button onClick={() => setView('home')} className="text-gray-400 hover:text-gray-600 text-sm">← Início</button>
              <span className="text-gray-300">/</span>
              <span className="text-sm font-semibold text-gray-900">Plano de Treino</span>
            </div>

            {/* Day pills */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-5">
              {WEEK_DAYS.map((day) => {
                const dayData = workout.days[day]
                const isRest = !dayData
                return (
                  <button
                    key={day}
                    onClick={() => !isRest && setActiveDay(day)}
                    className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                      isRest
                        ? 'bg-gray-100 text-gray-300 border-transparent cursor-default'
                        : activeDay === day
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-gray-500 border-gray-200'
                    }`}
                  >
                    <div>{day.slice(0, 3)}</div>
                    {!isRest && dayData && (
                      <div className="text-[9px] mt-0.5 opacity-60 font-normal">
                        {dayData.focus.split(' ')[0]}
                      </div>
                    )}
                    {isRest && <div className="text-[9px] mt-0.5">休</div>}
                  </button>
                )
              })}
            </div>

            {workoutDayObj ? (
              <>
                <div className="mb-4">
                  <h3 className="font-black text-gray-900">{activeDay} — {workoutDayObj.focus}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {workoutDayObj.exercises.length} exercícios · ~{workoutDayObj.duration} min
                  </p>
                </div>

                <div className="flex flex-col gap-2.5">
                  {workoutDayObj.exercises.map((ex, idx) => (
                    <div key={ex.name} className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-black flex-shrink-0">
                        {idx + 1}
                      </div>
                      <span className="text-xl flex-shrink-0">{ex.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-900 text-sm">{ex.name}</div>
                        <div className="text-xs text-gray-400 truncate mt-0.5">{ex.muscle}</div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          <span className="text-[11px] font-bold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{ex.sets} séries</span>
                          <span className="text-[11px] font-bold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">{ex.reps} reps</span>
                          <span className="text-[11px] font-bold bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded">{ex.rest}</span>
                          {ex.load !== 'Peso corporal' && (
                            <span className="text-[11px] font-bold bg-green-50 text-green-700 px-1.5 py-0.5 rounded">{ex.load}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-gray-400">
                <div className="text-3xl mb-3">😴</div>
                <div className="font-semibold">Dia de descanso</div>
                <div className="text-sm mt-1">Aproveite para recuperar!</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 grid grid-cols-3 py-2 px-2 safe-area-inset-bottom">
        {([
          { key: 'home', icon: '🏠', label: 'Início' },
          { key: 'dieta', icon: '🥗', label: 'Dieta' },
          { key: 'treino', icon: '💪', label: 'Treino' },
        ] as const).map((item) => (
          <button
            key={item.key}
            onClick={() => setView(item.key)}
            className={`flex flex-col items-center gap-0.5 py-1 rounded-xl transition-colors ${
              view === item.key ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className={`text-[10px] font-semibold ${view === item.key ? 'text-green-600' : 'text-gray-400'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
