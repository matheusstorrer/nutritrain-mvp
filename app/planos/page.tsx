'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { getAllDietPlans, workoutPlans, getAllStudents, WEEK_DAYS, DietPlan, WorkoutPlan } from '@/lib/data'
import { Suspense } from 'react'

interface User { name: string; jobRole: string }

function planStudentCount(planId: string, type: 'diet' | 'workout') {
  const all = getAllStudents()
  return all.filter(s => type === 'diet' ? s.dietPlanId === planId : s.workoutPlanId === planId).length
}

function DietCard({ plan }: { plan: DietPlan }) {
  const [expanded, setExpanded] = useState(false)
  const count = planStudentCount(plan.id, 'diet')
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-gray-900">{plan.name}</h3>
            <p className="text-xs text-gray-400 mt-0.5">Atualizado em {plan.updatedAt}</p>
          </div>
          <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-green-100 text-green-700 flex-shrink-0">
            {count} aluno{count !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { label: 'Kcal', value: plan.totalKcal, color: 'text-orange-600' },
            { label: 'Prot', value: `${plan.protein}g`, color: 'text-blue-600' },
            { label: 'Carb', value: `${plan.carbs}g`, color: 'text-orange-500' },
            { label: 'Gord', value: `${plan.fat}g`, color: 'text-purple-600' },
          ].map(m => (
            <div key={m.label} className="bg-gray-50 rounded-xl p-2.5 text-center">
              <div className={`text-sm font-black ${m.color}`}>{m.value}</div>
              <div className="text-[9px] text-gray-400 font-semibold uppercase tracking-wide mt-0.5">{m.label}</div>
            </div>
          ))}
        </div>
        <button
          onClick={() => setExpanded(e => !e)}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          {expanded ? '▲ Ocultar refeições' : `▼ Ver ${plan.meals.length} refeições`}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-gray-100">
          {plan.meals.map(meal => (
            <div key={meal.name} className="px-5 py-3 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">{meal.icon}</span>
                <span className="font-semibold text-gray-900 text-sm">{meal.name}</span>
                <span className="text-xs text-gray-400">{meal.time}</span>
                <span className="ml-auto text-xs font-bold text-orange-600">
                  {meal.items.reduce((s, i) => s + i.kcal, 0)} kcal
                </span>
              </div>
              <div className="flex flex-col gap-1">
                {meal.items.map(item => (
                  <div key={item.name} className="flex items-center justify-between text-xs text-gray-500">
                    <span>{item.name} <span className="text-gray-400">({item.quantity})</span></span>
                    <span className="font-semibold text-gray-600">{item.kcal} kcal</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function WorkoutCard({ plan }: { plan: WorkoutPlan }) {
  const [activeDay, setActiveDay] = useState<string>(
    WEEK_DAYS.find(d => plan.days[d]) ?? 'Segunda'
  )
  const count = planStudentCount(plan.id, 'workout')
  const dayData = plan.days[activeDay]

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-gray-900">{plan.name}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{plan.daysPerWeek}x por semana · Atualizado em {plan.updatedAt}</p>
          </div>
          <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-orange-100 text-orange-700 flex-shrink-0">
            {count} aluno{count !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {WEEK_DAYS.map(day => {
            const d = plan.days[day]
            const isRest = !d
            return (
              <button
                key={day}
                onClick={() => !isRest && setActiveDay(day)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border ${
                  isRest
                    ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-default'
                    : activeDay === day
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                }`}
              >
                {day.slice(0, 3)}
              </button>
            )
          })}
        </div>

        {dayData ? (
          <div>
            <div className="text-xs font-bold text-gray-700 mb-2">{activeDay} — {dayData.focus}
              <span className="font-normal text-gray-400 ml-2">~{dayData.duration} min · {dayData.exercises.length} exercícios</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {dayData.exercises.map((ex, idx) => (
                <div key={ex.name} className="flex items-center gap-2.5 text-xs text-gray-600">
                  <span className="w-5 h-5 rounded-md bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">{idx + 1}</span>
                  <span>{ex.emoji}</span>
                  <span className="font-semibold text-gray-800">{ex.name}</span>
                  <span className="ml-auto text-gray-400 flex-shrink-0">{ex.sets}×{ex.reps}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-xs text-gray-400 text-center py-3">😴 Dia de descanso</div>
        )}
      </div>
    </div>
  )
}

function PlanosContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tipo = searchParams.get('tipo')
  const [user, setUser] = useState<User | null>(null)
  const [tab, setTab] = useState<'dieta' | 'treino'>(tipo === 'treino' ? 'treino' : 'dieta')
  const [, forceUpdate] = useState(0)

  useEffect(() => {
    const stored = localStorage.getItem('nt_user')
    if (!stored) { router.push('/'); return }
    const u = JSON.parse(stored)
    if (u.role !== 'professional') { router.push('/portal'); return }
    setUser({ name: u.name, jobRole: u.jobRole })
    forceUpdate(n => n + 1)
  }, [router])

  useEffect(() => {
    if (tipo === 'treino') setTab('treino')
    else if (tipo === 'dieta') setTab('dieta')
  }, [tipo])

  if (!user) return null

  const diets = getAllDietPlans()
  const workouts = Object.values(workoutPlans)

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userName={user.name} userRole={user.jobRole} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-7 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-[17px] font-bold text-gray-900">Planos</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {diets.length} planos alimentares · {workouts.length} planos de treino
            </p>
          </div>
          {tab === 'dieta' && (
            <button
              onClick={() => router.push('/planos/criar-dieta')}
              className="bg-green-500 hover:bg-green-600 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2"
            >
              + Criar Plano Alimentar
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-6">
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
            <button
              onClick={() => setTab('dieta')}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === 'dieta' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              🥗 Planos Alimentares
            </button>
            <button
              onClick={() => setTab('treino')}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === 'treino' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              💪 Planos de Treino
            </button>
          </div>

          {tab === 'dieta' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {diets.map(plan => <DietCard key={plan.id} plan={plan} />)}
            </div>
          )}

          {tab === 'treino' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {workouts.map(plan => <WorkoutCard key={plan.id} plan={plan} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PlanosPage() {
  return (
    <Suspense>
      <PlanosContent />
    </Suspense>
  )
}
