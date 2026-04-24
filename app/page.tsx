'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { professionals, getAllStudents } from '@/lib/data'

export default function LoginPage() {
  const router = useRouter()
  const [role, setRole] = useState<'professional' | 'student'>('professional')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('nt_user')
    if (stored) {
      const u = JSON.parse(stored)
      router.push(u.role === 'student' ? '/portal' : '/dashboard')
    }
  }, [router])

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    setTimeout(() => {
      if (role === 'professional') {
        const found = professionals.find((p) => p.email === email && p.password === password)
        if (found) {
          localStorage.setItem('nt_user', JSON.stringify({ name: found.name, role: 'professional', jobRole: found.role }))
          router.push('/dashboard')
        } else {
          setError('Email ou senha incorretos.')
          setLoading(false)
        }
      } else {
        const found = getAllStudents().find((s) => s.email === email && s.password === password)
        if (found) {
          localStorage.setItem('nt_user', JSON.stringify({ name: found.name, role: 'student', studentId: found.id }))
          router.push('/portal')
        } else {
          setError('Email ou senha incorretos.')
          setLoading(false)
        }
      }
    }, 600)
  }

  function fillDemo(type: 'pro' | 'student') {
    if (type === 'pro') {
      setRole('professional')
      setEmail('ana@nutritrain.pro')
      setPassword('pro123')
    } else {
      setRole('student')
      setEmail('maria@email.com')
      setPassword('aluno123')
    }
    setError('')
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 bg-gradient-to-br from-slate-900 via-[#1e3a5f] to-[#0f4c35] px-16 py-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-xl">
            🥗
          </div>
          <span className="text-white font-bold text-lg">NutriTrain Pro</span>
        </div>

        <div>
          <h1 className="text-white text-5xl font-black leading-tight tracking-tight mb-5">
            Nutrição e<br />treino em<br />
            <span className="text-green-400">um só lugar.</span>
          </h1>
          <p className="text-white/50 text-base leading-relaxed mb-10">
            Acesse seus planos alimentares e de treino a qualquer hora, de qualquer dispositivo.
          </p>
          <div className="flex flex-col gap-3">
            {[
              '🥗 Planos alimentares personalizados',
              '💪 Treinos por dia da semana',
              '📄 Exportação em PDF',
              '⚡ Atualizações em tempo real',
            ].map((f) => (
              <div key={f} className="flex items-center gap-3 text-white/60 text-sm">
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-white/20 text-xs">NutriTrain Pro · 2025</div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-base">🥗</div>
            <span className="font-bold text-slate-900">NutriTrain Pro</span>
          </div>

          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Bem-vindo</h2>
          <p className="text-gray-400 text-sm mb-8">Entre com sua conta para continuar</p>

          {/* Role Switch */}
          <div className="grid grid-cols-2 gap-2 mb-7 p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => { setRole('professional'); setError('') }}
              className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
                role === 'professional'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              👩‍⚕️ Profissional
            </button>
            <button
              onClick={() => { setRole('student'); setError('') }}
              className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
                role === 'student'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              🏃 Sou Aluno
            </button>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={role === 'professional' ? 'ana@nutritrain.pro' : 'maria@email.com'}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder:text-gray-300 focus:outline-none focus:border-green-500 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder:text-gray-300 focus:outline-none focus:border-green-500 focus:bg-white transition-colors"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl text-sm transition-colors disabled:opacity-60"
            >
              {loading ? 'Entrando...' : 'Entrar na plataforma →'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-7 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
              Acessos para demonstração
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => fillDemo('pro')}
                className="flex items-center justify-between text-xs text-left hover:bg-white rounded-lg p-2 transition-colors group"
              >
                <div>
                  <span className="font-semibold text-gray-700">👩‍⚕️ Profissional</span>
                  <div className="text-gray-400 font-mono mt-0.5">ana@nutritrain.pro · pro123</div>
                </div>
                <span className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold">
                  Preencher →
                </span>
              </button>
              <button
                onClick={() => fillDemo('student')}
                className="flex items-center justify-between text-xs text-left hover:bg-white rounded-lg p-2 transition-colors group"
              >
                <div>
                  <span className="font-semibold text-gray-700">🏃 Aluno (Maria)</span>
                  <div className="text-gray-400 font-mono mt-0.5">maria@email.com · aluno123</div>
                </div>
                <span className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold">
                  Preencher →
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
