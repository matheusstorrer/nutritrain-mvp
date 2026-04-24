'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

interface Props {
  userName: string
  userRole: string
}

const navItems = [
  { href: '/dashboard', icon: '📊', label: 'Dashboard' },
  { href: '/alunos', icon: '👥', label: 'Alunos' },
]

const planItems = [
  { href: '/planos?tipo=dieta', icon: '🥗', label: 'Alimentares' },
  { href: '/planos?tipo=treino', icon: '💪', label: 'Treinos' },
]

export default function Sidebar({ userName, userRole }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  function logout() {
    localStorage.removeItem('nt_user')
    router.push('/')
  }

  return (
    <aside className="w-60 shrink-0 bg-slate-900 flex flex-col h-screen sticky top-0 overflow-y-auto no-scrollbar print:hidden">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-lg flex-shrink-0">
            🥗
          </div>
          <div>
            <div className="text-white font-bold text-[15px] leading-none">NutriTrain</div>
            <div className="text-white/30 text-[10px] mt-0.5">Pro</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <div className="text-white/25 text-[10px] font-bold uppercase tracking-[2px] px-2 pb-2">
          Menu
        </div>
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium mb-0.5 transition-all ${
                active
                  ? 'bg-green-500/10 text-green-400'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}

        <div className="mt-4 pt-4 border-t border-white/[0.06]">
          <div className="text-white/25 text-[10px] font-bold uppercase tracking-[2px] px-2 pb-2">
            Planos
          </div>
          {planItems.map((item) => {
            const active = pathname.startsWith('/planos')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium mb-0.5 transition-all ${
                  active && pathname === '/planos'
                    ? 'bg-green-500/10 text-green-400'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                <span className="text-base w-5 text-center">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-[13px] font-bold text-white flex-shrink-0">
            {userName[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-[13px] font-semibold truncate">{userName}</div>
            <div className="text-white/35 text-[10px]">{userRole}</div>
          </div>
          <button
            onClick={logout}
            className="text-white/25 hover:text-white/60 text-sm transition-colors"
            title="Sair"
          >
            ↩
          </button>
        </div>
      </div>
    </aside>
  )
}
