'use client'

import { useState } from 'react'
import { Student } from '@/lib/data'

interface Props {
  onClose: () => void
  onAdd: (student: Student) => void
}

const GOALS = ['Emagrecimento', 'Ganho de massa', 'Condicionamento físico', 'Definição muscular', 'Saúde geral', 'Reabilitação']
const AVATAR_COLORS = [
  'from-orange-400 to-red-500',
  'from-blue-400 to-violet-500',
  'from-emerald-400 to-teal-500',
  'from-purple-400 to-pink-500',
  'from-cyan-400 to-blue-500',
  'from-yellow-400 to-orange-500',
  'from-green-400 to-emerald-600',
  'from-rose-400 to-pink-600',
]

function generatePassword() {
  const chars = 'abcdefghijkmnpqrstuvwxyz23456789'
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

function getInitials(name: string) {
  return name.trim().split(' ').filter(Boolean).map(w => w[0].toUpperCase()).slice(0, 2).join('')
}

export default function NewStudentModal({ onClose, onAdd }: Props) {
  const [step, setStep] = useState<1 | 2>(1)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: generatePassword(),
    phone: '',
    age: '',
    height: '',
    weight: '',
    goal: 'Emagrecimento',
    hasDiet: false,
    hasWorkout: false,
    nutritionist: 'Ana Paula',
    trainer: '',
    obs: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function set(key: string, value: string | boolean) {
    setForm(f => ({ ...f, [key]: value }))
    setErrors(e => ({ ...e, [key]: '' }))
  }

  function validateStep1() {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Nome é obrigatório'
    if (!form.email.trim()) e.email = 'Email é obrigatório'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email inválido'
    if (!form.password.trim()) e.password = 'Senha é obrigatória'
    else if (form.password.length < 6) e.password = 'Mínimo 6 caracteres'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleNext() {
    if (validateStep1()) setStep(2)
  }

  function handleSave() {
    setSaving(true)
    setTimeout(() => {
      const initials = getInitials(form.name)
      const color = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]
      const plans: ('diet' | 'workout')[] = []
      if (form.hasDiet) plans.push('diet')
      if (form.hasWorkout) plans.push('workout')

      const newStudent: Student = {
        id: `custom_${Date.now()}`,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        age: form.age ? parseInt(form.age) : 0,
        height: form.height ? parseFloat(form.height) : 0,
        weight: form.weight ? parseFloat(form.weight) : 0,
        goal: form.goal,
        phone: form.phone,
        nutritionist: form.nutritionist,
        trainer: form.trainer,
        plans,
        status: 'new',
        lastUpdate: 'Agora',
        initials,
        avatarColor: color,
        dietPlanId: null,
        workoutPlanId: null,
        obs: form.obs,
      }

      // persist in localStorage
      try {
        const stored = JSON.parse(localStorage.getItem('nt_extra_students') ?? '[]')
        localStorage.setItem('nt_extra_students', JSON.stringify([...stored, newStudent]))
      } catch {}

      onAdd(newStudent)
      setSaving(false)
    }, 700)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-[#1e3a5f] px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-white font-black text-lg">Novo Aluno</h2>
            <p className="text-white/40 text-xs mt-0.5">
              Passo {step} de 2 — {step === 1 ? 'Dados pessoais' : 'Planos e observações'}
            </p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white/80 text-xl transition-colors">✕</button>
        </div>

        {/* Step indicator */}
        <div className="flex h-1">
          <div className="bg-green-500 transition-all duration-300" style={{ width: step === 1 ? '50%' : '100%' }} />
          <div className="bg-gray-100 flex-1" />
        </div>

        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
          {step === 1 && (
            <div className="flex flex-col gap-4">
              {/* Nome */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                  Nome completo <span className="text-red-400">*</span>
                </label>
                <input
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  placeholder="Ex: Maria Fernanda Costa"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:border-green-500 focus:bg-white'}`}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder="aluno@email.com"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:border-green-500 focus:bg-white'}`}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              {/* Senha */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                  Senha de acesso <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    value={form.password}
                    onChange={e => set('password', e.target.value)}
                    placeholder="Senha do aluno"
                    className={`flex-1 px-3.5 py-2.5 rounded-xl border text-sm font-mono focus:outline-none transition-colors ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:border-green-500 focus:bg-white'}`}
                  />
                  <button
                    type="button"
                    onClick={() => set('password', generatePassword())}
                    className="px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-100 transition-colors whitespace-nowrap"
                  >
                    🔄 Gerar
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                <p className="text-xs text-gray-400 mt-1">O aluno vai usar essa senha para acessar o portal.</p>
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Telefone / WhatsApp</label>
                <input
                  value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                  placeholder="(11) 99999-0000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-green-500 focus:bg-white transition-colors"
                />
              </div>

              {/* Medidas */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'age', label: 'Idade', placeholder: '28', unit: 'anos' },
                  { key: 'height', label: 'Altura', placeholder: '165', unit: 'cm' },
                  { key: 'weight', label: 'Peso atual', placeholder: '68', unit: 'kg' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">{f.label}</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={form[f.key as keyof typeof form] as string}
                        onChange={e => set(f.key, e.target.value)}
                        placeholder={f.placeholder}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-green-500 focus:bg-white transition-colors pr-8"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">{f.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              {/* Objetivo */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Objetivo</label>
                <div className="grid grid-cols-2 gap-2">
                  {GOALS.map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => set('goal', g)}
                      className={`px-3 py-2.5 rounded-xl border text-sm font-semibold text-left transition-all ${
                        form.goal === g
                          ? 'bg-green-50 border-green-400 text-green-800'
                          : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Planos */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Planos disponíveis</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => set('hasDiet', !form.hasDiet)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      form.hasDiet ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl">🥗</span>
                    <div className="text-left">
                      <div className={`font-bold text-sm ${form.hasDiet ? 'text-green-800' : 'text-gray-700'}`}>Dieta</div>
                      <div className="text-xs text-gray-400">Plano alimentar</div>
                    </div>
                    <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${form.hasDiet ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                      {form.hasDiet && <span className="text-white text-xs">✓</span>}
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => set('hasWorkout', !form.hasWorkout)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      form.hasWorkout ? 'border-orange-400 bg-orange-50' : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl">💪</span>
                    <div className="text-left">
                      <div className={`font-bold text-sm ${form.hasWorkout ? 'text-orange-800' : 'text-gray-700'}`}>Treino</div>
                      <div className="text-xs text-gray-400">Plano de treino</div>
                    </div>
                    <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${form.hasWorkout ? 'bg-orange-500 border-orange-500' : 'border-gray-300'}`}>
                      {form.hasWorkout && <span className="text-white text-xs">✓</span>}
                    </div>
                  </button>
                </div>
              </div>

              {/* Responsáveis */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Nutricionista</label>
                  <select
                    value={form.nutritionist}
                    onChange={e => set('nutritionist', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-green-500 focus:bg-white transition-colors"
                  >
                    <option value="">— Nenhuma —</option>
                    <option>Ana Paula</option>
                    <option>Juliana Torres</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Personal Trainer</label>
                  <select
                    value={form.trainer}
                    onChange={e => set('trainer', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-green-500 focus:bg-white transition-colors"
                  >
                    <option value="">— Nenhum —</option>
                    <option>Ana Paula</option>
                    <option>Juliana Torres</option>
                  </select>
                </div>
              </div>

              {/* Obs */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Observações</label>
                <textarea
                  value={form.obs}
                  onChange={e => set('obs', e.target.value)}
                  placeholder="Alergias, restrições, histórico de saúde, preferências..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-green-500 focus:bg-white transition-colors resize-none"
                />
              </div>

              {/* Preview do login */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">📋 Dados de acesso do aluno</div>
                <div className="text-sm text-slate-700">
                  <div><span className="text-slate-400">Email:</span> <span className="font-mono font-semibold">{form.email || '—'}</span></div>
                  <div className="mt-1"><span className="text-slate-400">Senha:</span> <span className="font-mono font-semibold">{form.password}</span></div>
                </div>
                <p className="text-xs text-slate-400 mt-2">Compartilhe esses dados com o aluno para ele acessar o portal.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/50">
          <button
            onClick={step === 1 ? onClose : () => setStep(1)}
            className="text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
          >
            {step === 1 ? 'Cancelar' : '← Voltar'}
          </button>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${step === 1 ? 'bg-green-500' : 'bg-gray-300'}`} />
            <div className={`w-2 h-2 rounded-full ${step === 2 ? 'bg-green-500' : 'bg-gray-300'}`} />
          </div>
          {step === 1 ? (
            <button
              onClick={handleNext}
              className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
            >
              Próximo →
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-500 hover:bg-green-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              {saving ? (
                <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Salvando...</>
              ) : '✓ Cadastrar Aluno'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
