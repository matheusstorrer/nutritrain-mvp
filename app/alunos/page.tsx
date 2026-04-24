'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import NewStudentModal from '@/components/NewStudentModal'
import { students as mockStudents, getAllStudents, Student } from '@/lib/data'

interface User { name: string; jobRole: string }

const STATUS_COLORS: Record<string, string> = {
  active: 'text-green-700 bg-green-100',
  pending: 'text-orange-700 bg-orange-100',
  new: 'text-blue-700 bg-blue-100',
}
const STATUS_LABELS: Record<string, string> = { active: 'Ativo', pending: 'Pendente', new: 'Novo' }

function planBadge(plans: string[]) {
  if (plans.includes('diet') && plans.includes('workout')) return { text: 'Dieta + Treino', css: 'bg-blue-100 text-blue-700' }
  if (plans.includes('diet')) return { text: 'Só Dieta', css: 'bg-green-100 text-green-700' }
  if (plans.includes('workout')) return { text: 'Só Treino', css: 'bg-orange-100 text-orange-700' }
  return { text: 'Sem plano', css: 'bg-gray-100 text-gray-500' }
}

export default function AlunosPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [students, setStudents] = useState<Student[]>(mockStudents)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'diet' | 'workout' | 'both'>('all')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('nt_user')
    if (!stored) { router.push('/'); return }
    const u = JSON.parse(stored)
    if (u.role !== 'professional') { router.push('/portal'); return }
    setUser({ name: u.name, jobRole: u.jobRole })
    setStudents(getAllStudents())
  }, [router])

  function handleAdd(s: Student) {
    setStudents(prev => [...prev, s])
    setShowModal(false)
  }

  if (!user) return null

  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
    if (filter === 'diet') return matchSearch && s.plans.includes('diet') && !s.plans.includes('workout')
    if (filter === 'workout') return matchSearch && s.plans.includes('workout') && !s.plans.includes('diet')
    if (filter === 'both') return matchSearch && s.plans.includes('diet') && s.plans.includes('workout')
    return matchSearch
  })

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userName={user.name} userRole={user.jobRole} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-7 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-[17px] font-bold text-gray-900">Alunos</h1>
            <p className="text-xs text-gray-400 mt-0.5">{students.length} alunos cadastrados</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            + Novo Aluno
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-6">
          <div className="flex flex-wrap gap-3 mb-5">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="🔍  Buscar aluno..."
              className="px-4 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-green-500 w-full sm:w-64"
            />
            <div className="flex gap-2 flex-wrap">
              {(['all', 'both', 'diet', 'workout'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    filter === f ? 'bg-slate-900 text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {f === 'all' ? 'Todos' : f === 'both' ? 'Dieta + Treino' : f === 'diet' ? 'Só Dieta' : 'Só Treino'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {/* Add card */}
            <button
              onClick={() => setShowModal(true)}
              className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-6 text-center hover:border-green-400 hover:bg-green-50/30 transition-all group flex flex-col items-center justify-center gap-3 min-h-[160px]"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-green-100 flex items-center justify-center text-2xl transition-colors">
                +
              </div>
              <div>
                <div className="font-bold text-gray-500 group-hover:text-green-700 text-sm transition-colors">Cadastrar novo aluno</div>
                <div className="text-xs text-gray-400 mt-0.5">Clique para adicionar</div>
              </div>
            </button>

            {filtered.map(s => {
              const { text, css } = planBadge(s.plans)
              return (
                <Link
                  key={s.id}
                  href={`/alunos/${s.id}`}
                  className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md hover:border-gray-300 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${s.avatarColor} flex items-center justify-center text-sm font-bold text-white flex-shrink-0`}>
                        {s.initials}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm">{s.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{s.email}</div>
                      </div>
                    </div>
                    <span className={`text-[11px] font-semibold px-2 py-1 rounded-full flex-shrink-0 ${STATUS_COLORS[s.status]}`}>
                      {STATUS_LABELS[s.status]}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${css}`}>{text}</span>
                    {(s.age > 0 || s.weight > 0) && (
                      <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                        {s.age > 0 ? `${s.age} anos` : ''}{s.age > 0 && s.weight > 0 ? ' · ' : ''}{s.weight > 0 ? `${s.weight}kg` : ''}
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-gray-400">
                    <span className="font-medium text-gray-600">Objetivo:</span> {s.goal}
                  </div>
                  <div className="mt-1 text-xs text-gray-400">Atualizado: {s.lastUpdate}</div>

                  <div className="mt-4 text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                    Ver perfil →
                  </div>
                </Link>
              )
            })}

            {filtered.length === 0 && search && (
              <div className="col-span-full text-center py-16 text-gray-400">
                <div className="text-4xl mb-3">🔍</div>
                <div className="font-semibold">Nenhum aluno encontrado</div>
                <div className="text-sm mt-1">Tente outro termo de busca</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && <NewStudentModal onClose={() => setShowModal(false)} onAdd={handleAdd} />}
    </div>
  )
}
