'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import NewStudentModal from '@/components/NewStudentModal'
import { students as mockStudents, getAllStudents, Student } from '@/lib/data'

interface User { name: string; jobRole: string }

const STATUS_LABELS: Record<string, string> = { active: 'Ativo', pending: 'Pendente', new: 'Novo' }
const STATUS_COLORS: Record<string, string> = {
  active: 'text-green-700 bg-green-100',
  pending: 'text-orange-700 bg-orange-100',
  new: 'text-blue-700 bg-blue-100',
}

function planBadge(plans: string[]) {
  if (plans.includes('diet') && plans.includes('workout')) return { label: 'Dieta + Treino', css: 'bg-blue-100 text-blue-700' }
  if (plans.includes('diet')) return { label: 'Só Dieta', css: 'bg-green-100 text-green-700' }
  if (plans.includes('workout')) return { label: 'Só Treino', css: 'bg-orange-100 text-orange-700' }
  return { label: 'Sem plano', css: 'bg-gray-100 text-gray-500' }
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [students, setStudents] = useState<Student[]>(mockStudents)
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

  const total = students.length
  const withDiet = students.filter(s => s.plans.includes('diet')).length
  const withWorkout = students.filter(s => s.plans.includes('workout')).length
  const withBoth = students.filter(s => s.plans.includes('diet') && s.plans.includes('workout')).length

  const stats = [
    { label: 'Total de Alunos', value: total, sub: `${total} cadastrados`, subColor: 'text-green-600', bar: 100, barColor: 'bg-green-500' },
    { label: 'Com Dieta', value: withDiet, sub: `${total ? Math.round((withDiet/total)*100) : 0}% do total`, subColor: 'text-blue-600', bar: total ? Math.round((withDiet/total)*100) : 0, barColor: 'bg-blue-500' },
    { label: 'Com Treino', value: withWorkout, sub: `${total ? Math.round((withWorkout/total)*100) : 0}% do total`, subColor: 'text-orange-600', bar: total ? Math.round((withWorkout/total)*100) : 0, barColor: 'bg-orange-500' },
    { label: 'Ambos os Planos', value: withBoth, sub: `${total ? Math.round((withBoth/total)*100) : 0}% do total`, subColor: 'text-purple-600', bar: total ? Math.round((withBoth/total)*100) : 0, barColor: 'bg-purple-500' },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userName={user.name} userRole={user.jobRole} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-7 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-[17px] font-bold text-gray-900">Bom dia, {user.name.split(' ')[0]}! 👋</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            + Novo Aluno
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-6">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {stats.map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-2">{s.label}</div>
                <div className="text-3xl font-black text-gray-900 tracking-tight">{s.value}</div>
                <div className={`text-xs font-semibold mt-1 ${s.subColor}`}>{s.sub}</div>
                <div className="mt-3 h-1 bg-gray-100 rounded-full">
                  <div className={`h-1 rounded-full transition-all ${s.barColor}`} style={{ width: `${s.bar}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Alunos Recentes</h2>
              <Link href="/alunos" className="text-xs font-semibold text-blue-600 hover:underline">
                Ver todos →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wide px-6 py-3">Aluno</th>
                    <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wide px-4 py-3">Planos</th>
                    <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Atualização</th>
                    <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wide px-4 py-3">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {students.slice(-8).reverse().map(s => {
                    const { label, css } = planBadge(s.plans)
                    return (
                      <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${s.avatarColor} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                              {s.initials}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{s.name}</div>
                              <div className="text-xs text-gray-400">{s.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${css}`}>{label}</span>
                        </td>
                        <td className="px-4 py-3.5 hidden md:table-cell">
                          <span className="text-xs text-gray-400">{s.lastUpdate}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[s.status]}`}>
                            {STATUS_LABELS[s.status]}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <Link href={`/alunos/${s.id}`} className="text-xs font-semibold text-blue-600 hover:underline whitespace-nowrap">
                            Ver perfil →
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showModal && <NewStudentModal onClose={() => setShowModal(false)} onAdd={handleAdd} />}
    </div>
  )
}
