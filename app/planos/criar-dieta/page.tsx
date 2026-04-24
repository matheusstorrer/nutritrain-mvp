'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { saveCustomDietPlan, DietPlan, Meal, MealItem } from '@/lib/data'

interface User { name: string; jobRole: string }

const MEAL_ICONS = ['🌅','🌙','🍽️','🥛','🍎','⚡','💪','🥗','🫐','🧃','🌮','🥚','🍌','🥜','🍵']

const emptyItem = (): MealItem => ({ name: '', quantity: '', kcal: 0, protein: 0, carbs: 0, fat: 0 })
const emptyMeal = (): Meal & { _id: string } => ({
  _id: Math.random().toString(36).slice(2),
  name: '',
  time: '',
  icon: '🍽️',
  items: [emptyItem()],
})

function calcTotals(meals: Meal[]) {
  return meals.reduce(
    (acc, m) => {
      m.items.forEach(i => {
        acc.kcal += i.kcal
        acc.protein += i.protein
        acc.carbs += i.carbs
        acc.fat += i.fat
      })
      return acc
    },
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  )
}

export default function CriarDietaPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [planName, setPlanName] = useState('')
  const [meals, setMeals] = useState([emptyMeal()])
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [iconPickerIdx, setIconPickerIdx] = useState<number | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('nt_user')
    if (!stored) { router.push('/'); return }
    const u = JSON.parse(stored)
    if (u.role !== 'professional') { router.push('/portal'); return }
    setUser({ name: u.name, jobRole: u.jobRole })
  }, [router])

  if (!user) return null

  const totals = calcTotals(meals)

  // Meal helpers
  function updateMeal(idx: number, patch: Partial<Meal>) {
    setMeals(prev => prev.map((m, i) => i === idx ? { ...m, ...patch } : m))
  }

  function addMeal() {
    setMeals(prev => [...prev, emptyMeal()])
  }

  function removeMeal(idx: number) {
    setMeals(prev => prev.filter((_, i) => i !== idx))
  }

  // Item helpers
  function updateItem(mIdx: number, iIdx: number, patch: Partial<MealItem>) {
    setMeals(prev => prev.map((m, mi) => {
      if (mi !== mIdx) return m
      return { ...m, items: m.items.map((it, ii) => ii === iIdx ? { ...it, ...patch } : it) }
    }))
  }

  function addItem(mIdx: number) {
    setMeals(prev => prev.map((m, mi) =>
      mi === mIdx ? { ...m, items: [...m.items, emptyItem()] } : m
    ))
  }

  function removeItem(mIdx: number, iIdx: number) {
    setMeals(prev => prev.map((m, mi) =>
      mi === mIdx ? { ...m, items: m.items.filter((_, ii) => ii !== iIdx) } : m
    ))
  }

  function validate() {
    const errs: string[] = []
    if (!planName.trim()) errs.push('Nome do plano é obrigatório.')
    meals.forEach((m, mi) => {
      if (!m.name.trim()) errs.push(`Refeição ${mi + 1}: nome obrigatório.`)
      if (m.items.length === 0) errs.push(`Refeição ${mi + 1}: adicione ao menos um alimento.`)
      m.items.forEach((it, ii) => {
        if (!it.name.trim()) errs.push(`Refeição ${mi + 1}, item ${ii + 1}: nome obrigatório.`)
      })
    })
    return errs
  }

  function handleSave() {
    const errs = validate()
    if (errs.length) { setErrors(errs); return }
    setErrors([])
    setSaving(true)
    const now = new Date().toLocaleDateString('pt-BR')
    const plan: DietPlan = {
      id: `custom_${Date.now()}`,
      name: planName.trim(),
      totalKcal: totals.kcal,
      protein: totals.protein,
      carbs: totals.carbs,
      fat: totals.fat,
      updatedAt: now,
      meals: meals.map(({ _id, ...m }) => ({ ...m, items: m.items })),
    }
    setTimeout(() => {
      saveCustomDietPlan(plan)
      router.push('/planos?tipo=dieta')
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
              <span className="text-gray-600 font-medium">Criar Plano Alimentar</span>
            </div>
            <h1 className="text-[17px] font-bold text-gray-900">Novo Plano Alimentar</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/planos')}
              className="text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors px-4 py-2 rounded-xl border border-gray-200 hover:border-gray-300"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-500 hover:bg-green-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-60 flex items-center gap-2"
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

          {/* Nome do plano + Totais */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nome do Plano</label>
            <input
              value={planName}
              onChange={e => setPlanName(e.target.value)}
              placeholder="Ex: Emagrecimento Saudável, Bulking Clean…"
              className="w-full text-lg font-bold text-gray-900 border-0 outline-none bg-transparent placeholder:text-gray-300 placeholder:font-normal"
            />

            {totals.kcal > 0 && (
              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                {[
                  { label: 'Kcal total', value: totals.kcal, color: 'text-orange-600' },
                  { label: 'Proteína', value: `${totals.protein}g`, color: 'text-blue-600' },
                  { label: 'Carboidrato', value: `${totals.carbs}g`, color: 'text-orange-500' },
                  { label: 'Gordura', value: `${totals.fat}g`, color: 'text-purple-600' },
                ].map(m => (
                  <div key={m.label} className="bg-gray-50 rounded-xl p-3 text-center flex-1">
                    <div className={`text-base font-black ${m.color}`}>{m.value}</div>
                    <div className="text-[9px] text-gray-400 font-semibold uppercase tracking-wide mt-0.5">{m.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Refeições */}
          {meals.map((meal, mIdx) => (
            <div key={meal._id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {/* Meal header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50/60">
                {/* Icon picker */}
                <div className="relative">
                  <button
                    onClick={() => setIconPickerIdx(iconPickerIdx === mIdx ? null : mIdx)}
                    className="text-2xl w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    {meal.icon}
                  </button>
                  {iconPickerIdx === mIdx && (
                    <div className="absolute top-12 left-0 z-20 bg-white border border-gray-200 rounded-xl shadow-lg p-2 grid grid-cols-5 gap-1 w-44">
                      {MEAL_ICONS.map(icon => (
                        <button
                          key={icon}
                          onClick={() => { updateMeal(mIdx, { icon }); setIconPickerIdx(null) }}
                          className={`text-xl w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors ${meal.icon === icon ? 'bg-green-50 ring-1 ring-green-400' : ''}`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <input
                  value={meal.name}
                  onChange={e => updateMeal(mIdx, { name: e.target.value })}
                  placeholder="Nome da refeição (ex: Café da Manhã)"
                  className="flex-1 font-bold text-gray-900 border-0 outline-none bg-transparent placeholder:text-gray-300 placeholder:font-normal text-sm"
                />

                <input
                  value={meal.time}
                  onChange={e => updateMeal(mIdx, { time: e.target.value })}
                  placeholder="07:00"
                  className="w-16 text-sm font-semibold text-gray-500 border border-gray-200 rounded-lg px-2 py-1 text-center outline-none focus:border-green-400 focus:ring-1 focus:ring-green-100"
                />

                {meals.length > 1 && (
                  <button
                    onClick={() => removeMeal(mIdx)}
                    className="text-gray-300 hover:text-red-400 transition-colors text-lg flex-shrink-0"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Items table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-400 font-semibold uppercase tracking-wider border-b border-gray-100">
                      <th className="text-left px-5 py-2.5 w-[35%]">Alimento</th>
                      <th className="text-left px-3 py-2.5 w-[16%]">Quantidade</th>
                      <th className="text-center px-3 py-2.5">Kcal</th>
                      <th className="text-center px-3 py-2.5">Prot(g)</th>
                      <th className="text-center px-3 py-2.5">Carb(g)</th>
                      <th className="text-center px-3 py-2.5">Gord(g)</th>
                      <th className="px-3 py-2.5 w-8"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {meal.items.map((item, iIdx) => (
                      <tr key={iIdx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                        <td className="px-5 py-2">
                          <input
                            value={item.name}
                            onChange={e => updateItem(mIdx, iIdx, { name: e.target.value })}
                            placeholder="Nome do alimento"
                            className="w-full outline-none bg-transparent text-gray-800 font-medium placeholder:text-gray-300"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            value={item.quantity}
                            onChange={e => updateItem(mIdx, iIdx, { quantity: e.target.value })}
                            placeholder="100g"
                            className="w-full outline-none bg-transparent text-gray-600 placeholder:text-gray-300"
                          />
                        </td>
                        {(['kcal', 'protein', 'carbs', 'fat'] as const).map(field => (
                          <td key={field} className="px-3 py-2">
                            <input
                              type="number"
                              min={0}
                              value={item[field] || ''}
                              onChange={e => updateItem(mIdx, iIdx, { [field]: Number(e.target.value) || 0 })}
                              placeholder="0"
                              className="w-full text-center outline-none bg-transparent text-gray-700 font-semibold placeholder:text-gray-200"
                            />
                          </td>
                        ))}
                        <td className="px-3 py-2">
                          {meal.items.length > 1 && (
                            <button
                              onClick={() => removeItem(mIdx, iIdx)}
                              className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all"
                            >
                              ✕
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Meal footer */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                <button
                  onClick={() => addItem(mIdx)}
                  className="text-xs font-semibold text-green-600 hover:text-green-700 transition-colors flex items-center gap-1"
                >
                  + Adicionar alimento
                </button>
                <div className="text-xs font-bold text-orange-600">
                  {meal.items.reduce((s, i) => s + i.kcal, 0)} kcal
                </div>
              </div>
            </div>
          ))}

          {/* Add meal button */}
          <button
            onClick={addMeal}
            className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-green-400 hover:text-green-600 hover:bg-green-50/40 transition-all font-semibold text-sm flex items-center justify-center gap-2"
          >
            + Adicionar Refeição
          </button>
        </div>
      </div>
    </div>
  )
}
