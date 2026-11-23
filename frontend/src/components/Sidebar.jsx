import React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  FiBarChart2,
  FiFileText,
  FiMap,
  FiMic,
  FiPlus,
  FiSidebar,
  FiLogOut,
  FiX,
  FiStar,
} from 'react-icons/fi'
import { GiTwoCoins } from 'react-icons/gi'

const NAV_ITEMS = [
  { icon: FiFileText, label: 'Resume Builder', path: '/resume' },
  { icon: FiStar, label: 'Resume Scorer', path: '/scorer' },
  { icon: FiMap, label: 'Career Roadmap', path: '/roadmap' },
]

function Sidebar({ user, onNewInterview, onLogout, sidebarOpen, setSidebarOpen, moblieOpen, setMoblieOpen }) {
  const navigate = useNavigate()
  const location = useLocation()
  const avatar = user?.name
    ? user.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  const inner = (
    <div className="flex h-full flex-col">
      <div className={`flex h-[72px] shrink-0 items-center border-b border-slate-100 px-5 ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
        {sidebarOpen && (
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-3">
            <div className="brand-mark flex h-9 w-9 items-center justify-center rounded-xl text-white">
              <FiMic size={17} />
            </div>
            <span className="text-[15px] font-bold tracking-tight text-slate-950">FresherAI</span>
          </button>
        )}
        <button
          onClick={() => setSidebarOpen?.(!sidebarOpen)}
          className="hidden h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 md:flex"
        >
          <FiSidebar size={16} />
        </button>
        <button
          onClick={() => setMoblieOpen?.(false)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 md:hidden"
        >
          <FiX size={17} />
        </button>
      </div>

      <div className="p-3">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onNewInterview}
          className={`flex h-11 w-full items-center rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(37,99,235,.18)] hover:bg-blue-700 ${sidebarOpen ? 'gap-2 px-4' : 'justify-center'}`}
        >
          <FiPlus size={16} />
          {sidebarOpen && <span>New interview</span>}
        </motion.button>
      </div>

      {sidebarOpen && (
        <p className="px-5 pb-2 pt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Workspace</p>
      )}

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path)
                setMoblieOpen?.(false)
              }}
              className={`flex h-10 w-full items-center rounded-xl text-sm transition ${sidebarOpen ? 'gap-3 px-3' : 'justify-center'} ${
                active
                  ? 'bg-blue-50 font-semibold text-blue-700'
                  : 'font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={16} />
              {sidebarOpen && item.label}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-slate-100 p-3">
        {sidebarOpen && (
          <button
            onClick={() => navigate('/billing')}
            className="mb-3 flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5 text-left hover:border-slate-300"
          >
            <span className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600"><GiTwoCoins size={16} /></span>
              <span>
                <span className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Balance</span>
                <span className="block text-sm font-bold text-slate-900">{user?.interviewCoin ?? 0} coins</span>
              </span>
            </span>
            <FiPlus size={14} className="text-slate-400" />
          </button>
        )}

        <div className={`flex items-center ${sidebarOpen ? 'gap-3 px-1' : 'justify-center'}`}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">{avatar}</div>
          {sidebarOpen && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-900">{user?.name ?? 'User'}</p>
              <p className="truncate text-[10px] text-slate-400">{user?.email ?? ''}</p>
            </div>
          )}
          {sidebarOpen && (
            <button onClick={onLogout} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Log out">
              <FiLogOut size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <motion.aside
        animate={{ width: sidebarOpen ? 248 : 72 }}
        className="fixed left-0 top-0 z-40 hidden h-screen border-r border-slate-200 bg-white md:flex"
      >
        {inner}
      </motion.aside>
      <AnimatePresence>
        {moblieOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMoblieOpen(false)} className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-sm md:hidden" />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} className="fixed left-0 top-0 z-50 h-screen w-[280px] border-r border-slate-200 bg-white md:hidden">
              {inner}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar
