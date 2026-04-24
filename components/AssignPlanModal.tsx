'use client'

import { useState, useEffect } from 'react'
import { getAllDietPlans, getAllWorkoutPlans, saveStudentPlanUpdate, Student, DietPlan, WorkoutPlan } from '@/lib/data'

interface Props {
  student: Student
  defaultType?: 'diet' | 'workout' | null
  onClose: () => void
  onAssigned: () => void
}

export default function AssignPlanModal({ student, defaultType = null, onClose, onAssigned }: Props) {
  const [type, setType] = useState<'diet' | 'workout' | null>(defaultType)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [diets, setDiets] = useState<DietPlan[]>([])
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([])

  useEffect(() => {
    setDiets(getAllDietPlans())
    setWorkouts(getAllWorkoutPlans())
  }, [])

  function handleSave() {
    if (!type || !selectedId) return
    setSaving(true)
    setTimeout(() => {
      const planKey = type === 'diet' ? 'dietPlanId' : 'workoutPlanId'
      const newPlans = student.plans.includes(type) ? student.plans : [...student.plans, type]
      saveStudentPlanUpdate(student.id, { [planKey]: selectedId, plans: newPlans })
      onAssigned()
      setSaving(false)
    }, 500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-[#1e3a5f] px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-white font-black text-lg">Atribuir Plano</h2>
            <p className="text-white/40 text-xs mt-0.5">{student.name}</p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white/80 text-xl transition-colors">✕</button>
        </div>

        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
          {/* Type selector */}
          {!type && (
            <div>
              <p className="text-sm text-gray-600 font-semibold mb-4">Qual tipo de plano deseja atribuir?</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setType('diet')}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-gray-200 hover:border-green-400 hover:bg-green-50 transition-all group"
                >
                  <span className="text-4xl">🥗</span>
                  <div className="font-bold text-gray-700 group-hover:text-green-800">Plano Alimentar</div>
                  <div className="text-xs text-gray-400">Dieta personalizada</div>
                </button>
                <button
                  onClick={() => setType('workout')}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-gray-200 hover:border-orange-400 hover:bg-orange-50 transition-all group"
                >
                  <span className="text-4xl">💪</span>
                  <div className="font-bold text-gray-700 group-hover:text-orange-800">Plano de Treino</div>
                  <div className="text-xs text-gray-400">Treinos semanais</div>
                </button>
              </div>
            </div>
          )}

          {/* Diet plans */}
          {type === 'diet' && (
            <div>
              <p className="text-sm text-gray-600 font-semibold mb-4">Selecione o plano alimentar:</p>
              <div className="flex flex-col gap-3">
                {diets.map(plan => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedId(plan.id)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                      selectedId === plan.id
                        ? 'border-green-400 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-gray-900">{plan.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">Atualizado em {plan.updatedAt}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        selectedId === plan.id ? 'bg-green-500 border-green-500' : 'border-gray-300'
                      }`}>
                        {selectedId === plan.id && <span className="text-white text-xs">✓</span>}
                      </div>
                    </div>
                    <div className="flex gap-3 mt-3">
                      {[
                        { label: 'Kcal', value: plan.totalKcal, color: 'text-orange-600' },
                        { label: 'Prot', value: `${plan.protein}g`, color: 'text-blue-600' },
                        { label: 'Carb', value: `${plan.carbs}g`, color: 'text-orange-500' },
                        { label: 'Gord', value: `${plan.fat}g`, color: 'text-purple-600' },
                      ].map(m => (
                        <div key={m.label} className="bg-white rounded-lg p-2 text-center min-w-[52px] border border-gray-100">
                          <div className={`text-sm font-black ${m.color}`}>{m.value}</div>
                          <div className="text-[9px] text-gray-400 font-semibold uppercase tracking-wide">{m.label}</div>
                        </div>
                      ))}
                      <div className="bg-white rounded-lg p-2 text-center min-w-[52px] border border-gray-100">
                        <div className="text-sm font-black text-gray-700">{plan.meals.length}</div>
                        <div className="text-[9px] text-gray-400 font-semibold uppercase tracking-wide">Refeições</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Workout plans */}
          {type === 'workout' && (
            <div>
              <p className="text-sm text-gray-600 font-semibold mb-4">Selecione o plano de treino:</p>
              <div className="flex flex-col gap-3">
                {workouts.map(plan => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedId(plan.id)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                      selectedId === plan.id
                        ? 'border-orange-400 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-gray-900">{plan.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {plan.daysPerWeek}x por semana · Atualizado em {plan.updatedAt}
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        selectedId === plan.id ? 'bg-orange-500 border-orange-500' : 'border-gray-300'
                      }`}>
                        {selectedId === plan.id && <span className="text-white text-xs">✓</span>}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap mt-3">
                      {Object.entries(plan.days)
                        .filter(([, d]) => d)
                        .map(([day, d]) => (
                          <div key={day} className="bg-white rounded-lg px-2.5 py-1.5 border border-gray-100 text-center">
                            <div className="text-[10px] font-bold text-gray-700">{day.slice(0, 3)}</div>
                            <div className="text-[9px] text-gray-400">{d!.focus.split(' ')[0]}</div>
                          </div>
                        ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/50">
          <button
            onClick={() => { if (type && !defaultType) { setType(null); setSelectedId(null) } else { onClose() } }}
            className="text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
          >
            {type && !defaultType ? '← Voltar' : 'Cancelar'}
          </button>

          {type && (
            <button
              onClick={handleSave}
              disabled={!selectedId || saving}
              className="bg-green-500 hover:bg-green-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Salvando...</>
              ) : '✓ Atribuir Plano'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
